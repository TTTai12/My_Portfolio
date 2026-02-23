/**
 * Custom React hooks for common patterns
 */

import { useState, useCallback, useEffect } from "react";
import type { DataState, ListState } from "@/types";
import { fetchWithRetry, formatApiError } from "@/lib/api";

/**
 * Hook for managing single data fetch with loading and error states
 */
export function useData<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = [],
): DataState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<DataState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetchFn();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: formatApiError(error),
      });
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

/**
 * Hook for managing list data fetch with loading and error states
 */
export function useListData<T>(
  fetchFn: () => Promise<T[]>,
  deps: unknown[] = [],
): ListState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ListState<T>>({
    items: [],
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const items = await fetchFn();
      setState({ items, isLoading: false, error: null });
    } catch (error) {
      setState({
        items: [],
        isLoading: false,
        error: formatApiError(error),
      });
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

/**
 * Hook for managing form submission with loading and error states
 */
export function useFormSubmit<T>(
  submitFn: (data: T) => Promise<void>,
  onSuccess?: () => void,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: T) => {
      setIsLoading(true);
      setError(null);

      try {
        await submitFn(data);
        onSuccess?.();
      } catch (err) {
        setError(formatApiError(err));
        throw err; // Re-throw to allow form-level handling
      } finally {
        setIsLoading(false);
      }
    },
    [submitFn, onSuccess],
  );

  const clearError = useCallback(() => setError(null), []);

  return { handleSubmit, isLoading, error, clearError };
}

/**
 * Hook for managing async actions with loading and error states
 */
export function useAsync<T extends any[], R = void>(
  asyncFn: (...args: T) => Promise<R>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: T): Promise<R | undefined> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFn(...args);
        return result;
      } catch (err) {
        setError(formatApiError(err));
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFn],
  );

  const clearError = useCallback(() => setError(null), []);

  return { execute, isLoading, error, clearError };
}

/**
 * Hook for debouncing values (useful for search inputs)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
