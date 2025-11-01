"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SimpleCalendar } from "@/components/ui/calendar"
import { useData } from "@/context/DataContext"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Alert } from "@/components/ui/alert"

export function TaskFormDialog({ task, children, onSaved }: { task?: any; children?: React.ReactNode; onSaved?: () => void }) {
  const isEdit = !!task
  const { addTask, updateTask, projects, members } = useData()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    description: task?.description ?? "",
    projectId: task?.projectId ?? "",
    status: task?.status ?? "Pendiente",
    priority: task?.priority ?? "Media",
    userId: task?.userId ?? "",
    dateline: task?.dateline ?? "",
  })

  // reset when opening for edit/new
  const openDialog = () => {
    if (isEdit && task) {
      setForm({ description: task.description, projectId: task.projectId ?? "", status: task.status ?? "Pendiente", priority: task.priority ?? "Media", userId: task.userId ?? "", dateline: task.dateline ?? "" })
    } else {
      setForm({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" })
    }
    setError("")
    setOpen(true)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!form.description) {
      setError("La descripción es obligatoria")
      return
    }
    setError("")
    setSaving(true)
    setTimeout(() => {
      if (isEdit && task) {
        updateTask(task.id, form)
      } else {
        addTask(form)
      }
      setSaving(false)
      setOpen(false)
      onSaved && onSaved()
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span onClick={openDialog}>{children ?? <Button>{isEdit ? 'Editar' : 'Crear tarea'}</Button>}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Tarea' : 'Crear Nueva Tarea'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Modifica los campos de la tarea' : 'Completa la información para crear la tarea'}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 py-4">
            {error && <Alert title="Error" description={error} variant="destructive" />}
            <div>
              <Label>Descripción</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Proyecto</Label>
              <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className="border rounded px-2 py-1 w-full">
                <option value="">-- Selecciona proyecto --</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En progreso">En progreso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prioridad</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Asignado a</Label>
              <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="border rounded px-2 py-1 w-full">
                <option value="">-- Ninguno --</option>
                {members.map((m) => <option key={m.userId} value={m.userId}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Fecha límite</Label>
              <SimpleCalendar value={form.dateline} onChange={(v) => setForm({ ...form, dateline: v })} />
            </div>
          </div>
          <DialogFooter>
            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit">{saving ? <Spinner className="h-4 w-4" /> : (isEdit ? 'Guardar' : 'Crear')}</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
