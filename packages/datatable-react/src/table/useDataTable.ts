import { useMemo, useState, useCallback } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type VisibilityState,
  type ColumnOrderState,
  type Table,
} from "@tanstack/react-table";
import type { DataTablePlugin } from "../plugin";
import { useEventBus, type EventBus } from "../plugin/useEventBus";
import {
  usePluginControl,
  type PluginControl,
} from "../plugin/usePluginControl";

// =============================================================================
// Column Types
// =============================================================================

export type DataTableColumn<TData> = ColumnDef<TData, unknown>;

// =============================================================================
// useDataTable Types
// =============================================================================

/**
 * Options for useDataTable hook
 */
export interface UseDataTableOptions<TData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  /** Plugins to use. Plugins that don't use context menu can be DataTablePlugin<any>. */
  plugins?: DataTablePlugin<any>[];
  initialSelection?: RowSelectionState;
  enableMultiSelect?: boolean;
  onSelectionChange?: (selection: TData[]) => void;
}

/**
 * DataTable instance returned by useDataTable
 */
export interface DataTableInstance<TData> {
  // ===========================================================================
  // Selection
  // ===========================================================================

  /**
   * Get the currently selected rows.
   * @returns Array of selected row data
   */
  getSelectedRows: () => TData[];

  /**
   * Set the selected rows programmatically.
   * @param rows - Array of row data to select
   */
  setSelectedRows: (rows: TData[]) => void;

  /**
   * Clear all row selections.
   */
  clearSelection: () => void;

  // ===========================================================================
  // Filtering
  // ===========================================================================

  /**
   * Get the current column filter state.
   * @returns Array of column filters
   */
  getFilterState: () => ColumnFiltersState;

  /**
   * Set column filters programmatically.
   * @param filter - Column filter state to apply
   */
  setFilter: (filter: ColumnFiltersState) => void;

  /**
   * Get the current global filter value.
   * @returns Global filter string
   */
  getGlobalFilter: () => string;

  /**
   * Set the global filter value.
   * @param value - Filter string to apply across all columns
   */
  setGlobalFilter: (value: string) => void;

  // ===========================================================================
  // Sorting
  // ===========================================================================

  /**
   * Get the current sorting state.
   * @returns Array of sorting configurations
   */
  getSortingState: () => SortingState;

  /**
   * Set sorting programmatically.
   * @param sorting - Sorting state to apply
   */
  setSorting: (sorting: SortingState) => void;

  // ===========================================================================
  // Pagination
  // ===========================================================================

  /**
   * Get the current pagination state.
   * @returns Pagination state including pageIndex and pageSize
   */
  getPaginationState: () => PaginationState;

  /**
   * Set the current page index (0-based).
   * @param index - Page index to navigate to
   */
  setPageIndex: (index: number) => void;

  /**
   * Set the number of rows per page.
   * @param size - Number of rows to display per page
   */
  setPageSize: (size: number) => void;

  // ===========================================================================
  // Data
  // ===========================================================================

  /**
   * Get the current table data.
   * @returns Array of row data
   */
  getData: () => TData[];

  /**
   * Get the column definitions.
   * @returns Array of column definitions
   */
  getColumns: () => DataTableColumn<TData>[];

  // ===========================================================================
  // Column Visibility
  // ===========================================================================

  /**
   * Get the current column visibility state.
   * @returns Object mapping column IDs to visibility (true = visible)
   */
  getColumnVisibility: () => VisibilityState;

  /**
   * Set column visibility state.
   * @param visibility - Object mapping column IDs to visibility
   */
  setColumnVisibility: (visibility: VisibilityState) => void;

  /**
   * Toggle visibility of a specific column.
   * @param columnId - The column ID to toggle
   */
  toggleColumnVisibility: (columnId: string) => void;

  // ===========================================================================
  // Column Order
  // ===========================================================================

  /**
   * Get the current column order.
   * @returns Array of column IDs in order
   */
  getColumnOrder: () => ColumnOrderState;

  /**
   * Set the column order.
   * @param order - Array of column IDs in desired order
   */
  setColumnOrder: (order: ColumnOrderState) => void;

  /**
   * Move a column to a new position.
   * @param columnId - The column ID to move
   * @param toIndex - The target index
   */
  moveColumn: (columnId: string, toIndex: number) => void;

  // ===========================================================================
  // Plugins
  // ===========================================================================

  /**
   * Plugins registered with this table.
   */
  plugins: DataTablePlugin<any>[];

  /**
   * Plugin control interface.
   */
  plugin: PluginControl;

