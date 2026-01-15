import { useState, useCallback, useMemo } from "react";

// =============================================================================
// Types
// =============================================================================

export interface RemoteData<TData> {
  // Data state
  data: TData[];
  loading: boolean;
  error: Error | null;

  // Server information
  totalCount: number;

  // Actions
  setLoading: (loading: boolean) => void;
  setData: (
    data: TData[],
    options?: { totalCount?: number; cursor?: string }
  ) => void;
  setError: (error: Error | null) => void;

  // Utilities
  getCursor: (pageIndex: number) => string | undefined;
  clearCursors: () => void;
  getRemoteOptions: () => { totalRowCount: number } | true;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * A minimal hook for managing remote data state.
 *
 * This hook only manages data-related state (data, loading, error, totalCount, cursors).
 * Pagination, sorting, and filters should be managed by the table directly.
 *
 * @example
 * ```tsx
 * const remote = useRemoteData<User>();
 * const table = useSeizenTable({
 *   data: remote.data,
 *   remote: remote.getRemoteOptions(),
 * });
 *
 * useSeizenTableEvent(table, "pagination-change", (pagination) => {
 *   fetchData({
 *     page: pagination.pageIndex,
 *     cursor: remote.getCursor(pagination.pageIndex - 1),
 *   });
 * });
 * ```
 */
export function useRemoteData<TData>(): RemoteData<TData> {
  // Data state
  const [data, setDataInternal] = useState<TData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Server information
  const [totalCount, setTotalCount] = useState(0);
  const [cursors, setCursors] = useState<Map<number, string>>(new Map());

  // Track current page for cursor storage
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // =============================================================================
  // Actions
  // =============================================================================

  const setData = useCallback(
    (newData: TData[], opts?: { totalCount?: number; cursor?: string }) => {
      setDataInternal(newData);
      if (opts?.totalCount !== undefined) {
        setTotalCount(opts.totalCount);
      }
      if (opts?.cursor) {
        setCursors((prev) => {
          const next = new Map(prev);
          next.set(currentPageIndex, opts.cursor!);
          return next;
        });
      }
    },
    [currentPageIndex]
  );

  // =============================================================================
  // Utilities
  // =============================================================================

  const getCursor = useCallback(
    (pageIndex: number) => {
      // Update current page index for cursor storage
      setCurrentPageIndex(pageIndex + 1);
      if (pageIndex < 0) return undefined;
      return cursors.get(pageIndex);
    },
    [cursors]
  );

  const clearCursors = useCallback(() => {
    setCursors(new Map());
    setCurrentPageIndex(0);
  }, []);

  const getRemoteOptions = useCallback(() => {
    return totalCount > 0 ? { totalRowCount: totalCount } : true;
  }, [totalCount]);

  // =============================================================================
  // Return
  // =============================================================================

  return useMemo(
    () => ({
      // Data state
      data,
      loading,
      error,

      // Server information
      totalCount,

      // Actions
      setLoading,
      setData,
      setError,

      // Utilities
      getCursor,
      clearCursors,
      getRemoteOptions,
    }),
    [
      data,
      loading,
      error,
      totalCount,
      setData,
      getCursor,
      clearCursors,
      getRemoteOptions,
    ]
  );
}
