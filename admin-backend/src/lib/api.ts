/**
 * API Helper utilities for frontend
 * Handles API calls with retry logic, error handling, and loading states
 */

import type { ApiResponse } from "@/types";

/**
 * Fetch options with retry configuration
 */
export interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Sleep utility for retry delay
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Enhanced fetch with retry logic and timeout
 */
export async function fetchWithRetry<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 10000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Make fetch request
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const data: ApiResponse<T> = await response.json();

      // Check if response is successful
      if (!response.ok) {
        throw new ApiError(
          data.success === false ? data.error : "Request failed",
          response.status,
          data.success === false ? data.errors : undefined
        );
      }

      // Return data (unwrap if ApiResponse format)
      return data.success === true && "data" in data ? data.data : (data as T);
    } catch (error: any) {
      lastError = error;

      // Don't retry on client errors (4xx) except 408 (timeout)
      if (
        error instanceof ApiError &&
        error.statusCode >= 400 &&
        error.statusCode < 500 &&
        error.statusCode !== 408
      ) {
        throw error;
      }

      // Don't retry on abort (timeout)
      if (error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }

      // Retry on network errors and 5xx errors
      if (attempt < retries) {
        await sleep(retryDelay * (attempt + 1)); // Exponential backoff
        continue;
      }
    }
  }

  // All retries failed
  throw lastError || new ApiError("Request failed after retries", 500);
}

/**
 * GET request
 */
export async function get<T = any>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: "GET",
    ...options,
  });
}

/**
 * POST request
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options?: FetchOptions
): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });
}

/**
 * PUT request
 */
export async function put<T = any>(
  url: string,
  data?: any,
  options?: FetchOptions
): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });
}

/**
 * DELETE request
 */
export async function del<T = any>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return fetchWithRetry<T>(url, {
    method: "DELETE",
    ...options,
  });
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(
  errors: Record<string, string[]>
): string {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join("; ");
}

/**
 * Format API error for display
 */
export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.errors) {
      return formatValidationErrors(error.errors);
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}
