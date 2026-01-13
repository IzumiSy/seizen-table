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
 */
export function DataTableContent({ children }: DataTableContentProps) {
  return <div className={styles.mainContent}>{children}</div>;
}
