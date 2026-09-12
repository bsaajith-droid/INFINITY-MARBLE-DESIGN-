"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProjectStore } from "@/lib/project-store"
import {
  Plus,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  FolderOpen,
  X,
} from "lucide-react"

export default function ProjectsPage() {
  const { projects, createProject } = useProjectStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showNewForm, setShowNewForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    location: "",
    description: "",
    startDate: "",
    estimatedEndDate: "",
    budget: "",
  })

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning":
        return FolderOpen
      case "in-progress":
        return Clock
      case "completed":
        return CheckCircle
      case "on-hold":
        return AlertCircle
      default:
        return FolderOpen
    }
  }

  const handleCreateProject = () => {
    if (!formData.name || !formData.clientName || !formData.budget) {
      alert("Please fill in required fields")
      return
    }
    createProject({
      name: formData.name,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      location: formData.location,
      description: formData.description,
      status: "planning",
      startDate: new Date(formData.startDate || Date.now()),
      estimatedEndDate: new Date(formData.estimatedEndDate || Date.now() + 90 * 24 * 60 * 60 * 1000),
      budget: Number(formData.budget),
      materials: [],
    })
    setShowNewForm(false)
    setFormData({
      name: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      location: "",
      description: "",
      startDate: "",
      estimatedEndDate: "",
      budget: "",
    })
  }

  const activeProjects = projects.filter((p) => p.status === "in-progress").length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold">Projects</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track all your installation projects
              </p>
            </div>
            <Button
              onClick={() => setShowNewForm(true)}
              className="bg-gold text-background hover:bg-gold-light"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-xl font-bold">{projects.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-xl font-bold">{activeProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-xl font-bold">QAR {(totalBudget / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Spent</p>
                    <p className="text-xl font-bold">QAR {(totalSpent / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border min-h-[44px]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "planning", "in-progress", "completed", "on-hold"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={
                    statusFilter === status
                      ? "bg-gold text-background hover:bg-gold-light"
                      : "border-border hover:border-gold"
                  }
                >
                  {status === "all" ? "All" : status.replace("-", " ")}
                </Button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const StatusIcon = getStatusIcon(project.status)
              const progress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0
              const completedTasks = project.tasks.filter((t) => t.status === "completed").length
              const totalTasks = project.tasks.length

              return (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <Card className="bg-card border-border hover:border-gold/50 transition-all duration-300 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {project.status.replace("-", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">{project.id}</span>
                      </div>
                      <CardTitle className="font-serif text-lg mt-3 line-clamp-1">
                        {project.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{project.clientName}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-gold" />
                          {project.location}
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Budget</span>
                            <span className="text-gold font-medium">
                              QAR {project.spent.toLocaleString()} / {project.budget.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(project.estimatedEndDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="h-4 w-4" />
                            {completedTasks}/{totalTasks} tasks
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No projects found</p>
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">New Project</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNewForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Project Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 bg-secondary border-border"
                  placeholder="e.g., Villa Renovation"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Client Name *</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label>Client Phone</Label>
                  <Input
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
              </div>
              <div>
                <Label>Client Email</Label>
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="mt-1 bg-secondary border-border"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 bg-secondary border-border"
                  placeholder="e.g., West Bay, Doha"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 bg-secondary border-border"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
                <div>
                  <Label>Estimated End Date</Label>
                  <Input
                    type="date"
                    value={formData.estimatedEndDate}
                    onChange={(e) => setFormData({ ...formData, estimatedEndDate: e.target.value })}
                    className="mt-1 bg-secondary border-border"
                  />
                </div>
              </div>
              <div>
                <Label>Budget (QAR) *</Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="mt-1 bg-secondary border-border"
                  placeholder="e.g., 500000"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => setShowNewForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  className="flex-1 bg-gold text-background hover:bg-gold-light"
                >
                  Create Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </main>
  )
}
