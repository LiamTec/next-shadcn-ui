"use client"

import { ReactNode } from "react"

export function Alert({ title, description, variant = "default" }: { title?: string; description?: string; variant?: string; }) {
  const base = "p-4 rounded-md border"
  const variantClass =
    variant === "destructive"
      ? "bg-destructive/10 border-destructive text-destructive"
      : "bg-secondary/5 border-secondary text-secondary"

  return (
    <div className={`${base} ${variantClass}`}>
      {title && <div className="font-medium">{title}</div>}
      {description && <div className="text-sm text-muted-foreground">{description}</div>}
    </div>
  )
}
