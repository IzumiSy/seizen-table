import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { DataTableInstance } from "../table/useDataTable";
import type { DataTableEventMap, DataTableEventName } from "./useEventBus";
import type { PluginArgsRegistry } from "./usePluginControl";

// =============================================================================
// Types
// =============================================================================

/**
 * Column info for plugins (simplified from ColumnDef)
 */
export interface PluginColumnInfo {
  /** Column accessor key */
  key: string;
  /** Column header text */
  header: string;
}

/**
 * Plugin context value available to all plugins.
 *
 * Note: `data`, `selectedRows`, and `table` are typed as `unknown` because
 * plugins are defined generically and cannot know the specific row type.
 */
export interface PluginContextValue<TOpenArgs = unknown> {
  /**
   * The DataTable instance
   */
  table: DataTableInstance<unknown>;

  /**
   * Current table data
   */
  data: unknown[];

  /**
   * Column information (key and header)
   */
  columns: PluginColumnInfo[];

  /**
   * Currently selected rows
   */
  selectedRows: unknown[];

  /**
   * Arguments passed to openPlugin() when the plugin was opened.
   * Use this to receive initial data when the plugin mounts.
   *
   * For type-safe access, pass the plugin ID as the type parameter:
   * ```tsx
   * const { openArgs } = usePluginContext<"row-detail">();
   * // openArgs is typed as { row: Person } if registered in PluginArgsRegistry
   * ```
   *
   * @example
   * ```tsx
   * // Application opens plugin with args:
   * table.plugin.open("row-detail", { row: clickedRow });
   *
   * // Plugin receives args (type-safe):
   * const { openArgs } = usePluginContext<"row-detail">();
   * const initialRow = openArgs?.row;
   * ```
   */
  openArgs: TOpenArgs | undefined;

  /**
   * Hook to subscribe to events emitted by DataTable.
   *
   * Built-in events:
   * - `data-change`: Table data changed
   * - `selection-change`: Row selection changed
   * - `filter-change`: Column filters changed
   * - `sorting-change`: Sorting changed
   * - `pagination-change`: Pagination changed
   * - `row-click`: A row was clicked
   *
   * @example
   * ```tsx
   * const { useEvent } = usePluginContext();
   *
   * // Subscribe to selection changes
   * useEvent("selection-change", (selectedRows) => {
   *   console.log("Selection changed:", selectedRows);
   * });
   *
   * // Subscribe to row clicks
   * useEvent("row-click", (row) => {
   *   console.log("Row clicked:", row);
   * });
   * ```
   */
  useEvent: <K extends DataTableEventName | (string & {})>(
    event: K,
    callback: (
      payload: K extends DataTableEventName ? DataTableEventMap[K] : unknown
    ) => void
  ) => void;
}

// =============================================================================
// Context
// =============================================================================

const PluginContext = createContext<PluginContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

export interface PluginContextProviderProps<TData> {
  table: DataTableInstance<TData>;
  children: ReactNode;
}

/**
 * Provider component that makes table context available to plugins
 */
