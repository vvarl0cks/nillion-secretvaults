"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Key, Wallet, Shield, CheckCircle, AlertCircle, Loader2, WifiOff } from "lucide-react"
import { nillionClient, type NillionUser } from "@/lib/nillion-client"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectionProps {
  onUserConnected: (user: NillionUser) => void
  user: NillionUser | null
}

export function WalletConnection({ onUserConnected, user }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [seed, setSeed] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [networkStatus, setNetworkStatus] = useState<{
    connected: boolean
    nodeCount: number
    activeNodes: string[]
    fallbackMode?: boolean
  } | null>(null)
  const [showConnectionDialog, setShowConnectionDialog] = useState(false)
  const { toast } = useToast()

  // Check network status on mount
  useEffect(() => {
    checkNetworkStatus()
  }, [])

  const checkNetworkStatus = async () => {
    try {
      const status = await nillionClient.getNetworkStatus()
      setNetworkStatus(status)
    } catch (error) {
      console.error("Failed to check network status:", error)
      setNetworkStatus({ connected: false, nodeCount: 0, activeNodes: [], fallbackMode: true })
    }
  }

  const connectWithSeed = async () => {
    if (!seed.trim()) {
      toast({
        title: "Error",
        description: "Please enter a seed phrase",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      console.log("[v0] Starting connection with seed...")
      const newUser = await nillionClient.createUser(seed.trim())
      console.log("[v0] User connected successfully:", newUser.userId)
      onUserConnected(newUser)
      setShowConnectionDialog(false)

      const status = await nillionClient.getNetworkStatus()
      const modeText = status.fallbackMode ? " (Demo Mode)" : ""

      toast({
        title: "Connected Successfully",
        description: `Connected as user: ${newUser.userId.substring(0, 12)}...${modeText}`,
      })

      // Refresh network status after connection
      await checkNetworkStatus()
    } catch (error) {
      console.error("[v0] Connection failed:", error)
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Nillion API. Please check your internet connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const connectWithPrivateKey = async () => {
    if (!privateKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a private key",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      console.log("[v0] Starting connection with private key...")
      const newUser = await nillionClient.createUser(privateKey.trim())
      console.log("[v0] User connected successfully:", newUser.userId)
      onUserConnected(newUser)
      setShowConnectionDialog(false)

      const status = await nillionClient.getNetworkStatus()
      const modeText = status.fallbackMode ? " (Demo Mode)" : ""

      toast({
        title: "Connected Successfully",
        description: `Connected as user: ${newUser.userId.substring(0, 12)}...${modeText}`,
      })

      // Refresh network status after connection
      await checkNetworkStatus()
    } catch (error) {
      console.error("[v0] Connection failed:", error)
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Nillion API. Please check your internet connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const generateRandomSeed = () => {
    const randomSeed = `user_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
    setSeed(randomSeed)
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

  const disconnect = () => {
    onUserConnected(null)
    setSeed("")
    setPrivateKey("")
    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Nillion network",
    })
  }

  if (user) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-800">
                Connected to Nillion Testnet
                {networkStatus?.fallbackMode && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Demo Mode
                  </Badge>
                )}
              </CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={disconnect}>
              Disconnect
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">User ID</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                  {user.userId.substring(0, 20)}...
                </code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(user.userId, "User ID")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Public Key</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                  {user.publicKey.substring(0, 20)}...
                </code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(user.publicKey, "Public Key")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {networkStatus?.fallbackMode && (
            <Alert>
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                Running in demo mode - Nillion API is unreachable. Your secrets are stored locally for demonstration
                purposes.
              </AlertDescription>
            </Alert>
          )}

          {networkStatus && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-700">Network Status</Label>
                <Button variant="ghost" size="sm" onClick={checkNetworkStatus}>
                  Refresh
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    networkStatus.connected && !networkStatus.fallbackMode
                      ? "default"
                      : networkStatus.fallbackMode
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {networkStatus.fallbackMode ? "Demo Mode" : networkStatus.connected ? "Connected" : "Disconnected"}
                </Badge>
                <span className="text-sm text-gray-600">
                  {networkStatus.activeNodes.length}/{networkStatus.nodeCount} nodes active
                </span>
                {networkStatus.fallbackMode && (
                  <div className="flex items-center gap-1 text-sm text-orange-600">
                    <WifiOff className="h-3 w-3" />
                    <span>API Offline</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-orange-800">Connect to Nillion Testnet</CardTitle>
        </div>
        <CardDescription>Connect your Nillion wallet to start managing secrets on the testnet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {networkStatus && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Network Status:{" "}
                {networkStatus.fallbackMode ? (
                  <span className="text-orange-600 font-medium">Demo Mode Available</span>
                ) : networkStatus.connected ? (
                  <span className="text-green-600 font-medium">Connected</span>
                ) : (
                  <span className="text-red-600 font-medium">Disconnected</span>
                )}{" "}
                - {networkStatus.activeNodes.length}/{networkStatus.nodeCount} nodes active
                {networkStatus.fallbackMode && (
                  <span className="block text-sm text-orange-600 mt-1">API offline - will use local demo mode</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect to Nillion Testnet</DialogTitle>
                <DialogDescription>Choose how you want to connect to the Nillion network</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="seed" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="seed">Seed Phrase</TabsTrigger>
                  <TabsTrigger value="privatekey">Private Key</TabsTrigger>
                </TabsList>

                <TabsContent value="seed" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seed">Seed Phrase</Label>
                    <Input
                      id="seed"
                      placeholder="Enter your seed phrase or generate a new one"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={generateRandomSeed} className="w-full bg-transparent">
                      Generate Random Seed
                    </Button>
                  </div>
                  <Button onClick={connectWithSeed} disabled={isConnecting || !seed.trim()} className="w-full">
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Connect with Seed
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="privatekey" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="privatekey">Private Key</Label>
                    <Input
                      id="privatekey"
                      type="password"
                      placeholder="Enter your private key"
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={connectWithPrivateKey}
                    disabled={isConnecting || !privateKey.trim()}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Connect with Private Key
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              <Separator />

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  This is a testnet demo. Your keys are only used locally and for testnet operations. Never use mainnet
                  keys in demo applications.
                </AlertDescription>
              </Alert>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
