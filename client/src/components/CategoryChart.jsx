import React, { useMemo } from 'react'
import { Pie, PieChart, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts'
import { formatINR } from '../utils/currency'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA66CC', '#FF6699']

export function CategoryChart({ items }) {
  const data = useMemo(() => {
    const totals = {}
    items.forEach(e => {
      if (e.type !== 'expense') return
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount)
    })
    return Object.entries(totals).map(([category, value]) => ({ name: category, value }))
  }, [items])

  if (!data.length) return <div className="card">No expenses yet for chart</div>

  return (
    <div className="card">
      <h3>Spending by Category</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatINR(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
