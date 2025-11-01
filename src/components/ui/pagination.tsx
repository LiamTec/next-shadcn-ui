"use client"

import { Button } from "./button"

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onChange(Math.max(1, page - 1))}>
        Anterior
      </Button>
      <div className="text-sm">{page} / {totalPages}</div>
      <Button variant="ghost" size="sm" onClick={() => onChange(Math.min(totalPages, page + 1))}>
        Siguiente
      </Button>
    </div>
  )
}
