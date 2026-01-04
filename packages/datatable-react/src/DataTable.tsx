import { flexRender } from "@tanstack/react-table";
import { useDataTable } from "./useDataTable";
import type { DataTableColumn } from "./types";
import * as styles from "./styles.css";

export interface DataTableProps<TData> {
  /**
   * The data array to display in the table
   */
  data: TData[];

  /**
   * Column definitions for the table
   */
  columns: DataTableColumn<TData>[];

  /**
   * Additional CSS class name for the table element
   */
  className?: string;
}

/**
 * DataTable component with default UI rendering
 * Uses semantic HTML table elements with CSS Variables for theming
 */
export function DataTable<TData>({
  data,
  columns,
  className,
}: DataTableProps<TData>) {
  const table = useDataTable({ data, columns });

  const tableClassName = className
    ? `${styles.table} ${className}`
    : styles.table;

  return (
    <table className={tableClassName}>
      <thead className={styles.thead}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className={styles.th}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className={styles.tr}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className={styles.td}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
