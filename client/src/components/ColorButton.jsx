import React from 'react'

export function ColorButton({ color, active, onClick, label }) {
  const ariaLabel = label || `Accent ${color}`
  return (
    <button
      type="button"
      className={`swatch ${active ? 'active' : ''}`}
      style={{ '--swatch': color }}
      aria-label={ariaLabel}
      onClick={onClick}
    />
  )
}
