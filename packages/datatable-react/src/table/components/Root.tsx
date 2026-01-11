import { createContext, useContext, type ReactNode } from "react";
import type { DataTableInstance } from "../useDataTable";
import { PluginContextProvider } from "../../plugin/Context";
import { ContextMenuProvider } from "../../plugin/ContextMenuRenderer";
import * as styles from "../styles.css";

// =============================================================================
// Context
// =============================================================================

const DataTableContext = createContext<DataTableInstance<any> | null>(null);

/**
 * Hook to access the DataTable instance from compound components.
 *
 * This hook allows compound components to access the table instance
 * without explicitly passing it as a prop.
 *
 * @example
 * ```tsx
 * function CustomComponent() {
 *   const table = useDataTableContext();
 *   const data = table.getData();
 *   return <div>Total: {data.length}</div>;
 * }
 * ```
 */
export function useDataTableContext<TData = any>(): DataTableInstance<TData> {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error(
      "useDataTableContext must be used within DataTable.Root. " +
        "Make sure your component is wrapped in <DataTable.Root table={table}>."
    );
  }
  return context as DataTableInstance<TData>;
}

export interface DataTableRootProps<TData> {
  /**
   * The table instance from useDataTable
   */
  table: DataTableInstance<TData>;

  /**
   * Child components (DataTable.Table, DataTable.Pagination, etc.)
   */
  children: ReactNode;

  /**
   * Additional CSS class name for the root container
   */
  className?: string;
}

/**
 * Root component that provides context for all DataTable compound components.
 *
 * This component wraps children with:
 * - PluginContextProvider: Makes table state available to plugins
 * - ContextMenuProvider: Manages context menu state and rendering
 *
 * @example
 * ```tsx
 * <DataTable.Root table={table}>
 *   <DataTable.Table>
 *     <DataTable.Header />
 *     <DataTable.Body />
 *   </DataTable.Table>
 *   <DataTable.Pagination />
 * </DataTable.Root>
 * ```
 */
export function DataTableRoot<TData>({
  table,
  children,
  className,
}: DataTableRootProps<TData>) {
  const tanstack = table._tanstackTable;

  const containerClassName = className
    ? `${styles.container} ${className}`
    : styles.container;

  return (
    <DataTableContext.Provider value={table}>
      <PluginContextProvider table={table}>
        <ContextMenuProvider
          table={tanstack}
          plugins={table.plugins}
          selectedRows={table.getSelectedRows()}
          emit={table.eventBus.emit}
        >
          <div className={containerClassName}>{children}</div>
        </ContextMenuProvider>
      </PluginContextProvider>
    </DataTableContext.Provider>
  );
}
