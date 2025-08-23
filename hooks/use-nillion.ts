"use client"

import { useState, useEffect, useCallback } from "react"
import { nillionClient, type NillionUser, type StoredSecret } from "@/lib/nillion-client"

export function useNillion() {
  const [user, setUser] = useState<NillionUser | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [secrets, setSecrets] = useState<StoredSecret[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("nillion-user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("nillion-user")
      }
    }
  }, [])

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("nillion-user", JSON.stringify(user))
      setIsConnected(true)
    } else {
      localStorage.removeItem("nillion-user")
      setIsConnected(false)
    }
  }, [user])

  const connectUser = useCallback((newUser: NillionUser) => {
    setUser(newUser)
    setError(null)
  }, [])

  const disconnectUser = useCallback(() => {
    setUser(null)
    setSecrets([])
    setError(null)
  }, [])

  const refreshSecrets = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const storeIds = await nillionClient.listStoreIds()
      setSecrets(storeIds)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch secrets"
      setError(errorMessage)
      console.error("Failed to refresh secrets:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Auto-refresh secrets when user connects
  useEffect(() => {
    if (user && isConnected) {
      refreshSecrets()
    }
  }, [user, isConnected, refreshSecrets])

  const storeSecret = useCallback(
    async (
      name: string,
      value: string | number,
      permissions?: {
        retrieve: string[]
        update: string[]
        delete: string[]
        compute: Record<string, any>
      },
    ) => {
      if (!user) throw new Error("User not connected")

      const secret = {
        name,
        value,
        type: typeof value as "string" | "number",
      }

      const result = await nillionClient.storeSecret(user, secret, permissions)
      await refreshSecrets() // Refresh the list
      return result
    },
    [user, refreshSecrets],
  )

  const retrieveSecret = useCallback(
    async (storeId: string, secretName: string) => {
      if (!user) throw new Error("User not connected")
      return await nillionClient.retrieveSecret(user, storeId, secretName)
    },
    [user],
  )

  const updateSecret = useCallback(
    async (storeId: string, secretName: string, newValue: string | number) => {
      if (!user) throw new Error("User not connected")
      const result = await nillionClient.updateSecret(user, storeId, secretName, newValue)
      await refreshSecrets() // Refresh the list
      return result
    },
    [user, refreshSecrets],
  )

  return {
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
    updateSecret,
  }
}
