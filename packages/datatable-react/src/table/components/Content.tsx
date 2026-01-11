import type { ReactNode } from "react";
import * as styles from "../styles.css";

export interface DataTableContentProps {
  /**
   * Child components (DataTable.Table, DataTable.Pagination, DataTablePlugins.*, or custom elements)
   */
  children: ReactNode;
}

/**
 * Main content container that arranges children vertically.
 *
 * This is a pure layout component. Use DataTablePlugins.SidePanel,
 * DataTablePlugins.Header, and DataTablePlugins.Footer to add plugin content.
 *
 * @example Basic usage
 * ```tsx
 * <DataTable.Root table={table}>
 *   <DataTable.Content>
 *     <DataTable.Table>
 *       <thead><DataTable.Header /></thead>
 *       <tbody><DataTable.Body /></tbody>
 *     </DataTable.Table>
 *     <DataTable.Paginator />
 *   </DataTable.Content>
 * </DataTable.Root>
 * ```
 *
 * @example With plugin slots
 * ```tsx
 * <DataTable.Root table={table}>
 *   <DataTablePlugins.SidePanel position="left" />
 *   <DataTable.Content>
 *     <DataTablePlugins.Header />
 *     <DataTable.Table>...</DataTable.Table>
 *     <DataTablePlugins.Footer />
 *     <DataTable.Paginator />
 *   </DataTable.Content>
 *   <DataTablePlugins.SidePanel position="right" />
 * </DataTable.Root>
 * ```
 */
export function DataTableContent({ children }: DataTableContentProps) {
  return <div className={styles.mainContent}>{children}</div>;
}
