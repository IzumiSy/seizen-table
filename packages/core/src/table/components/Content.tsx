import type { ReactNode } from "react";
import * as styles from "../styles.css";

export interface TableContentProps {
  /**
   * Child components (SeizenTable.Table, SeizenTable.Pagination, SeizenTablePlugins.*, or custom elements)
   */
  children: ReactNode;
}

/**
 * Main content container that arranges children vertically.
 *
 * This is a pure layout component. Use SeizenTablePlugins.SidePanel,
 * SeizenTablePlugins.Header, and SeizenTablePlugins.Footer to add plugin content.
 */
export function TableContent({ children }: TableContentProps) {
  return <div className={styles.mainContent}>{children}</div>;
}
