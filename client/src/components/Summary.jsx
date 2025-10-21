import React from 'react'

export function Summary({ summary }) {
  return (
    <div className="card summary">
      <div>
        <div className="label">Income</div>
        <div className="value positive">${summary.income.toFixed(2)}</div>
      </div>
      <div>
        <div className="label">Expenses</div>
        <div className="value negative">${summary.expenses.toFixed(2)}</div>
      </div>
      <div>
        <div className="label">Balance</div>
        <div className={`value ${summary.balance>=0?'positive':'negative'}`}>${summary.balance.toFixed(2)}</div>
      </div>
    </div>
  )
}
