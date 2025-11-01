"use client"

import { useState } from "react"
import { useData } from "@/context/DataContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Alert } from "@/components/ui/alert"

export function SettingsForm() {
  const { settings, updateSettings } = useData()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [form, setForm] = useState({ siteName: settings.siteName, themeColor: settings.themeColor, itemsPerPage: settings.itemsPerPage, enableNotifications: settings.enableNotifications, defaultTaskDuration: settings.defaultTaskDuration })

  const handleSave = () => {
    setError("")
    setSaving(true)
    setTimeout(() => {
      updateSettings({ siteName: form.siteName, themeColor: form.themeColor, itemsPerPage: Number(form.itemsPerPage), enableNotifications: Boolean(form.enableNotifications), defaultTaskDuration: Number(form.defaultTaskDuration) })
      setSaving(false)
      setSuccess("Configuración guardada")
      setTimeout(() => setSuccess(""), 1500)
    }, 600)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
        <CardDescription>Administra las preferencias de tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <Alert title="Error" description={error} variant="destructive" />}
        {success && <Alert title="Éxito" description={success} variant="default" />}

        <div className="grid gap-4">
          <div>
            <Label>Nombre del sitio</Label>
            <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
          </div>
          <div>
            <Label>Tema (color)</Label>
            <select value={form.themeColor} onChange={(e) => setForm({ ...form, themeColor: e.target.value })} className="border rounded px-2 py-1">
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="destructive">Destructive</option>
            </select>
          </div>
          <div>
            <Label>Items por página (paginación)</Label>
            <input type="number" value={form.itemsPerPage} onChange={(e) => setForm({ ...form, itemsPerPage: Number(e.target.value) })} className="border rounded px-2 py-1" />
          </div>
          <div>
            <Label>Notificaciones habilitadas</Label>
            <input type="checkbox" checked={!!form.enableNotifications} onChange={(e) => setForm({ ...form, enableNotifications: e.target.checked })} />
          </div>
          <div>
            <Label>Duración por defecto de tarea (horas)</Label>
            <input type="number" value={form.defaultTaskDuration} onChange={(e) => setForm({ ...form, defaultTaskDuration: Number(e.target.value) })} className="border rounded px-2 py-1" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>{saving ? <Spinner className="h-4 w-4" /> : "Guardar"}</Button>
            <Button variant="outline" onClick={() => setForm({ siteName: settings.siteName, themeColor: settings.themeColor, itemsPerPage: settings.itemsPerPage, enableNotifications: settings.enableNotifications, defaultTaskDuration: settings.defaultTaskDuration })}>Restablecer</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
