"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Database,
  Users,
  Settings,
  Key,
  Lock,
  Server,
  Activity,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Copy,
  RefreshCw,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WalletConnection } from "./wallet-connection"
import { useNillion } from "@/hooks/use-nillion"
import { useToast } from "@/hooks/use-toast"

export function SecretVaultsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isStoring, setIsStoring] = useState(false)
  const [isRetrieving, setIsRetrieving] = useState(false)
  const [newSecretName, setNewSecretName] = useState("")
  const [newSecretValue, setNewSecretValue] = useState("")
  const [newSecretType, setNewSecretType] = useState<"string" | "number">("string")
  const [retrieveStoreId, setRetrieveStoreId] = useState("")
  const [retrieveSecretName, setRetrieveSecretName] = useState("")
  const [retrievedSecret, setRetrievedSecret] = useState<any>(null)
  const [networkStatus, setNetworkStatus] = useState<{
    connected: boolean
    nodeCount: number
    activeNodes: string[]
  } | null>(null)

  const {
    user,
    isConnected,
    secrets,
    isLoading,
    error,
    connectUser,
    disconnectUser,
    refreshSecrets,
    storeSecret,
    retrieveSecret,
  } = useNillion()

  const { toast } = useToast()

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const { nillionClient } = await import("@/lib/nillion-client")
        const status = await nillionClient.getNetworkStatus()
        setNetworkStatus(status)
      } catch (error) {
        console.error("Failed to check network:", error)
      }
    }
    checkNetwork()
  }, [])

  const handleStoreSecret = async () => {
    if (!newSecretName.trim() || !newSecretValue.trim()) {
      toast({
        title: "Error",
        description: "Please enter both secret name and value",
        variant: "destructive",
      })
      return
    }

    setIsStoring(true)
    try {
      const value = newSecretType === "number" ? Number.parseFloat(newSecretValue) : newSecretValue
      await storeSecret(newSecretName.trim(), value)

      setNewSecretName("")
      setNewSecretValue("")
      toast({
        title: "Success",
        description: `Secret "${newSecretName}" stored successfully`,
      })
    } catch (error) {
      console.error("Failed to store secret:", error)
      toast({
        title: "Storage Failed",
        description: error instanceof Error ? error.message : "Failed to store secret",
        variant: "destructive",
      })
    } finally {
      setIsStoring(false)
    }
  }

  const handleRetrieveSecret = async () => {
    if (!retrieveStoreId.trim() || !retrieveSecretName.trim()) {
      toast({
        title: "Error",
        description: "Please enter both store ID and secret name",
        variant: "destructive",
      })
      return
    }

    setIsRetrieving(true)
    try {
      const result = await retrieveSecret(retrieveStoreId.trim(), retrieveSecretName.trim())
      setRetrievedSecret(result)
      toast({
        title: "Success",
        description: "Secret retrieved successfully",
      })
    } catch (error) {
      console.error("Failed to retrieve secret:", error)
      toast({
        title: "Retrieval Failed",
        description: error instanceof Error ? error.message : "Failed to retrieve secret",
        variant: "destructive",
      })
    } finally {
      setIsRetrieving(false)
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

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
            {networkStatus && (
              <Badge
                variant={networkStatus.connected ? "default" : "destructive"}
                className={networkStatus.connected ? "bg-primary/10 text-primary border-primary/20" : ""}
              >
                <Server className="h-3 w-3 mr-1" />
                {networkStatus.activeNodes.length}/{networkStatus.nodeCount} Nodes
              </Badge>
            )}
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
              variant={activeTab === "secrets" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("secrets")}
            >
              <Key className="h-4 w-4 mr-2" />
              Secrets
            </Button>
            <Button
              variant={activeTab === "operations" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("operations")}
            >
              <Database className="h-4 w-4 mr-2" />
              Operations
            </Button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 p-6">
          {!isConnected ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Nillion Secret Vaults</h2>
                <p className="text-muted-foreground">Connect your wallet to start managing secrets on the testnet</p>
              </div>
              <WalletConnection onUserConnected={connectUser} user={user} />
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
                    <p className="text-muted-foreground">Monitor your decentralized storage system</p>
                  </div>

                  {/* Wallet Connection Status */}
                  <WalletConnection onUserConnected={connectUser} user={user} />

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Secrets</CardTitle>
                        <Key className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">{secrets.length}</div>
                        <p className="text-xs text-muted-foreground">Stored on testnet</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Network Status</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                          {networkStatus ? `${networkStatus.activeNodes.length}/${networkStatus.nodeCount}` : "0/0"}
                        </div>
                        <p className="text-xs text-muted-foreground">Active nodes</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Encrypted Data</CardTitle>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-foreground">{secrets.length}</div>
                        <p className="text-xs text-muted-foreground">All secrets encrypted</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">User ID</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm font-bold text-foreground font-mono">
                          {user?.userId.substring(0, 12)}...
                        </div>
                        <p className="text-xs text-muted-foreground">Connected user</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Recent Secrets</CardTitle>
                          <CardDescription>Your latest stored secrets</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={refreshSecrets} disabled={isLoading}>
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {error && (
                        <Alert className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-4">
                        {secrets.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">No secrets stored yet</p>
                        ) : (
                          secrets.slice(0, 5).map((secret) => (
                            <div key={secret.storeId} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Secret "{secret.secretName}" stored</p>
                                <p className="text-xs text-muted-foreground font-mono">
                                  Store ID: {secret.storeId.substring(0, 16)}...
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(secret.storeId, "Store ID")}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "secrets" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">Secret Management</h2>
                      <p className="text-muted-foreground">Store and retrieve secrets on Nillion testnet</p>
                    </div>
                    <Button variant="outline" onClick={refreshSecrets} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refresh
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Store Secret */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Store New Secret</CardTitle>
                        <CardDescription>Add a new secret to the Nillion network</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="secret-name">Secret Name</Label>
                          <Input
                            id="secret-name"
                            placeholder="Enter secret name"
                            value={newSecretName}
                            onChange={(e) => setNewSecretName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="secret-type">Secret Type</Label>
                          <Select
                            value={newSecretType}
                            onValueChange={(value: "string" | "number") => setNewSecretType(value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="secret-value">Secret Value</Label>
                          <Input
                            id="secret-value"
                            type={newSecretType === "number" ? "number" : "text"}
                            placeholder={newSecretType === "number" ? "Enter number" : "Enter secret value"}
                            value={newSecretValue}
                            onChange={(e) => setNewSecretValue(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleStoreSecret} disabled={isStoring} className="w-full">
                          {isStoring ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Storing...
                            </>
                          ) : (
                            <>
                              <Key className="h-4 w-4 mr-2" />
                              Store Secret
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Retrieve Secret */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Retrieve Secret</CardTitle>
                        <CardDescription>Get a secret from the Nillion network</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="store-id">Store ID</Label>
                          <Input
                            id="store-id"
                            placeholder="Enter store ID"
                            value={retrieveStoreId}
                            onChange={(e) => setRetrieveStoreId(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="retrieve-secret-name">Secret Name</Label>
                          <Input
                            id="retrieve-secret-name"
                            placeholder="Enter secret name"
                            value={retrieveSecretName}
                            onChange={(e) => setRetrieveSecretName(e.target.value)}
                          />
                        </div>
                        <Button onClick={handleRetrieveSecret} disabled={isRetrieving} className="w-full">
                          {isRetrieving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Retrieving...
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Retrieve Secret
                            </>
                          )}
                        </Button>

                        {retrievedSecret && (
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <Label className="text-sm font-medium">Retrieved Value:</Label>
                            <pre className="mt-2 text-sm font-mono bg-background p-2 rounded border">
                              {JSON.stringify(retrievedSecret, null, 2)}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Stored Secrets List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Stored Secrets</CardTitle>
                      <CardDescription>All secrets you've stored on the network</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {error && (
                        <Alert className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-4">
                        {secrets.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            No secrets stored yet. Store your first secret above!
                          </p>
                        ) : (
                          secrets.map((secret) => (
                            <div
                              key={secret.storeId}
                              className="flex items-center justify-between p-4 border border-border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <Key className="h-8 w-8 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{secret.secretName}</p>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    Store ID: {secret.storeId.substring(0, 20)}...
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Stored: {new Date(secret.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Encrypted
                                </Badge>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setRetrieveStoreId(secret.storeId)
                                    setRetrieveSecretName(secret.secretName)
                                  }}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Load
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(secret.storeId, "Store ID")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "operations" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Network Operations</h2>
                    <p className="text-muted-foreground">Monitor network status and perform operations</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Network Status</CardTitle>
                        <CardDescription>Current status of Nillion testnet nodes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {networkStatus ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Connection Status:</span>
                              <Badge variant={networkStatus.connected ? "default" : "destructive"}>
                                {networkStatus.connected ? "Connected" : "Disconnected"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Active Nodes:</span>
                              <span className="text-sm">
                                {networkStatus.activeNodes.length}/{networkStatus.nodeCount}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <span className="text-sm font-medium">Node URLs:</span>
                              {networkStatus.activeNodes.map((node, index) => (
                                <div key={index} className="text-xs font-mono bg-muted p-2 rounded">
                                  {node}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Loading network status...</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>Your Nillion user details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {user && (
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">User ID:</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="flex-1 text-xs font-mono bg-muted p-2 rounded">{user.userId}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(user.userId, "User ID")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Public Key:</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="flex-1 text-xs font-mono bg-muted p-2 rounded">{user.publicKey}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(user.publicKey, "Public Key")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Seed:</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="flex-1 text-xs font-mono bg-muted p-2 rounded">{user.seed}</code>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(user.seed, "Seed")}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
