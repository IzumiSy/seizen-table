import * as styles from "../styles.css";

/**
 * Table component that renders the HTML table.
 *
 * This component should be used inside SeizenTable.Content to handle
 * the layout with side panels.
 */
export function TableTable({ children }: React.PropsWithChildren) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>{children}</table>
    </div>
  );
}
