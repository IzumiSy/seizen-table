import { useState, useCallback, useMemo } from "react";
import type {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from "@izumisy/seizen-table";

// =============================================================================
// Types
// =============================================================================

export interface UseRemoteTableStateOptions {
  initialPagination?: PaginationState;
  initialSorting?: SortingState;
  initialFilters?: ColumnFiltersState;
}

export interface RemoteTableState<TData> {
  // Data state
  data: TData[];
  loading: boolean;
  error: Error | null;

  // Query parameters
  pagination: PaginationState;
  sorting: SortingState;
  filters: ColumnFiltersState;

  // Server information
  totalCount: number;

  // Actions - Query state updates
  setPagination: (pagination: PaginationState) => void;
  setSorting: (sorting: SortingState) => void;
  setFilters: (filters: ColumnFiltersState) => void;

  // Actions - Data state updates
  setLoading: (loading: boolean) => void;
  setData: (
    data: TData[],
    options?: { totalCount?: number; cursor?: string }
  ) => void;
  setError: (error: Error | null) => void;

  // Utilities
  resetToFirstPage: () => void;
  reset: () => void;
  getCurrentCursor: () => string | undefined;
  getRemoteOptions: () => { totalRowCount: number } | true;
}

// =============================================================================
// Default values
// =============================================================================

const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

// =============================================================================
// Hook
// =============================================================================

export function useRemoteTableState<TData>(
  options?: UseRemoteTableStateOptions
): RemoteTableState<TData> {
  // Data state
  const [data, setDataInternal] = useState<TData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Query state
  const [pagination, setPaginationInternal] = useState<PaginationState>(
    options?.initialPagination ?? DEFAULT_PAGINATION
  );
  const [sorting, setSortingInternal] = useState<SortingState>(
    options?.initialSorting ?? []
  );
  const [filters, setFiltersInternal] = useState<ColumnFiltersState>(
    options?.initialFilters ?? []
  );

  // Server information
  const [totalCount, setTotalCount] = useState(0);
  const [cursors, setCursors] = useState<Map<number, string>>(new Map());

  // Store initial values for reset
  const initialPagination = options?.initialPagination ?? DEFAULT_PAGINATION;
  const initialSorting = options?.initialSorting ?? [];
  const initialFilters = options?.initialFilters ?? [];

  // =============================================================================
  // Actions
  // =============================================================================

  const setPagination = useCallback((newPagination: PaginationState) => {
    setPaginationInternal(newPagination);
  }, []);

  const setSorting = useCallback((newSorting: SortingState) => {
    setSortingInternal(newSorting);
  }, []);

  const setFilters = useCallback((newFilters: ColumnFiltersState) => {
    setFiltersInternal(newFilters);
  }, []);

  const setData = useCallback(
    (newData: TData[], opts?: { totalCount?: number; cursor?: string }) => {
      setDataInternal(newData);
      if (opts?.totalCount !== undefined) {
        setTotalCount(opts.totalCount);
      }
      if (opts?.cursor) {
        setCursors((prev) => {
          const next = new Map(prev);
          next.set(pagination.pageIndex, opts.cursor!);
          return next;
        });
      }
    },
    [pagination.pageIndex]
  );

  // =============================================================================
  // Utilities
  // =============================================================================

  const resetToFirstPage = useCallback(() => {
    setPaginationInternal((prev) => ({ ...prev, pageIndex: 0 }));
    setCursors(new Map());
  }, []);

  const reset = useCallback(() => {
    setDataInternal([]);
    setLoading(false);
    setError(null);
    setPaginationInternal(initialPagination);
    setSortingInternal(initialSorting);
    setFiltersInternal(initialFilters);
    setTotalCount(0);
    setCursors(new Map());
  }, [initialPagination, initialSorting, initialFilters]);

  const getCurrentCursor = useCallback(() => {
    if (pagination.pageIndex === 0) return undefined;
    return cursors.get(pagination.pageIndex - 1);
  }, [pagination.pageIndex, cursors]);

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

      // Query parameters
      pagination,
      sorting,
      filters,

      // Server information
      totalCount,

      // Actions
      setPagination,
      setSorting,
      setFilters,
      setLoading,
      setData,
      setError,

      // Utilities
      resetToFirstPage,
      reset,
      getCurrentCursor,
      getRemoteOptions,
    }),
    [
      data,
      loading,
      error,
      pagination,
      sorting,
      filters,
      totalCount,
      setPagination,
      setSorting,
      setFilters,
      setData,
      resetToFirstPage,
      reset,
      getCurrentCursor,
      getRemoteOptions,
    ]
  );
}
