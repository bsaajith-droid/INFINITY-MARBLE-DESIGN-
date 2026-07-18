import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled"
export type TaskStatus = "todo" | "in-progress" | "completed"

export type ProjectTask = {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignee?: string
  dueDate?: Date
  completedAt?: Date
}

export type Project = {
  id: string
  name: string
  clientName: string
  clientEmail: string
  clientPhone: string
  location: string
  description: string
  status: ProjectStatus
  startDate: Date
  estimatedEndDate: Date
  actualEndDate?: Date
  budget: number
  spent: number
  tasks: ProjectTask[]
  materials: {
    materialId: string
    materialName: string
    quantity: number
    status: "ordered" | "delivered" | "installed"
  }[]
  notes: string[]
  createdAt: Date
  updatedAt: Date
}

type ProjectStore = {
  projects: Project[]
  createProject: (project: Omit<Project, "id" | "tasks" | "notes" | "createdAt" | "updatedAt" | "spent" | "actualEndDate">) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  addTask: (projectId: string, task: Omit<ProjectTask, "id" | "completedAt">) => void
  updateTask: (projectId: string, taskId: string, updates: Partial<ProjectTask>) => void
  deleteTask: (projectId: string, taskId: string) => void
  addNote: (projectId: string, note: string) => void
  getProjectById: (id: string) => Project | undefined
}

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}-${random}`.toUpperCase()
}

// Sample projects for demo
const sampleProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "Pearl Tower Lobby Renovation",
    clientName: "Al Faisal Properties",
    clientEmail: "projects@alfaisal.qa",
    clientPhone: "+974 4421 5500",
    location: "West Bay, Doha",
    description: "Complete renovation of the main lobby with premium marble flooring and feature walls.",
    status: "in-progress",
    startDate: new Date("2024-01-15"),
    estimatedEndDate: new Date("2024-03-30"),
    budget: 850000,
    spent: 425000,
    tasks: [
      { id: "T1", title: "Material selection approved", description: "Client approved Calacatta Gold for main floor", status: "completed", completedAt: new Date("2024-01-20") },
      { id: "T2", title: "Flooring installation", description: "Install marble flooring in main lobby area", status: "in-progress", dueDate: new Date("2024-02-28") },
      { id: "T3", title: "Feature wall installation", description: "Install backlit onyx feature wall", status: "todo", dueDate: new Date("2024-03-15") },
    ],
    materials: [
      { materialId: "calacatta-gold", materialName: "Calacatta Gold", quantity: 450, status: "delivered" },
      { materialId: "honey-onyx", materialName: "Honey Onyx", quantity: 25, status: "ordered" },
    ],
    notes: ["Client requested gold accent strips between marble tiles", "Site visit scheduled for Feb 15"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "PRJ-002",
    name: "Villa Al Sadd Master Bath",
    clientName: "Mohammed Al Thani",
    clientEmail: "m.althani@email.qa",
    clientPhone: "+974 5555 1234",
    location: "Al Sadd, Doha",
    description: "Luxury master bathroom with Statuario marble throughout.",
    status: "planning",
    startDate: new Date("2024-02-20"),
    estimatedEndDate: new Date("2024-04-15"),
    budget: 180000,
    spent: 0,
    tasks: [
      { id: "T1", title: "Site measurements", description: "Take detailed measurements of bathroom", status: "completed", completedAt: new Date("2024-02-10") },
      { id: "T2", title: "Design approval", description: "Get client approval on final design", status: "in-progress", dueDate: new Date("2024-02-25") },
    ],
    materials: [
      { materialId: "statuario-white", materialName: "Statuario White", quantity: 65, status: "ordered" },
    ],
    notes: ["Client prefers bookmatched pattern for shower wall"],
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "PRJ-003",
    name: "Lusail Hotel Reception",
    clientName: "Katara Hospitality",
    clientEmail: "procurement@katarahosp.qa",
    clientPhone: "+974 4408 0000",
    location: "Lusail City",
    description: "Grand reception area with Black Galaxy granite and gold accents.",
    status: "completed",
    startDate: new Date("2023-09-01"),
    estimatedEndDate: new Date("2023-12-15"),
    actualEndDate: new Date("2023-12-10"),
    budget: 1200000,
    spent: 1150000,
    tasks: [
      { id: "T1", title: "Material procurement", description: "Source and deliver all materials", status: "completed", completedAt: new Date("2023-09-20") },
      { id: "T2", title: "Floor installation", description: "Complete granite floor installation", status: "completed", completedAt: new Date("2023-11-15") },
      { id: "T3", title: "Final inspection", description: "Client final walkthrough and approval", status: "completed", completedAt: new Date("2023-12-10") },
    ],
    materials: [
      { materialId: "black-galaxy", materialName: "Black Galaxy", quantity: 800, status: "installed" },
      { materialId: "honey-onyx", materialName: "Honey Onyx", quantity: 50, status: "installed" },
    ],
    notes: ["Project completed ahead of schedule", "Client very satisfied with results"],
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-12-10"),
  },
]

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: sampleProjects,

      createProject: (projectData) => {
        const project: Project = {
          id: generateId("PRJ"),
          ...projectData,
          tasks: [],
          notes: [],
          spent: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ projects: [...state.projects, project] }))
        return project
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }))
      },

      addTask: (projectId, task) => {
        const newTask: ProjectTask = {
          ...task,
          id: generateId("TSK"),
        }
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, tasks: [...p.tasks, newTask], updatedAt: new Date() }
              : p
          ),
        }))
      },

      updateTask: (projectId, taskId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId
                      ? {
                          ...t,
                          ...updates,
                          completedAt: updates.status === "completed" ? new Date() : t.completedAt,
                        }
                      : t
                  ),
                  updatedAt: new Date(),
                }
              : p
          ),
        }))
      },

      deleteTask: (projectId, taskId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId), updatedAt: new Date() }
              : p
          ),
        }))
      },

      addNote: (projectId, note) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, notes: [...p.notes, note], updatedAt: new Date() }
              : p
          ),
        }))
      },

      getProjectById: (id) => get().projects.find((p) => p.id === id),
    }),
    {
      name: "infinity-marble-projects",
    }
  )
)
