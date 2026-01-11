import type { ReactNode } from "react";
import { FooterSlotRenderer } from "../../plugin/SlotRenderer";
import * as styles from "../styles.css";

export interface DataTableTableProps {
  /**
   * Table content (DataTable.Header, DataTable.Body, or custom thead/tbody)
   */
  children: ReactNode;
}

/**
 * Table component that renders the HTML table with footer slot.
 *
 * This component should be used inside DataTable.MainContent to handle
 * the layout with sidepanels.
 *
 * @example With MainContent and Pagination
 * ```tsx
 * <DataTable.Root table={table}>
 *   <DataTable.MainContent>
 *     <DataTable.Table>
 *       <DataTable.Header table={table} />
 *       <DataTable.Body table={table} />
 *     </DataTable.Table>
 *     <DataTable.Pagination table={table} />
 *   </DataTable.MainContent>
 * </DataTable.Root>
 * ```
 *
 * @example Custom structure
 * ```tsx
 * <DataTable.Table>
 *   <thead>
 *     <tr><th>Custom Header</th></tr>
 *   </thead>
 *   <tbody>
 *     <tr><td>Custom Body</td></tr>
 *   </tbody>
 * </DataTable.Table>
 * ```
 */
export function DataTableTable({ children }: DataTableTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>{children}</table>
      {/* Footer Slot - below the table */}
      <FooterSlotRenderer />
    </div>
  );
}
