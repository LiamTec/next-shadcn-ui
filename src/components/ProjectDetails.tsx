"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/context/DataContext"

export function ProjectDetails({ project }: { project: any }) {
  const { members, tasks, deleteProject, deleteTask, updateTask } = useData()

  const projectMembers = members.filter((m) => project.members?.includes(m.userId))
  const projectTasks = tasks.filter((t) => t.projectId === project.id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">Ver detalles</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Proyecto: {project.name}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Miembros</CardTitle>
              <CardDescription>Miembros asignados al proyecto</CardDescription>
            </CardHeader>
            <CardContent>
              {projectMembers.length === 0 ? (
                <div className="text-sm text-muted-foreground">No hay miembros asignados</div>
              ) : (
                <div className="space-y-2">
                  {projectMembers.map((m) => (
                    <div key={m.userId} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-sm text-muted-foreground">{m.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tareas</CardTitle>
              <CardDescription>Tareas relacionadas con este proyecto</CardDescription>
            </CardHeader>
            <CardContent>
              {projectTasks.length === 0 ? (
                <div className="text-sm text-muted-foreground">No hay tareas para este proyecto</div>
              ) : (
                <div className="space-y-2">
                  {projectTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{t.description}</div>
                        <div className="text-sm text-muted-foreground">{t.dateline} • <Badge variant={t.status === 'Completado' ? 'default' : 'secondary'}>{t.status}</Badge></div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => updateTask(t.id, { status: t.status === 'Completado' ? 'Pendiente' : 'Completado' })}>
                          {t.status === 'Completado' ? 'Reabrir' : 'Marcar completado'}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteTask(t.id)}>Eliminar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <div className="flex gap-2 justify-end w-full">
            <Button variant="destructive" onClick={() => { if (confirm('Eliminar proyecto?')) { deleteProject(project.id) } }}>
              Eliminar Proyecto
            </Button>
            <Button variant="outline">Cerrar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
