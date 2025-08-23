import { NILLION_CONFIG } from "./nillion-config"
import { handleNillionError, NetworkError, ValidationError, AuthenticationError } from "./error-handler"
import CryptoJS from "crypto-js"

export interface NillionUser {
  seed: string
  userId: string
  publicKey: string
  privateKey: string
}

export interface SecretData {
  name: string
  value: string | number
  type: "string" | "number"
}

export interface StoredSecret {
  storeId: string
  secretName: string
  userId: string
  timestamp: string
}

export interface Collection {
  id: string
  name: string
  description: string
  secretCount: number
  encrypted: boolean
  createdAt: string
}

export class NillionClient {
  private config = NILLION_CONFIG.testnet
  private apiBase = NILLION_CONFIG.storageApi.base
  private appId: string
  private fallbackMode = false

  constructor(appId = "secretvaults-demo") {
    this.appId = appId
  }

  private async shouldUseFallback(): Promise<boolean> {
    if (this.fallbackMode) return true

    try {
      const response = await fetch(`${this.apiBase}/api/user`, {
        method: "OPTIONS",
        signal: AbortSignal.timeout(3000),
      })
      return !response.ok
    } catch {
      console.log("[v0] API unreachable, enabling fallback mode")
      this.fallbackMode = true
      return true
    }
  }

  private createFallbackUser(seed: string): NillionUser {
    const hash = CryptoJS.SHA256(seed).toString()
    const userId = `demo_${hash.substring(0, 8)}`
    const publicKey = `03${hash.substring(0, 62)}`
    const privateKey = hash

    return {
      seed,
      userId,
      publicKey,
      privateKey,
    }
  }

  async createUser(seed: string): Promise<NillionUser> {
    if (!seed || seed.trim().length === 0) {
      throw new ValidationError("Seed phrase cannot be empty")
    }

    const useFallback = await this.shouldUseFallback()

    if (useFallback) {
      console.log("[v0] Using fallback mode - creating demo user")
      const user = this.createFallbackUser(seed)
      console.log("[v0] Created fallback user:", user.userId)
      return user
    }

    try {
      console.log("[v0] Attempting to create user with API:", this.apiBase)
      console.log("[v0] Using seed:", seed.substring(0, 10) + "...")

      const response = await fetch(`${this.apiBase}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ nillion_seed: seed }),
        signal: AbortSignal.timeout(15000),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        console.log("[v0] API failed, switching to fallback mode")
        this.fallbackMode = true
        return this.createFallbackUser(seed)
      }

      const data = await response.json()
      console.log("[v0] User creation response:", data)

      if (!data.nillion_user_id) {
        console.log("[v0] Invalid API response, using fallback")
        return this.createFallbackUser(seed)
      }

      const hash = CryptoJS.SHA256(seed).toString()
      const publicKey = `03${hash.substring(0, 62)}`
      const privateKey = hash

      const user = {
        seed,
        userId: data.nillion_user_id,
        publicKey,
        privateKey,
      }

      console.log("[v0] Created user successfully:", user.userId)
      return user
    } catch (error) {
      console.error("[v0] Error creating user, using fallback:", error)
      this.fallbackMode = true
      return this.createFallbackUser(seed)
    }
  }

  async storeSecret(
    user: NillionUser,
    secret: SecretData,
    permissions: {
      retrieve: string[]
      update: string[]
      delete: string[]
      compute: Record<string, any>
    } = { retrieve: [], update: [], delete: [], compute: {} },
  ): Promise<StoredSecret> {
    if (!user) {
      throw new AuthenticationError("User not authenticated")
    }

    if (!secret.name || secret.name.trim().length === 0) {
      throw new ValidationError("Secret name cannot be empty")
    }

    if (secret.value === undefined || secret.value === null || secret.value === "") {
      throw new ValidationError("Secret value cannot be empty")
    }

    if (this.fallbackMode) {
      console.log("[v0] Storing secret in fallback mode")
      const storeId = `demo_${CryptoJS.SHA256(secret.name + Date.now())
        .toString()
        .substring(0, 16)}`

      const storedSecrets = JSON.parse(localStorage.getItem("nillion_demo_secrets") || "[]")
      storedSecrets.push({
        storeId,
        secretName: secret.name,
        secretValue: secret.value,
        userId: user.userId,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("nillion_demo_secrets", JSON.stringify(storedSecrets))

      return {
        storeId,
        secretName: secret.name,
        userId: user.userId,
        timestamp: new Date().toISOString(),
      }
    }

    try {
      const response = await fetch(`${this.apiBase}/api/apps/${this.appId}/secrets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: {
            nillion_seed: user.seed,
            secret_value: secret.value,
            secret_name: secret.name,
          },
          permissions,
        }),
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        console.log("[v0] Store secret API failed, switching to fallback")
        this.fallbackMode = true
        return this.storeSecret(user, secret, permissions)
      }

      const data = await response.json()

      if (!data.store_id) {
        throw new ValidationError("Invalid response from server: missing store ID")
      }

