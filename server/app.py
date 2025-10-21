from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from pathlib import Path
from datetime import datetime

# Paths
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR.parent / 'client' / 'dist'
DB_PATH = BASE_DIR / 'expenses.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                amount REAL NOT NULL,
                category TEXT NOT NULL,
                type TEXT CHECK(type IN ('income','expense')) NOT NULL,
                date TEXT NOT NULL
            )
            """
        )
        conn.commit()

app = Flask(
    __name__,
    static_folder=str(STATIC_DIR),  # serve built frontend
    static_url_path='',             # mount static at '/'
)
CORS(app)

# Initialize database at import time (Flask 3 removed before_first_request)
init_db()

@app.get('/api/health')
def health():
    return jsonify({"status": "ok"})

@app.get('/api/expenses')
def list_expenses():
    with get_db_connection() as conn:
        rows = conn.execute("SELECT * FROM expenses ORDER BY date DESC, id DESC").fetchall()
        return jsonify([dict(r) for r in rows])

@app.post('/api/expenses')
def create_expense():
    data = request.get_json(force=True)
    title = data.get('title')
    amount = data.get('amount')
    category = data.get('category')
    txn_type = data.get('type')
    date = data.get('date') or datetime.utcnow().date().isoformat()

    if not title or amount is None or not category or txn_type not in ('income','expense'):
        return jsonify({"error": "Invalid payload"}), 400

    with get_db_connection() as conn:
        cur = conn.execute(
            "INSERT INTO expenses (title, amount, category, type, date) VALUES (?,?,?,?,?)",
            (title, float(amount), category, txn_type, date),
        )
        conn.commit()
        new_id = cur.lastrowid
        row = conn.execute("SELECT * FROM expenses WHERE id=?", (new_id,)).fetchone()
        return jsonify(dict(row)), 201

@app.put('/api/expenses/<int:expense_id>')
def update_expense(expense_id: int):
    data = request.get_json(force=True)
    fields = []
    values = []
    for key in ('title','amount','category','type','date'):
        if key in data and data[key] is not None:
            if key == 'type' and data[key] not in ('income','expense'):
                return jsonify({"error": "Invalid type"}), 400
            fields.append(f"{key}=?")
            if key == 'amount':
                values.append(float(data[key]))
            else:
                values.append(data[key])
    if not fields:
        return jsonify({"error": "No fields to update"}), 400

    with get_db_connection() as conn:
        conn.execute(f"UPDATE expenses SET {', '.join(fields)} WHERE id=?", (*values, expense_id))
        conn.commit()
        row = conn.execute("SELECT * FROM expenses WHERE id=?", (expense_id,)).fetchone()
        if not row:
            return jsonify({"error": "Not found"}), 404
        return jsonify(dict(row))

@app.delete('/api/expenses/<int:expense_id>')
def delete_expense(expense_id: int):
    with get_db_connection() as conn:
        cur = conn.execute("DELETE FROM expenses WHERE id=?", (expense_id,))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({"error": "Not found"}), 404
        return ('', 204)

@app.get('/api/summary')
def summary():
    with get_db_connection() as conn:
        totals = conn.execute(
            "SELECT type, SUM(amount) as total FROM expenses GROUP BY type"
        ).fetchall()
        by_category = conn.execute(
            "SELECT category, SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as spent FROM expenses GROUP BY category"
        ).fetchall()
        income_total = 0.0
        expense_total = 0.0
        for r in totals:
            if r['type'] == 'income':
                income_total = r['total'] or 0.0
            elif r['type'] == 'expense':
                expense_total = r['total'] or 0.0
        return jsonify({
            "income": income_total,
            "expenses": expense_total,
            "balance": income_total - expense_total,
            "byCategory": [{"category": r['category'], "spent": r['spent'] or 0.0} for r in by_category]
        })

# Serve frontend (must be defined after API routes)
@app.get('/')
def root_index():
    return app.send_static_file('index.html')

@app.get('/<path:path>')
def static_catch_all(path: str):
    # If a static asset exists, serve it; otherwise fall back to SPA entry
    candidate = STATIC_DIR / path
    if candidate.exists() and candidate.is_file():
        return app.send_static_file(path)
    # Avoid hijacking unknown API routes
    if path.startswith('api/'):
        return jsonify({"error": "Not found"}), 404
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
