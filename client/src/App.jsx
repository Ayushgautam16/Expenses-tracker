import React, { useEffect, useMemo, useState } from 'react'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { Summary } from './components/Summary'
import { CategoryChart } from './components/CategoryChart'

const API = '/api'

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

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

  return (
    <div className="container">
      <h1>Expense Tracker</h1>
      {error && <div className="error">{error}</div>}
      <Summary summary={summary} />
      <div className="grid">
        <div>
          <ExpenseForm initial={editing} onCancel={() => setEditing(null)} onSubmit={onSubmit} />
        </div>
        <div>
          {loading ? <div>Loading...</div> : (
            <ExpenseList items={expenses} onEdit={setEditing} onDelete={onDelete} />
          )}
        </div>
      </div>
      <CategoryChart items={expenses} />
    </div>
  )
}