      return {
        storeId: data.store_id,
        secretName: secret.name,
        userId: user.userId,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error storing secret, using fallback:", error)
      this.fallbackMode = true
      return this.storeSecret(user, secret, permissions)
    }
  }

  async retrieveSecret(user: NillionUser, storeId: string, secretName: string): Promise<any> {
    if (!user) {
      throw new AuthenticationError("User not authenticated")
    }

    if (!storeId || storeId.trim().length === 0) {
      throw new ValidationError("Store ID cannot be empty")
    }

    if (!secretName || secretName.trim().length === 0) {
      throw new ValidationError("Secret name cannot be empty")
    }

    if (this.fallbackMode) {
      console.log("[v0] Retrieving secret in fallback mode")
      const storedSecrets = JSON.parse(localStorage.getItem("nillion_demo_secrets") || "[]")
      const secret = storedSecrets.find((s: any) => s.storeId === storeId && s.secretName === secretName)

      if (!secret) {
        throw new ValidationError(`Secret not found: ${storeId}/${secretName}`)
      }

      return {
        secret: {
          [secretName]: secret.secretValue,
        },
      }
    }

    try {
      const response = await fetch(
        `${this.apiBase}/api/secret/retrieve/${storeId}?retrieve_as_nillion_user_seed=${user.seed}&secret_name=${secretName}`,
        {
          signal: AbortSignal.timeout(15000),
        },
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new ValidationError(`Secret not found: ${storeId}/${secretName}`)
        }
        console.log("[v0] Retrieve secret API failed, switching to fallback")
        this.fallbackMode = true
        return this.retrieveSecret(user, storeId, secretName)
      }

      return await response.json()
    } catch (error) {
      console.error("Error retrieving secret, using fallback:", error)
      this.fallbackMode = true
      return this.retrieveSecret(user, storeId, secretName)
    }
  }

  async listStoreIds(): Promise<StoredSecret[]> {
    if (this.fallbackMode) {
      console.log("[v0] Listing store IDs in fallback mode")
      const storedSecrets = JSON.parse(localStorage.getItem("nillion_demo_secrets") || "[]")
      return storedSecrets.map((secret: any) => ({
        storeId: secret.storeId,
        secretName: secret.secretName,
        userId: secret.userId,
        timestamp: secret.timestamp,
      }))
    }

    try {
      const response = await fetch(`${this.apiBase}/api/apps/${this.appId}/store_ids`, {
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        console.log("[v0] List store IDs API failed, switching to fallback")
        this.fallbackMode = true
        return this.listStoreIds()
      }

      const data = await response.json()

      if (!data.store_ids || !Array.isArray(data.store_ids)) {
        return []
      }

      return data.store_ids.map((item: any) => ({
        storeId: item.store_id,
        secretName: item.secret_name,
        userId: item.user_id || "unknown",
        timestamp: item.created_at || new Date().toISOString(),
      }))
    } catch (error) {
      console.error("Error listing store IDs, using fallback:", error)
      this.fallbackMode = true
      return this.listStoreIds()
    }
  }

  async updateSecret(user: NillionUser, storeId: string, secretName: string, newValue: string | number): Promise<any> {
    if (!user) {
      throw new AuthenticationError("User not authenticated")
    }

    if (!storeId || storeId.trim().length === 0) {
      throw new ValidationError("Store ID cannot be empty")
    }

    if (!secretName || secretName.trim().length === 0) {
      throw new ValidationError("Secret name cannot be empty")
    }

    if (newValue === undefined || newValue === null || newValue === "") {
      throw new ValidationError("New value cannot be empty")
    }

    try {
      const response = await fetch(`${this.apiBase}/api/apps/${this.appId}/secrets/${storeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nillion_seed: user.seed,
          secret_value: newValue,
          secret_name: secretName,
        }),
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new AuthenticationError(`Authentication failed: ${response.statusText}`)
        }
        if (response.status === 404) {
          throw new ValidationError(`Secret not found: ${storeId}/${secretName}`)
        }
        throw new NetworkError(`Failed to update secret: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating secret:", error)
      throw handleNillionError(error)
    }
  }

  async getNetworkStatus(): Promise<{
    connected: boolean
    nodeCount: number
    activeNodes: string[]
    fallbackMode: boolean
  }> {
    try {
      console.log("[v0] Checking network status...")

      let apiAccessible = false
      try {
        const apiResponse = await fetch(`${this.apiBase}/api/user`, {
          method: "OPTIONS",
          signal: AbortSignal.timeout(5000),
        })
        apiAccessible = apiResponse.ok
        console.log("[v0] Main API status:", apiResponse.status)
      } catch (apiError) {
        console.log("[v0] Main API not accessible:", apiError)
      }

      const nodeChecks = await Promise.allSettled(
        this.config.dbs.map(async (url) => {
          try {
            console.log("[v0] Checking node:", url)
            const response = await fetch(`${url}/api/v1/health`, {
              method: "GET",
              mode: "cors",
              signal: AbortSignal.timeout(5000),
            })
            console.log("[v0] Node response:", url, response.ok)
            return response.ok ? url : null
          } catch (nodeError) {
            console.log("[v0] Node check failed:", url, nodeError)
            return null
          }
        }),
      )

      const activeNodes = nodeChecks
        .filter(
          (result): result is PromiseFulfilledResult<string> => result.status === "fulfilled" && result.value !== null,
        )
        .map((result) => result.value)

      const status = {
        connected: apiAccessible || activeNodes.length > 0,
        nodeCount: this.config.dbs.length,
        activeNodes,
        fallbackMode: this.fallbackMode,
      }

      console.log("[v0] Network status:", status)
      return status
    } catch (error) {
      console.error("[v0] Error checking network status:", error)
      return {
        connected: false,
        nodeCount: this.config.dbs.length,
        activeNodes: [],
        fallbackMode: this.fallbackMode,
      }
    }
  }
}

export const nillionClient = new NillionClient()
