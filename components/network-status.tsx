"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Server, Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"
import { nillionClient } from "@/lib/nillion-client"
import { NILLION_CONFIG } from "@/lib/nillion-config"

interface NetworkStatusProps {
  onStatusChange?: (status: { connected: boolean; nodeCount: number; activeNodes: string[] }) => void
}

export function NetworkStatus({ onStatusChange }: NetworkStatusProps) {
  const [status, setStatus] = useState<{
    connected: boolean
    nodeCount: number
    activeNodes: string[]
    isChecking: boolean
    lastChecked?: Date
    error?: string
  }>({
    connected: false,
    nodeCount: 0,
    activeNodes: [],
    isChecking: true,
  })

  const checkNetworkStatus = async () => {
    setStatus((prev) => ({ ...prev, isChecking: true, error: undefined }))

    try {
      const networkStatus = await nillionClient.getNetworkStatus()
      const newStatus = {
        ...networkStatus,
        isChecking: false,
        lastChecked: new Date(),
      }

      setStatus(newStatus)
      onStatusChange?.(networkStatus)
    } catch (error) {
      console.error("Network status check failed:", error)
      const errorStatus = {
        connected: false,
        nodeCount: NILLION_CONFIG.testnet.dbs.length,
        activeNodes: [],
        isChecking: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : "Network check failed",
      }

      setStatus(errorStatus)
      onStatusChange?.({ connected: false, nodeCount: 0, activeNodes: [] })
    }
  }

  useEffect(() => {
    checkNetworkStatus()

    // Check network status every 30 seconds
    const interval = setInterval(checkNetworkStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    if (status.isChecking) return "secondary"
    if (status.connected && status.activeNodes.length > 0) return "default"
    if (status.activeNodes.length > 0) return "secondary"
    return "destructive"
  }

  const getStatusText = () => {
    if (status.isChecking) return "Checking..."
    if (status.connected && status.activeNodes.length > 0) return "Connected"
    if (status.activeNodes.length > 0) return "Partial"
    return "Disconnected"
  }

  const getStatusIcon = () => {
    if (status.isChecking) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (status.connected && status.activeNodes.length > 0) return <CheckCircle className="h-4 w-4" />
    if (status.activeNodes.length > 0) return <Wifi className="h-4 w-4" />
    return <WifiOff className="h-4 w-4" />
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Network Status</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor()} className="flex items-center gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
            <Button variant="ghost" size="sm" onClick={checkNetworkStatus} disabled={status.isChecking}>
              <RefreshCw className={`h-4 w-4 ${status.isChecking ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <CardDescription>
          Nillion testnet connectivity status
          {status.lastChecked && (
            <span className="block text-xs mt-1">Last checked: {status.lastChecked.toLocaleTimeString()}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Active Nodes</p>
            <p className="text-2xl font-bold">
              {status.activeNodes.length}/{status.nodeCount}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Network Health</p>
            <p className="text-2xl font-bold">
              {status.nodeCount > 0 ? Math.round((status.activeNodes.length / status.nodeCount) * 100) : 0}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Node Details</p>
          <div className="space-y-1">
            {NILLION_CONFIG.testnet.dbs.map((nodeUrl, index) => {
              const isActive = status.activeNodes.includes(nodeUrl)
              return (
                <div key={index} className="flex items-center justify-between text-xs">
                  <code className="font-mono">{nodeUrl.replace("https://", "")}</code>
                  <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>

        {status.activeNodes.length === 0 && !status.isChecking && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No active nodes detected. The Nillion testnet may be experiencing issues.
              <Button variant="link" className="p-0 h-auto font-normal underline ml-1" onClick={checkNetworkStatus}>
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
