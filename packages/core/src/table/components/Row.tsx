import type { Row } from "@tanstack/react-table";
import { useSeizenTableContext } from "./Root";
import { TableCell } from "./Cell";
import * as styles from "../styles.css";

export interface TableRowProps<TData> {
  /**
   * The TanStack Table Row object
   */
  row: Row<TData>;

  /**
   * Additional CSS class name for the row
   */
  className?: string;

  /**
   * Custom cell renderer (optional).
   * If provided, this function will be called for each cell instead of using the default SeizenTable.Cell component.
   */
  renderCell?: (
    cell: ReturnType<Row<TData>["getVisibleCells"]>[number]
  ) => React.ReactNode;
}

/**
 * Table row component with default click behavior and cell rendering.
 *
 * Features:
 * - Automatic row-click event emission
 * - Visual selection state (data-selected attribute)
 * - Cell rendering with context menu support
 * - Inline row slot support (for expandable rows)
 *
 * @example Default usage
 * ```tsx
 * {rows.map(row => (
 *   <SeizenTable.Row key={row.id} row={row} />
 * ))}
 * ```
 *
 * @example Custom click handler
 * ```tsx
 * <SeizenTable.Row
 *   row={row}
 *   onClick={(row) => console.log('Custom click:', row.original)}
 * />
 * ```
 *
 * @example Custom cell rendering
 * ```tsx
 * <SeizenTable.Row
 *   row={row}
 *   renderCell={(cell) => (
 *     <td key={cell.id} className="custom-cell">
 *       {cell.getValue()}
 *     </td>
 *   )}
 * />
 * ```
 */
export function TableRow<TData>({
  row,
  className,
  renderCell,
}: TableRowProps<TData>) {
  const tableFromContext = useSeizenTableContext();
  const table = tableFromContext;
  const rowClassName = className ? `${styles.tr} ${className}` : styles.tr;

  return (
    <tr
      className={rowClassName}
      data-selected={row.getIsSelected() || undefined}
      onClick={() => {
        table.eventBus.emit("row-click", row.original);
      }}
    >
      {renderCell
        ? row.getVisibleCells().map(renderCell)
        : row
            .getVisibleCells()
            .map((cell) => <TableCell key={cell.id} cell={cell} row={row} />)}
    </tr>
  );
}
