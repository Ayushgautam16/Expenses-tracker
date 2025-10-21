import React, { useEffect, useMemo, useState } from 'react'

const DEFAULT = { title: '', amount: '', category: 'General', type: 'expense', date: new Date().toISOString().slice(0,10) }

export function ExpenseForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(DEFAULT)

  useEffect(() => {
    if (initial) setForm({ ...initial, amount: String(initial.amount) })
    else setForm(DEFAULT)
  }, [initial])

  const canSubmit = useMemo(() => {
    return form.title.trim() && form.amount && !Number.isNaN(Number(form.amount))
  }, [form])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ ...form, amount: Number(form.amount) })
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>{initial ? 'Edit' : 'Add'} Entry</h3>
      <label>
        <span>Title</span>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      </label>
      <label>
        <span>Amount</span>
        <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
      </label>
      <label>
        <span>Category</span>
        <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
      </label>
      <label>
        <span>Type</span>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </label>
      <label>
        <span>Date</span>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      </label>
      <div className="actions">
        <button type="submit" disabled={!canSubmit} className="btn btn-primary">{initial ? 'Update' : 'Add'}</button>
        {initial && <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>}
      </div>
    </form>
  )
}
