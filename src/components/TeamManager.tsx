"use client"

import { useState } from "react"
import { useData } from "@/context/DataContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SimpleCalendar } from "@/components/ui/calendar"
import { Alert } from "@/components/ui/alert"

export function TeamManager() {
  const { members, addMember, updateMember, deleteMember, projects } = useData()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ userId: "", name: "", email: "", role: "", position: "", birthdate: "", phone: "", projectId: "", isActive: "true" })
  const [editing, setEditing] = useState<any | null>(null)

  const handleCreate = () => {
    if (!form.userId || !form.name || !form.email) {
      setError("userId, name y email son obligatorios")
      return
    }
    // prevent duplicates
    if (members.find((mm) => mm.userId === form.userId)) {
      setError("userId ya existe")
      return
    }
    addMember({ userId: form.userId, name: form.name, email: form.email, role: form.role, position: form.position, birthdate: form.birthdate, phone: form.phone, projectId: form.projectId || undefined, isActive: form.isActive === "true" })
    setForm({ userId: "", name: "", email: "", role: "", position: "", birthdate: "", phone: "", projectId: "", isActive: "true" })
    setError("")
    setCreating(false)
  }

  const startEdit = (m: any) => {
    setEditing(m)
    setError("")
  }

  const handleUpdate = () => {
    if (!editing) return
    if (!editing.userId || !editing.name || !editing.email) {
      setError("userId, name y email son obligatorios")
      return
    }
    updateMember(editing.userId, editing)
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Miembros del Equipo</h3>
        <Button onClick={() => setCreating(true)}>Agregar miembro</Button>
      </div>

      {error && <Alert title="Error" description={error} variant="destructive" />}

      {creating && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Miembro</CardTitle>
            <CardDescription>Completa los datos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label>UserId</Label>
              <Input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} />
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Label>Role</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              <Label>Position</Label>
              <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              <Label>Birthdate</Label>
              <SimpleCalendar value={form.birthdate} onChange={(v) => setForm({ ...form, birthdate: v })} />
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Label>Project</Label>
              <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className="border rounded px-2 py-1">
                <option value="">-- Ninguno --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <Button onClick={handleCreate}>Crear</Button>
              <Button variant="outline" onClick={() => setCreating(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editing && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Miembro</CardTitle>
            <CardDescription>Modifica los datos del miembro</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label>UserId</Label>
              <Input value={editing.userId} onChange={(e) => setEditing({ ...editing, userId: e.target.value })} disabled />
              <Label>Nombre</Label>
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Label>Email</Label>
              <Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              <Label>Role</Label>
              <Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              <Label>Position</Label>
              <Input value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} />
              <Label>Birthdate</Label>
              <SimpleCalendar value={editing.birthdate} onChange={(v) => setEditing({ ...editing, birthdate: v })} />
              <Label>Phone</Label>
              <Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
              <Label>Project</Label>
              <select value={editing.projectId} onChange={(e) => setEditing({ ...editing, projectId: e.target.value })} className="border rounded px-2 py-1">
                <option value="">-- Ninguno --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <Button onClick={handleUpdate}>Guardar</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.userId} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{m.name} <span className="text-xs text-muted-foreground">({m.userId})</span></div>
              <div className="text-sm text-muted-foreground">{m.role} - {m.position} - {m.email}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => startEdit(m)}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteMember(m.userId)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
