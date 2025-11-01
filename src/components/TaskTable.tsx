"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useData } from "@/context/DataContext"
import { Spinner } from "@/components/ui/spinner"
import { Pagination } from "@/components/ui/pagination"
import { TaskFormDialog } from "@/components/TaskManager"

const statusVariant = (status: string | undefined) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string | undefined) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

export function TasksTable() {
  const { tasks, members, projects, deleteTask, settings } = useData()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = settings?.itemsPerPage ?? 5

  // simulate loading when tasks change
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [tasks])

  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize))

  const paged = useMemo(() => tasks.slice((page - 1) * pageSize, page * pageSize), [tasks, page, pageSize])

  return (
    <div className="rounded-md border p-2">
      {loading ? (
        <div className="flex items-center justify-center p-6">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div />
            <TaskFormDialog onSaved={() => {}}>
              <Button>Crear tarea</Button>
            </TaskFormDialog>
          </div>

          <Table>
            <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead>Tarea</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Fecha límite</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{task.description}</TableCell>
                  <TableCell>{projects.find((p) => p.id === task.projectId)?.name ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>{members.find((m) => m.userId === task.userId)?.name ?? "-"}</TableCell>
                  <TableCell>{task.dateline}</TableCell>
                  <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                      <TaskFormDialog task={task} onSaved={() => {}}>
                        <Button variant="ghost" size="sm">Editar</Button>
                      </TaskFormDialog>
                      <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id!)}>
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div />
            <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
          </div>
        </>
      )}
    </div>
  )
}