export function PluginContextProvider<TData>({
  table,
  children,
}: PluginContextProviderProps<TData>) {
  const data = table.getData();
  const selectedRows = table.getSelectedRows();
  const filterState = table.getFilterState();
  const sortingState = table.getSortingState();
  const paginationState = table.getPaginationState();

  // Convert columns to simplified PluginColumnInfo (respecting column order)
  const columnOrder = table.getColumnOrder();
  const rawColumns: PluginColumnInfo[] = table.getColumns().map((col) => {
    const accessorKey =
      "accessorKey" in col ? (col.accessorKey as string) : col.id ?? "";
    const header = typeof col.header === "string" ? col.header : accessorKey;
    return { key: accessorKey, header };
  });

  // Sort columns by order if order is set
  const columns: PluginColumnInfo[] =
    columnOrder.length > 0
      ? [...rawColumns].sort((a, b) => {
          const aIndex = columnOrder.indexOf(a.key);
          const bIndex = columnOrder.indexOf(b.key);
          // Columns not in order go to the end
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        })
      : rawColumns;

  // Store previous values for change detection and emit events
  const prevDataRef = useRef(data);
  const prevSelectionRef = useRef(selectedRows);
  const prevFilterRef = useRef(filterState);
  const prevSortingRef = useRef(sortingState);
  const prevPaginationRef = useRef(paginationState);

  // Emit events when values change
  useEffect(() => {
    if (prevDataRef.current !== data) {
      prevDataRef.current = data;
      table.eventBus.emit("data-change", data);
    }
  }, [data, table.eventBus]);

  useEffect(() => {
    if (prevSelectionRef.current !== selectedRows) {
      prevSelectionRef.current = selectedRows;
      table.eventBus.emit("selection-change", selectedRows);
    }
  }, [selectedRows, table.eventBus]);

  useEffect(() => {
    if (prevFilterRef.current !== filterState) {
      prevFilterRef.current = filterState;
      table.eventBus.emit("filter-change", filterState);
    }
  }, [filterState, table.eventBus]);

  useEffect(() => {
    if (prevSortingRef.current !== sortingState) {
      prevSortingRef.current = sortingState;
      table.eventBus.emit("sorting-change", sortingState);
    }
  }, [sortingState, table.eventBus]);

  useEffect(() => {
    if (prevPaginationRef.current !== paginationState) {
      prevPaginationRef.current = paginationState;
      table.eventBus.emit("pagination-change", paginationState);
    }
  }, [paginationState, table.eventBus]);

  // useEvent hook factory
  const useEvent = <K extends DataTableEventName | (string & {})>(
    event: K,
    callback: (
      payload: K extends DataTableEventName ? DataTableEventMap[K] : unknown
    ) => void
  ) => {
    useEffect(() => {
      return table.eventBus.subscribe(
        event,
        callback as (payload: unknown) => void
      );
    }, [event, callback]);
  };

  const contextValue: PluginContextValue = {
    table: table as DataTableInstance<unknown>,
    data,
    columns,
    selectedRows,
    openArgs: table.plugin._state.args,
    useEvent,
  };

  return (
    <PluginContext.Provider value={contextValue}>
      {children}
    </PluginContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Hook to access table context from within a plugin component.
 *
 * Note: `data`, `selectedRows`, and `table` are typed as `unknown` because
 * plugins are defined generically and cannot know the specific row type at
 * definition time. Cast as needed in your plugin implementation.
 *
 * @typeParam TPluginId - The plugin ID for type-safe openArgs (optional)
 *
 * @example Basic usage
 * ```tsx
 * function MyPluginComponent() {
 *   const { table, data, selectedRows, useEvent } = usePluginContext();
 *
 *   useEvent("selection-change", (rows) => {
 *     console.log("Selection changed:", rows);
 *   });
 *
 *   return <div>Total rows: {data.length}</div>;
 * }
 * ```
 *
 * @example With type-safe openArgs
 * ```tsx
 * // First, register the plugin args type:
 * declare module "@izumisy/seizen-datatable-react/plugin" {
 *   interface PluginArgsRegistry {
 *     "row-detail": { row: Person };
 *   }
 * }
 *
 * // Then use with plugin ID for type-safe openArgs:
 * function RowDetailPanel() {
 *   const { openArgs } = usePluginContext<"row-detail">();
 *   // openArgs is typed as { row: Person } | undefined
 *   const row = openArgs?.row;
 * }
 * ```
 */
export function usePluginContext<
  TPluginId extends keyof PluginArgsRegistry | (string & {}) = string
>() {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error(
      "usePluginContext must be used within a DataTable component. " +
        "Make sure your plugin is rendered inside a DataTable."
    );
  }
  return context as PluginContextValue<
    TPluginId extends keyof PluginArgsRegistry
      ? PluginArgsRegistry[TPluginId]
      : unknown
  >;
}
