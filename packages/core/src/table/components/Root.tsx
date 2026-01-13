import { createContext, useContext } from "react";
import type { SeizenTableInstance } from "../useSeizenTable";
import { PluginContextProvider } from "../../plugin/Context";
import { ContextMenuProvider } from "../../plugin/contextMenu";
import * as styles from "../styles.css";

// =============================================================================
// Context
// =============================================================================

const SeizenTableContext = createContext<SeizenTableInstance<any> | null>(null);

/**
 * Hook to access the SeizenTable instance from compound components.
 *
 * This hook allows compound components to access the table instance
 * without explicitly passing it as a prop.
 */
export function useSeizenTableContext<
  TData = any
>(): SeizenTableInstance<TData> {
  const context = useContext(SeizenTableContext);
  if (!context) {
    throw new Error(
      "useSeizenTableContext must be used within SeizenTable.Root. " +
        "Make sure your component is wrapped in <SeizenTable.Root table={table}>."
    );
  }
  return context as SeizenTableInstance<TData>;
}

export interface TableRootProps<TData> {
  /**
   * The table instance from useSeizenTable
   */
  table: SeizenTableInstance<TData>;

  /**
   * Additional CSS class name for the root container
   */
  className?: string;
}

/**
 * Root component that provides context for all SeizenTable compound components.
 *
 * This component wraps children with:
 * - PluginContextProvider: Makes table state available to plugins
 * - ContextMenuProvider: Manages context menu state and rendering
 */
export function TableRoot<TData>({
  table,
  children,
  className,
}: React.PropsWithChildren<TableRootProps<TData>>) {
  const tanstack = table._tanstackTable;
  const containerClassName = className
    ? `${styles.container} ${className}`
    : styles.container;

  return (
    <SeizenTableContext.Provider value={table}>
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
    </SeizenTableContext.Provider>
  );
}
