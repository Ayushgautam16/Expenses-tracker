# 💰 Expense Tracker Web App

A simple and responsive **Expense Tracker** web application built using **React** (frontend) and **Flask** (backend).  
This app allows users to **add, edit, and delete transactions**, categorize expenses, and visualize spending through interactive charts.

---

## 🚀 Features

✅ Add income and expense entries  
✅ Edit or delete transactions easily  
✅ Categorize transactions (Food, Rent, Travel, etc.)  
✅ Calculate total income, total expenses, and current balance  
✅ Filter by category or date range  
✅ Visualize spending patterns using charts (Chart.js)  
✅ Lightweight, responsive, and easy to use  

---

## 🧱 Tech Stack

**Frontend:**  
- React.js  
- Chart.js  
- Axios (for API calls)  
- CSS / Tailwind (for styling)

**Backend:**  
- Flask (Python)  
- Flask-CORS  
- SQLite (for database)  

---

## 📂 Project Structure

```
expense-tracker/
│
├── backend/
│   ├── app.py
│   ├── database.db
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### 2️⃣ Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate    # On Windows
# or source venv/bin/activate  # On Mac/Linux
pip install flask flask-cors
python app.py
```
Flask will start on **http://127.0.0.1:5000**

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
React app will start on **http://localhost:3000**

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/transactions` | Get all transactions |
| POST | `/add` | Add a new transaction |
| PUT | `/update/<id>` | Update an existing transaction |
| DELETE | `/delete/<id>` | Delete a transaction |

---

## 🖼️ Screenshots (Optional)
_Add screenshots of your dashboard here_

---

## ✨ Future Improvements
- User authentication (login/signup)
- Monthly summary report
- Export to CSV/Excel
- Dark mode UI
- Cloud database integration (Firebase / MongoDB)

---

## 👨‍💻 Author
**Ayush Gautam**  
[GitHub](https://github.com/Ayushgautam16) | [LinkedIn](https://www.linkedin.com/in/ayush-gautam-9baa14248/)

---

## 🪪 License
This project is licensed under the **MIT License** – feel free to use and modify it.
