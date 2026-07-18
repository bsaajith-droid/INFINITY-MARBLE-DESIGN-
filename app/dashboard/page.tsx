"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { materials } from "@/lib/materials-data"
import { useProjectStore } from "@/lib/project-store"
import { useQuoteStore } from "@/lib/quote-store"
import {
  Package,
  FileText,
  FolderOpen,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle,
  Warehouse,
  Users,
} from "lucide-react"

export default function DashboardPage() {
  const { projects } = useProjectStore()
  const { quotes, invoices } = useQuoteStore()

  // Calculate stats
  const totalInventory = materials.reduce((sum, m) => sum + m.stockQuantity, 0)
  const lowStockItems = materials.filter((m) => m.stockQuantity < 100).length
  const activeProjects = projects.filter((p) => p.status === "in-progress").length
  const pendingQuotes = quotes.filter((q) => q.status === "sent").length
  const pendingInvoices = invoices.filter((i) => i.status === "pending")
  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0)
  const pendingAmount = pendingInvoices.reduce((sum, i) => sum + i.total, 0)

  const stats = [
    {
      title: "Total Inventory",
      value: `${totalInventory.toLocaleString()} sqm`,
      icon: Warehouse,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      icon: FolderOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Pending Quotes",
      value: pendingQuotes.toString(),
      icon: FileText,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Revenue (Paid)",
      value: `QAR ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ]

  const quickActions = [
    { title: "Create Quote", href: "/dashboard/quotes", icon: FileText },
    { title: "View Inventory", href: "/dashboard/inventory", icon: Package },
    { title: "Manage Projects", href: "/projects", icon: FolderOpen },
    { title: "View Invoices", href: "/dashboard/invoices", icon: DollarSign },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 lg:pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your business operations
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="bg-card border-border hover:border-gold/50 transition-all duration-300 cursor-pointer group h-full">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <action.icon className="h-5 w-5 text-gold" />
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pending Invoices */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-serif flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gold" />
                    Pending Payments
                  </CardTitle>
                  <Link href="/dashboard/invoices" className="text-sm text-gold hover:text-gold-light">
                    View All
                  </Link>
                </CardHeader>
                <CardContent>
                  {pendingInvoices.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No pending invoices</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingInvoices.slice(0, 5).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="font-medium">{invoice.customerName}</p>
                            <p className="text-sm text-muted-foreground">{invoice.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gold">QAR {invoice.total.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(invoice.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {pendingAmount > 0 && (
                        <div className="flex justify-between items-center pt-4 border-t border-border">
                          <span className="text-muted-foreground">Total Pending</span>
                          <span className="text-xl font-bold text-gold">QAR {pendingAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-serif flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-gold" />
                    Active Projects
                  </CardTitle>
                  <Link href="/projects" className="text-sm text-gold hover:text-gold-light">
                    View All
                  </Link>
                </CardHeader>
                <CardContent>
                  {projects.filter((p) => p.status === "in-progress").length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No active projects</p>
                  ) : (
                    <div className="space-y-4">
                      {projects
                        .filter((p) => p.status === "in-progress")
                        .slice(0, 4)
                        .map((project) => {
                          const progress = project.budget > 0 ? (project.spent / project.budget) * 100 : 0
                          return (
                            <Link href={`/projects/${project.id}`} key={project.id}>
                              <div className="p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-medium">{project.name}</p>
                                  <span className="text-xs text-muted-foreground">{project.id}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{project.clientName}</p>
                                <div className="flex items-center gap-4">
                                  <div className="flex-1">
                                    <Progress value={progress} className="h-2" />
                                  </div>
                                  <span className="text-sm text-gold">{progress.toFixed(0)}%</span>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Low Stock Alerts */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Low Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lowStockItems === 0 ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">All stock levels normal</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {materials
                        .filter((m) => m.stockQuantity < 100)
                        .slice(0, 5)
                        .map((material) => (
                          <div key={material.id} className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                            <div>
                              <p className="font-medium text-foreground">{material.name}</p>
                              <p className="text-xs text-muted-foreground">{material.category}</p>
                            </div>
                            <span className="text-sm font-medium text-yellow-500">
                              {material.stockQuantity} sqm
                            </span>
                          </div>
                        ))}
                      <Link href="/dashboard/inventory" className="block text-center text-sm text-gold hover:text-gold-light pt-2">
                        Manage Inventory
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Quotes */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gold" />
                    Recent Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {quotes.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No quotes yet</p>
                  ) : (
                    <div className="space-y-3">
                      {quotes.slice(-5).reverse().map((quote) => (
                        <Link href={`/dashboard/quotes/${quote.id}`} key={quote.id}>
                          <div className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-mono text-xs text-gold">{quote.id}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                quote.status === "accepted" ? "bg-green-500/20 text-green-400" :
                                quote.status === "sent" ? "bg-blue-500/20 text-blue-400" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {quote.status}
                              </span>
                            </div>
                            <p className="text-sm font-medium">{quote.customerName}</p>
                            <p className="text-xs text-gold mt-1">QAR {quote.total.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-serif flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gold" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Materials</span>
                    <span className="font-medium">{materials.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Projects</span>
                    <span className="font-medium">{projects.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Quotes</span>
                    <span className="font-medium">{quotes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Invoices</span>
                    <span className="font-medium">{invoices.length}</span>
                  </div>
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
