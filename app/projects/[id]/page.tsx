"use client"

import { use, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProjectStore, type ProjectStatus, type TaskStatus } from "@/lib/project-store"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  Mail,
  DollarSign,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Package,
  FileText,
  X,
  Circle,
} from "lucide-react"

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const { getProjectById, updateProject, addTask, updateTask, deleteTask, addNote } = useProjectStore()
  const project = getProjectById(resolvedParams.id)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" })
  const [newNote, setNewNote] = useState("")

  if (!project) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-500/20 text-blue-400"
      case "in-progress":
        return "bg-gold/20 text-gold"
      case "on-hold":
        return "bg-yellow-500/20 text-yellow-400"
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "cancelled":
        return "bg-destructive/20 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTaskStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "text-muted-foreground"
      case "in-progress":
        return "text-gold"
      case "completed":
        return "text-green-500"
    }
  }

  const getTaskStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return Circle
      case "in-progress":
        return Clock
      case "completed":
        return CheckCircle
    }
  }

  const progress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0
  const completedTasks = project.tasks.filter((t) => t.status === "completed").length
  const taskProgress = project.tasks.length > 0 ? (completedTasks / project.tasks.length) * 100 : 0

  const handleAddTask = () => {
    if (!newTask.title) return
    addTask(project.id, {
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
    })
    setNewTask({ title: "", description: "", dueDate: "" })
    setShowTaskForm(false)
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    addNote(project.id, newNote)
    setNewNote("")
    setShowNoteForm(false)
  }

  const cycleTaskStatus = (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      todo: "in-progress",
      "in-progress": "completed",
      completed: "todo",
    }
    updateTask(project.id, taskId, { status: nextStatus[currentStatus] })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold">{project.name}</h1>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace("-", " ")}
                  </Badge>
                </div>
                <p className="text-muted-foreground font-mono text-sm">{project.id}</p>
              </div>
              <div className="flex gap-2">
                <select
                  value={project.status}
                  onChange={(e) => updateProject(project.id, { status: e.target.value as ProjectStatus })}
                  className="px-4 py-2 bg-secondary border border-border rounded-md text-foreground min-h-[44px]"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-serif">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                </CardContent>
              </Card>

              {/* Progress Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="h-5 w-5 text-gold" />
                      <span className="font-medium">Budget</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="text-gold font-medium">
                        QAR {project.spent.toLocaleString()} / {project.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">{progress.toFixed(1)}% of budget used</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-gold" />
                      <span className="font-medium">Tasks</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="text-gold font-medium">
                        {completedTasks} / {project.tasks.length}
                      </span>
                    </div>
                    <Progress value={taskProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">{taskProgress.toFixed(1)}% tasks completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tasks */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-serif">Tasks</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowTaskForm(true)}
                    className="bg-gold text-background hover:bg-gold-light"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </CardHeader>
                <CardContent>
                  {project.tasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No tasks yet</p>
                  ) : (
                    <div className="space-y-3">
                      {project.tasks.map((task) => {
                        const StatusIcon = getTaskStatusIcon(task.status)
                        return (
                          <div
                            key={task.id}
                            className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg group"
                          >
                            <button
                              onClick={() => cycleTaskStatus(task.id, task.status)}
                              className={`mt-1 ${getTaskStatusColor(task.status)} hover:text-gold transition-colors`}
                            >
                              <StatusIcon className="h-5 w-5" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              )}
                              {task.dueDate && (
                                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                              onClick={() => deleteTask(project.id, task.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {showTaskForm && (
                    <div className="mt-4 p-4 border border-border rounded-lg space-y-4">
                      <div>
                        <Label>Task Title</Label>
                        <Input
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          className="mt-1 bg-secondary border-border"
                          placeholder="Enter task title"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          className="mt-1 bg-secondary border-border"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          className="mt-1 bg-secondary border-border"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowTaskForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddTask} className="bg-gold text-background hover:bg-gold-light">
                          Add Task
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Materials */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Package className="h-5 w-5 text-gold" />
                    Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {project.materials.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No materials assigned</p>
                  ) : (
                    <div className="space-y-3">
                      {project.materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="font-medium">{material.materialName}</p>
                            <p className="text-sm text-muted-foreground">{material.quantity} sqm</p>
                          </div>
                          <Badge
                            className={
                              material.status === "installed"
                                ? "bg-green-500/20 text-green-400"
                                : material.status === "delivered"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }
                          >
                            {material.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client Info */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-serif">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-lg font-semibold">{project.clientName}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 text-gold" />
                    <a href={`tel:${project.clientPhone}`} className="hover:text-gold">
                      {project.clientPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-gold" />
                    <a href={`mailto:${project.clientEmail}`} className="hover:text-gold">
                      {project.clientEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-gold" />
                    {project.location}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gold" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start Date</span>
                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. End Date</span>
                    <span>{new Date(project.estimatedEndDate).toLocaleDateString()}</span>
                  </div>
                  {project.actualEndDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Actual End Date</span>
                      <span className="text-green-500">{new Date(project.actualEndDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-serif flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold" />
                    Notes
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowNoteForm(true)}
                    className="text-gold hover:text-gold-light"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {project.notes.length === 0 && !showNoteForm ? (
                    <p className="text-muted-foreground text-sm">No notes yet</p>
                  ) : (
                    <div className="space-y-3">
                      {project.notes.map((note, index) => (
                        <div key={index} className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-lg">
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                  {showNoteForm && (
                    <div className="mt-4 space-y-3">
                      <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="bg-secondary border-border"
                        placeholder="Add a note..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowNoteForm(false)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleAddNote} className="bg-gold text-background hover:bg-gold-light">
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
