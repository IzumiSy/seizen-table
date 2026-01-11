import { flexRender, type Cell, type Row } from "@tanstack/react-table";
import { useContextMenu } from "../useContextMenu";
import { CellSlotRenderer } from "../../plugin/SlotRenderer";
import * as styles from "../styles.css";

export interface DataTableCellProps<TData> {
  /**
   * The TanStack Table Cell object
   */
  cell: Cell<TData, unknown>;

  /**
   * The TanStack Table Row object (parent row)
   */
  row: Row<TData>;

  /**
   * Additional CSS class name for the cell
   */
  className?: string;

  /**
   * Custom onContextMenu handler.
   * If not provided, uses default context menu handler.
   */
  onContextMenu?: (
    e: React.MouseEvent<HTMLTableCellElement>,
    cell: Cell<TData, unknown>,
    row: Row<TData>
  ) => void;
}

/**
 * Table cell component with default rendering and context menu support.
 *
 * Features:
 * - Automatic cell content rendering via flexRender
 * - Context menu support (right-click)
 * - Plugin cell slot support (custom cell renderers)
 *
 * @example Default usage
 * ```tsx
 * {row.getVisibleCells().map(cell => (
 *   <DataTable.Cell key={cell.id} cell={cell} row={row} />
 * ))}
 * ```
 *
 * @example Custom context menu handler
 * ```tsx
 * <DataTable.Cell
 *   cell={cell}
 *   row={row}
 *   onContextMenu={(e, cell, row) => {
 *     e.preventDefault();
 *     console.log('Custom context menu', cell.getValue());
 *   }}
 * />
 * ```
 *
 * @example Custom styling
 * ```tsx
 * <DataTable.Cell
 *   cell={cell}
 *   row={row}
 *   className="custom-cell"
 * />
 * ```
 */
export function DataTableCell<TData>({
  cell,
  row,
  className,
  onContextMenu,
}: DataTableCellProps<TData>) {
  const { handleCellContextMenu } = useContextMenu<TData>();

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement>) => {
    if (onContextMenu) {
      onContextMenu(e, cell, row);
    } else {
      handleCellContextMenu(e, cell, cell.column, row);
    }
  };

  const cellClassName = className ? `${styles.td} ${className}` : styles.td;

  return (
    <td className={cellClassName} onContextMenu={handleContextMenu}>
      <CellSlotRenderer cell={cell} column={cell.column} row={row}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </CellSlotRenderer>
    </td>
  );
}
