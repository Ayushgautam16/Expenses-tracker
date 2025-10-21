import React from 'react'
import { formatINR } from '../utils/currency'

export function ExpenseList({ items, onEdit, onDelete }) {
  if (!items.length) return <div className="card">No items</div>
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Type</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{formatINR(item.amount)}</td>
              <td>{item.category}</td>
              <td>{item.type}</td>
              <td>{item.date}</td>
              <td>
                <button className="btn btn-ghost" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn btn-danger" onClick={() => onDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
