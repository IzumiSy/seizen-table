import * as styles from "../styles.css";

export interface TableTableProps {
  children?: React.ReactNode;
  /**
   * Additional elements to render inside the table wrapper (e.g., Loader).
   * These are rendered before the table element.
   */
  before?: React.ReactNode;
}

/**
 * Table component that renders the HTML table.
 *
 * This component should be used inside SeizenTable.Content to handle
 * the layout with side panels.
 *
 * @example Basic usage
 * ```tsx
 * <TableTable>
 *   <TableHeader />
 *   <TableBody />
 * </TableTable>
 * ```
 *
 * @example With loader
 * ```tsx
 * <TableTable before={<SeizenTable.Loader loading={isLoading} />}>
 *   <TableHeader />
 *   <TableBody />
 * </TableTable>
 * ```
 */
export function TableTable({ children, before }: TableTableProps) {
  return (
    <div className={styles.tableWrapper}>
      {before}
      <table className={styles.table}>{children}</table>
    </div>
  );
}
