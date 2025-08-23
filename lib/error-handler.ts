export class NillionError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any,
  ) {
    super(message)
    this.name = "NillionError"
  }
}

export class NetworkError extends NillionError {
  constructor(message: string, details?: any) {
    super(message, "NETWORK_ERROR", details)
    this.name = "NetworkError"
  }
}

export class AuthenticationError extends NillionError {
  constructor(message: string, details?: any) {
    super(message, "AUTH_ERROR", details)
    this.name = "AuthenticationError"
  }
}

export class ValidationError extends NillionError {
  constructor(message: string, details?: any) {
    super(message, "VALIDATION_ERROR", details)
    this.name = "ValidationError"
  }
}

export function handleNillionError(error: unknown): NillionError {
  if (error instanceof NillionError) {
    return error
  }

  if (error instanceof Error) {
    // Network-related errors
    if (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("connection")) {
      return new NetworkError(`Network connection failed: ${error.message}`, error)
    }

    // Authentication-related errors
    if (
      error.message.includes("auth") ||
      error.message.includes("unauthorized") ||
      error.message.includes("forbidden")
    ) {
      return new AuthenticationError(`Authentication failed: ${error.message}`, error)
    }

    // Validation errors
    if (
      error.message.includes("invalid") ||
      error.message.includes("required") ||
      error.message.includes("validation")
    ) {
      return new ValidationError(`Validation failed: ${error.message}`, error)
    }

    // Generic Nillion error
    return new NillionError(error.message, "UNKNOWN_ERROR", error)
  }

  // Fallback for unknown error types
  return new NillionError("An unknown error occurred", "UNKNOWN_ERROR", error)
}

export function getErrorMessage(error: unknown): string {
  const nillionError = handleNillionError(error)

  switch (nillionError.code) {
    case "NETWORK_ERROR":
      return "Unable to connect to Nillion network. Please check your internet connection and try again."
    case "AUTH_ERROR":
      return "Authentication failed. Please check your wallet connection and try again."
    case "VALIDATION_ERROR":
      return "Invalid input provided. Please check your data and try again."
    default:
      return nillionError.message || "An unexpected error occurred. Please try again."
  }
}

export function getErrorSuggestions(error: unknown): string[] {
  const nillionError = handleNillionError(error)

  switch (nillionError.code) {
    case "NETWORK_ERROR":
      return [
        "Check your internet connection",
        "Verify Nillion testnet status",
        "Try refreshing the page",
        "Wait a moment and retry",
      ]
    case "AUTH_ERROR":
      return [
        "Reconnect your wallet",
        "Check your seed phrase",
        "Verify your user credentials",
        "Try generating a new user",
      ]
    case "VALIDATION_ERROR":
      return [
        "Check all required fields are filled",
        "Verify data format is correct",
        "Ensure secret name is unique",
        "Check value type matches selection",
      ]
    default:
      return [
        "Try refreshing the page",
        "Check your network connection",
        "Verify your wallet is connected",
        "Contact support if issue persists",
      ]
  }
}