  // ===========================================================================
  // Event Bus
  // ===========================================================================

  /**
   * Event bus for plugin communication.
   * Use this to emit custom events that plugins can subscribe to.
   *
   * @example
   * ```tsx
   * // Emit a custom event
   * table.eventBus.emit("my-custom-event", { data: "value" });
   * ```
   */
  eventBus: EventBus;

  // ===========================================================================
  // Advanced
  // ===========================================================================

  /**
   * The underlying TanStack Table instance.
   * Use this for advanced operations not exposed by DataTableInstance.
   * @internal
   */
  _tanstackTable: Table<TData>;
}

/**
 * Hook for creating a data table instance
 * Returns a DataTableInstance with methods for controlling the table
 */
export function useDataTable<TData>({
  data,
  columns,
  plugins = [],
  initialSelection = {},
  enableMultiSelect = true,
  onSelectionChange,
}: UseDataTableOptions<TData>): DataTableInstance<TData> {
  // Table state
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialSelection);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  // Plugin control
  const plugin = usePluginControl();

  // Event bus for plugin communication
  const eventBus = useEventBus();

  // Handle selection change callback
  const handleRowSelectionChange = useCallback(
    (
      updater:
        | RowSelectionState
        | ((old: RowSelectionState) => RowSelectionState)
    ) => {
      setRowSelection((old) => {
        const newSelection =
          typeof updater === "function" ? updater(old) : updater;
        return newSelection;
      });
    },
    []
  );

  // Create TanStack Table instance
  const tanstackTable = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      columnVisibility,
      columnOrder,
    },
    enableRowSelection: true,
    enableMultiRowSelection: enableMultiSelect,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Create DataTableInstance with helper methods
  const instance = useMemo<DataTableInstance<TData>>(() => {
    const getSelectedRows = () => {
      return tanstackTable
        .getSelectedRowModel()
        .rows.map((row) => row.original);
    };

    return {
      // Selection
      getSelectedRows,
      setSelectedRows: (rows: TData[]) => {
        const newSelection: RowSelectionState = {};
        rows.forEach((row) => {
          const index = data.indexOf(row);
          if (index !== -1) {
            newSelection[index] = true;
          }
        });
        setRowSelection(newSelection);
      },
      clearSelection: () => setRowSelection({}),

      // Filtering
      getFilterState: () => columnFilters,
      setFilter: setColumnFilters,
      getGlobalFilter: () => globalFilter,
      setGlobalFilter,

      // Sorting
      getSortingState: () => sorting,
      setSorting,

      // Pagination
      getPaginationState: () => pagination,
      setPageIndex: (index: number) =>
        setPagination((prev) => ({ ...prev, pageIndex: index })),
      setPageSize: (size: number) =>
        setPagination((prev) => ({ ...prev, pageSize: size })),

      // Data
      getData: () => data,
      getColumns: () => columns,

      // Column Visibility
      getColumnVisibility: () => columnVisibility,
      setColumnVisibility,
      toggleColumnVisibility: (columnId: string) => {
        setColumnVisibility((prev) => ({
          ...prev,
          [columnId]: prev[columnId] === false ? true : false,
        }));
      },

      // Column Order
      getColumnOrder: () => columnOrder,
      setColumnOrder,
      moveColumn: (columnId: string, toIndex: number) => {
        setColumnOrder((prev) => {
          // If no order is set, use the default column order
          const currentOrder =
            prev.length > 0
              ? prev
              : columns.map((col) =>
                  "accessorKey" in col
                    ? (col.accessorKey as string)
                    : col.id ?? ""
                );
          const fromIndex = currentOrder.indexOf(columnId);
          if (fromIndex === -1) return prev;
          const newOrder = [...currentOrder];
          newOrder.splice(fromIndex, 1);
          newOrder.splice(toIndex, 0, columnId);
          return newOrder;
        });
      },

      // Plugins
      plugins,
      plugin,

      // Event bus
      eventBus,

      // TanStack Table instance for advanced usage
      _tanstackTable: tanstackTable,
    };
  }, [
    tanstackTable,
    data,
    columns,
    plugins,
    columnFilters,
    globalFilter,
    sorting,
    pagination,
    columnVisibility,
    columnOrder,
    plugin,
    eventBus,
  ]);

  // Notify selection changes
  useMemo(() => {
    if (onSelectionChange) {
      onSelectionChange(instance.getSelectedRows());
    }
  }, [rowSelection, onSelectionChange, instance]);

  return instance;
}
