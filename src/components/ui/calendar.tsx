"use client"

import { useState } from "react"

export function SimpleCalendar({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  return (
    <input
      type="date"
      className="border rounded px-2 py-1"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  )
}
