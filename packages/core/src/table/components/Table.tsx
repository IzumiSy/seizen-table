import type { ReactNode } from "react";
import * as styles from "../styles.css";

export interface DataTableTableProps {
  /**
   * Table content (DataTable.Header, DataTable.Body, or custom thead/tbody)
   */
  children: ReactNode;
}

/**
 * Table component that renders the HTML table.
 *
 * This component should be used inside DataTable.Content to handle
 * the layout with side panels.
 */
export function DataTableTable({ children }: DataTableTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}
