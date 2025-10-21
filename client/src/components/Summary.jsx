import React from 'react'
import { formatINR } from '../utils/currency'

export function Summary({ summary }) {
  return (
    <div className="card summary">
      <div>
        <div className="label">Income</div>
        <div className="value positive">{formatINR(summary.income)}</div>
      </div>
      <div>
        <div className="label">Expenses</div>
        <div className="value negative">{formatINR(summary.expenses)}</div>
      </div>
      <div>
        <div className="label">Balance</div>
        <div className={`value ${summary.balance>=0?'positive':'negative'}`}>{formatINR(summary.balance)}</div>
      </div>
    </div>
  )
}
