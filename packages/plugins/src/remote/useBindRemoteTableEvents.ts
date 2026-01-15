import {
  useSeizenTableEvent,
  type SeizenTableInstance,
} from "@izumisy/seizen-table";
import type { RemoteTableState } from "./useRemoteTableState";

// =============================================================================
// Types
// =============================================================================

export interface UseBindRemoteTableEventsOptions {
  /**
   * Whether to reset pagination when sorting changes.
   * @default true
   */
  resetOnSortingChange?: boolean;

  /**
   * Whether to reset pagination when filters change.
   * @default true
   */
  resetOnFilterChange?: boolean;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Binds SeizenTable events to RemoteTableState.
 *
 * This hook subscribes to pagination-change, sorting-change, and filter-change
 * events from the table and updates the remote state accordingly.
 *
 * @example
 * ```tsx
 * const remote = useRemoteTableState<MyData>();
 * const table = useSeizenTable({ data: remote.data, ... });
 *
 * useBindRemoteTableEvents(table, remote);
 * ```
 */
export function useBindRemoteTableEvents<TData>(
  table: SeizenTableInstance<TData>,
  remote: RemoteTableState<TData>,
  options?: UseBindRemoteTableEventsOptions
): void {
  const { resetOnSortingChange = true, resetOnFilterChange = true } =
    options ?? {};

  // Pagination change
  useSeizenTableEvent(table, "pagination-change", (newPagination) => {
    remote.setPagination(newPagination);
  });

  // Sorting change
  useSeizenTableEvent(table, "sorting-change", (newSorting) => {
    remote.setSorting(newSorting);
    if (resetOnSortingChange) {
      remote.resetToFirstPage();
    }
  });

  // Filter change
  useSeizenTableEvent(table, "filter-change", (newFilters) => {
    remote.setFilters(newFilters);
    if (resetOnFilterChange) {
      remote.resetToFirstPage();
    }
  });
}
