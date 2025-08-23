"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Shield,
  Database,
  Search,
  Users,
  Plus,
  Settings,
  Key,
  Lock,
  Server,
  Activity,
  FileText,
  Eye,
  Trash2,
  Edit,
  Share,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface Collection {
  id: string
  name: string
  description: string
  documents: number
  encrypted: boolean
  created: string
  lastModified: string
}

interface Query {
  id: string
  name: string
  collection: string
  status: "completed" | "running" | "failed"
  created: string
  results?: number
}

interface DataDocument {
  id: string
  collection: string
  name: string
  size: string
  encrypted: boolean
  owner: string
  created: string
  lastAccessed: string
}

export function SecretVaultsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "User Profiles",
      description: "Encrypted user profile data",
      documents: 1247,
      encrypted: true,
      created: "2024-01-15",
      lastModified: "2024-01-20",
    },
    {
      id: "2",
      name: "Financial Records",
      description: "Sensitive financial information",
      documents: 892,
      encrypted: true,
      created: "2024-01-10",
      lastModified: "2024-01-19",
    },
    {
      id: "3",
      name: "System Logs",
      description: "Application logs and metrics",
      documents: 5643,
      encrypted: false,
      created: "2024-01-05",
      lastModified: "2024-01-21",
    },
  ])

  const [queries, setQueries] = useState<Query[]>([
    {
      id: "1",
      name: "Active Users Query",
      collection: "User Profiles",
      status: "completed",
      created: "2024-01-21",
      results: 156,
    },
    {
      id: "2",
      name: "Transaction Analysis",
      collection: "Financial Records",
      status: "running",
      created: "2024-01-21",
    },
    {
      id: "3",
      name: "Error Log Search",
      collection: "System Logs",
      status: "failed",
      created: "2024-01-20",
    },
  ])

  const [documents, setDocuments] = useState<DataDocument[]>([
    {
      id: "1",
      collection: "User Profiles",
      name: "user_profile_001.json",
      size: "2.4 KB",
      encrypted: true,
      owner: "did:nil:abc123...",
      created: "2024-01-21",
      lastAccessed: "2024-01-21",
    },
    {
      id: "2",
      collection: "Financial Records",
      name: "transaction_log.json",
      size: "15.7 KB",
      encrypted: true,
      owner: "did:nil:def456...",
      created: "2024-01-20",
      lastAccessed: "2024-01-21",
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "running":
        return <Clock className="h-4 w-4 text-secondary" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Nillion Secret Vaults</h1>
              <p className="text-sm text-muted-foreground">Decentralized Private Storage</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Server className="h-3 w-3 mr-1" />3 Nodes Connected
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-sidebar-border bg-sidebar p-6">
          <nav className="space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "collections" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("collections")}
            >
              <Database className="h-4 w-4 mr-2" />
              Collections
            </Button>
            <Button
              variant={activeTab === "queries" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("queries")}
            >
              <Search className="h-4 w-4 mr-2" />
              Queries
            </Button>
            <Button
              variant={activeTab === "documents" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("documents")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Button>
            <Button
              variant={activeTab === "access" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("access")}
            >
              <Users className="h-4 w-4 mr-2" />
              Access Control
            </Button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
                <p className="text-muted-foreground">Monitor your decentralized storage system</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{collections.length}</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {collections.reduce((sum, col) => sum + col.documents, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">+12% from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Encrypted Data</CardTitle>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {collections.filter((col) => col.encrypted).length}/{collections.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Security enabled</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Queries</CardTitle>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {queries.filter((q) => q.status === "running").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Currently processing</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest operations across your secret vaults</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New collection "User Profiles" created</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Query "Active Users Query" completed</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Document uploaded to "Financial Records"</p>
                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "collections" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Collections</h2>
                  <p className="text-muted-foreground">Manage your data collections</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Collection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Collection</DialogTitle>
                      <DialogDescription>Set up a new collection to organize your data</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="collection-name">Collection Name</Label>
                        <Input id="collection-name" placeholder="Enter collection name" />
                      </div>
                      <div>
                        <Label htmlFor="collection-description">Description</Label>
                        <Textarea id="collection-description" placeholder="Describe this collection" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="encryption" />
                        <Label htmlFor="encryption">Enable encryption</Label>
                      </div>
                      <Button className="w-full">Create Collection</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <Card key={collection.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{collection.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {collection.encrypted && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Encrypted
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription>{collection.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Documents:</span>
                          <span className="font-medium">{collection.documents.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Created:</span>
                          <span className="font-medium">{collection.created}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Modified:</span>
                          <span className="font-medium">{collection.lastModified}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "queries" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Queries</h2>
                  <p className="text-muted-foreground">Manage and execute data queries</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Query
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Query</DialogTitle>
                      <DialogDescription>Build a query to search your collections</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="query-name">Query Name</Label>
                        <Input id="query-name" placeholder="Enter query name" />
                      </div>
                      <div>
                        <Label htmlFor="query-collection">Target Collection</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select collection" />
                          </SelectTrigger>
                          <SelectContent>
                            {collections.map((col) => (
                              <SelectItem key={col.id} value={col.id}>
                                {col.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="query-filter">Query Filter</Label>
                        <Textarea id="query-filter" placeholder="Enter query conditions (JSON format)" />
                      </div>
                      <Button className="w-full">Create Query</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {queries.map((query) => (
                  <Card key={query.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getStatusIcon(query.status)}
                            {query.name}
                          </CardTitle>
                          <CardDescription>Collection: {query.collection}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              query.status === "completed"
                                ? "default"
                                : query.status === "running"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {query.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Created: {query.created}</p>
                          {query.results && <p className="text-sm text-muted-foreground">Results: {query.results}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Documents</h2>
                  <p className="text-muted-foreground">Browse and manage your stored documents</p>
                </div>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Document Library</CardTitle>
                  <CardDescription>All documents across your collections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.collection} • {doc.size} • {doc.created}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.encrypted && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Encrypted
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "access" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Access Control</h2>
                <p className="text-muted-foreground">Manage permissions and user access</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Grant Access</CardTitle>
                    <CardDescription>Give users access to specific documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="user-did">User DID</Label>
                      <Input id="user-did" placeholder="did:nil:..." />
                    </div>
                    <div>
                      <Label htmlFor="document-select">Document</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document" />
                        </SelectTrigger>
                        <SelectContent>
                          {documents.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id}>
                              {doc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="permission-level">Permission Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select permission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Read Only</SelectItem>
                          <SelectItem value="write">Read & Write</SelectItem>
                          <SelectItem value="admin">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Key className="h-4 w-4 mr-2" />
                      Grant Access
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Permissions</CardTitle>
                    <CardDescription>Current access grants and permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">did:nil:abc123...</p>
                          <p className="text-xs text-muted-foreground">user_profile_001.json • Read Only</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">did:nil:def456...</p>
                          <p className="text-xs text-muted-foreground">transaction_log.json • Full Access</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
