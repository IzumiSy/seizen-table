import type { ReactNode } from "react";
import * as styles from "../styles.css";

export interface TableTableProps {
  /**
   * Table content (Table.Header, Table.Body, or custom thead/tbody)
   */
  children: ReactNode;
}

/**
 * Table component that renders the HTML table.
 *
 * This component should be used inside Table.Content to handle
 * the layout with side panels.
 */
export function TableTable({ children }: TableTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}
