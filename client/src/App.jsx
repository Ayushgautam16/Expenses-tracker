import React, { useEffect, useMemo, useState } from 'react'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { Summary } from './components/Summary'
import { CategoryChart } from './components/CategoryChart'
import { ColorButton } from './components/ColorButton'

const API = '/api'

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [accent, setAccent] = useState(() => localStorage.getItem('accent') || '#6366f1')

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/expenses`)
      if (!res.ok) throw new Error('Failed to load expenses')
      const data = await res.json()
      setExpenses(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    localStorage.setItem('accent', accent)
  }, [accent])

  const summary = useMemo(() => {
    const income = expenses.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0)
    const out = expenses.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0)
    return { income, expenses: out, balance: income - out }
  }, [expenses])

  const onSubmit = async (payload) => {
    try {
      const method = editing ? 'PUT' : 'POST'
      const url = editing ? `${API}/expenses/${editing.id}` : `${API}/expenses`
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Failed to save')
      setEditing(null)
      await fetchExpenses()
    } catch (e) {
      setError(e.message)
    }
  }

  const onDelete = async (id) => {
    try {
      const res = await fetch(`${API}/expenses/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Delete failed')
      await fetchExpenses()
    } catch (e) {
      setError(e.message)
    }
  }

  const ACCENTS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a855f7']

  return (
    <div>
      <header className="app-header">
        <div className="container header-inner">
          <h1>Expense Tracker</h1>
          <div className="toolbar">
            <div className="palette" title="Choose accent color">
              {ACCENTS.map(c => (
                <ColorButton key={c} color={c} active={accent === c} onClick={() => setAccent(c)} />
              ))}
            </div>
            <button className="btn btn-outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </header>
      <main className="container">
        {error && <div className="error">{error}</div>}
        <Summary summary={summary} />
        <div className="grid">
          <div>
            <ExpenseForm initial={editing} onCancel={() => setEditing(null)} onSubmit={onSubmit} />
          </div>
          <div>
            {loading ? <div className="card">Loading...</div> : (
              <ExpenseList items={expenses} onEdit={setEditing} onDelete={onDelete} />
            )}
          </div>
        </div>
        <CategoryChart items={expenses} />
      </main>
    </div>
  )
}
