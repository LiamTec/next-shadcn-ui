"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Project = {
  id: string
  name: string
  description?: string
  category?: string
  priority?: string
  members?: string[]
}

type Member = {
  userId: string
  role?: string
  name: string
  email: string
  position?: string
  birthdate?: string
  phone?: string
  projectId?: string
  isActive?: boolean
}

type Task = {
  id: string
  description: string
  projectId?: string
  status?: string
  priority?: string
  userId?: string
  dateline?: string
}

type DataContextType = {
  projects: Project[]
  members: Member[]
  tasks: Task[]
  settings: {
    siteName: string
    themeColor: string
    itemsPerPage: number
    enableNotifications: boolean
    defaultTaskDuration: number
  }
  addProject: (p: Partial<Project>) => void
  deleteProject: (id: string) => void
  addMember: (m: Member) => void
  updateMember: (userId: string, patch: Partial<Member>) => void
  deleteMember: (userId: string) => void
  addTask: (t: Partial<Task>) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  updateSettings: (s: Partial<DataContextType["settings"]>) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function uniqBy<T>(arr: T[], getKey: (t: T) => string) {
  const seen = new Set<string>()
  return arr.filter((item) => {
    const k = getKey(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const raw = localStorage.getItem("app:projects")
      if (raw) return uniqBy(JSON.parse(raw) as Project[], (p) => p.id)
    } catch (e) {
      // ignore
    }
    return [
      { id: "p1", name: "E-commerce Platform", description: "Plataforma e-commerce", category: "web", priority: "high", members: ["u1", "u2"] },
      { id: "p2", name: "Mobile App", description: "App móvil", category: "mobile", priority: "medium", members: ["u3"] },
    ]
  })

  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const raw = localStorage.getItem("app:members")
      if (raw) return uniqBy(JSON.parse(raw) as Member[], (m) => m.userId)
    } catch (e) {
      // ignore
    }
    return [
      { userId: "u1", name: "María García", email: "maria@example.com", role: "Frontend", position: "Senior", birthdate: "1990-05-12", phone: "123456789", projectId: "p1", isActive: true },
      { userId: "u2", name: "Juan Pérez", email: "juan@example.com", role: "Backend", position: "Mid", birthdate: "1988-02-20", phone: "987654321", projectId: "p1", isActive: true },
      { userId: "u3", name: "Ana López", email: "ana@example.com", role: "Designer", position: "Junior", birthdate: "1995-11-01", phone: "555444333", projectId: "p2", isActive: true },
    ]
  })

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem("app:tasks")
      if (raw) return uniqBy(JSON.parse(raw) as Task[], (t) => t.id)
    } catch (e) {
      // ignore
    }
    return [
      { id: "t1", description: "Implementar autenticación", projectId: "p1", status: "En progreso", priority: "Alta", userId: "u1", dateline: "2025-11-15" },
      { id: "t2", description: "Diseñar pantalla de perfil", projectId: "p2", status: "Pendiente", priority: "Media", userId: "u3", dateline: "2025-11-20" },
    ]
  })

  const [settings, setSettings] = useState<DataContextType["settings"]>(() => {
    try {
      const raw = localStorage.getItem("app:settings")
      if (raw) return JSON.parse(raw)
    } catch (e) {
      // ignore
    }
    return {
      siteName: "Mi Dashboard",
      themeColor: "primary",
      itemsPerPage: 5,
      enableNotifications: true,
      defaultTaskDuration: 8,
    }
  })

  const addProject = (p: Partial<Project>) => setProjects((s) => [...s, { id: uid("p"), members: [], ...p } as Project])
  const deleteProject = (id: string) => {
    setProjects((s) => s.filter((x) => x.id !== id))
    // also disassociate tasks and members
    setTasks((t) => t.map((tk) => (tk.projectId === id ? { ...tk, projectId: undefined } : tk)))
    setMembers((m) => m.map((mm) => (mm.projectId === id ? { ...mm, projectId: undefined } : mm)))
  }

  const addMember = (m: Member) => {
    setMembers((s) => {
      if (s.find((x) => x.userId === m.userId)) {
        // duplicate userId — ignore
        console.warn(`addMember: userId ${m.userId} already exists`) // eslint-disable-line no-console
        return s
      }
      return [...s, m]
    })
  }
  const updateMember = (userId: string, patch: Partial<Member>) => setMembers((s) => s.map((m) => (m.userId === userId ? { ...m, ...patch } : m)))
  const deleteMember = (userId: string) => {
    setMembers((s) => s.filter((m) => m.userId !== userId))
    setTasks((t) => t.map((tk) => (tk.userId === userId ? { ...tk, userId: undefined } : tk)))
  }

  const addTask = (t: Partial<Task>) => setTasks((s) => [...s, { id: uid("t"), ...t } as Task])
  const updateTask = (id: string, patch: Partial<Task>) => setTasks((s) => s.map((tk) => (tk.id === id ? { ...tk, ...patch } : tk)))
  const deleteTask = (id: string) => setTasks((s) => s.filter((tk) => tk.id !== id))

  const updateSettings = (s: Partial<DataContextType["settings"]>) => setSettings((prev) => ({ ...prev, ...s }))

  // persist to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem("app:projects", JSON.stringify(projects))
    } catch (e) {}
  }, [projects])

  useEffect(() => {
    try {
      localStorage.setItem("app:members", JSON.stringify(members))
    } catch (e) {}
  }, [members])

  useEffect(() => {
    try {
      localStorage.setItem("app:tasks", JSON.stringify(tasks))
    } catch (e) {}
  }, [tasks])

  useEffect(() => {
    try {
      localStorage.setItem("app:settings", JSON.stringify(settings))
    } catch (e) {}
  }, [settings])

  return (
    <DataContext.Provider
      value={{ projects, members, tasks, settings, addProject, deleteProject, addMember, updateMember, deleteMember, addTask, updateTask, deleteTask, updateSettings }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}
