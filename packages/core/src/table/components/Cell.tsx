import type { ReactNode } from "react";
import { flexRender, type Cell, type Row } from "@tanstack/react-table";
import { useContextMenuHandlers } from "../../plugin/contextMenu";
import { CellSlot } from "../../plugin/SeizenTablePlugins";
import * as styles from "../styles.css";

export interface TableCellProps<TData> {
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

  /**
   * Custom cell content.
   * If provided, replaces the default CellSlot rendering.
   * Use TablePlugins.CellSlot inside children if you want plugin support.
   */
  children?: ReactNode;
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
 *   <Table.Cell key={cell.id} cell={cell} row={row} />
 * ))}
 * ```
 *
 * @example Custom context menu handler
 * ```tsx
 * <Table.Cell
 *   cell={cell}
 *   row={row}
 *   onContextMenu={(e, cell, row) => {
 *     e.preventDefault();
 *     console.log('Custom context menu', cell.getValue());
 *   }}
 * />
 * ```
 *
 * @example Custom cell content with plugin support
 * ```tsx
 * <Table.Cell cell={cell} row={row}>
 *   <TablePlugins.CellSlot cell={cell} column={cell.column} row={row}>
 *     <CustomContent value={cell.getValue()} />
 *   </TablePlugins.CellSlot>
 * </Table.Cell>
 * ```
 *
 * @example Custom cell content without plugin support
 * ```tsx
 * <Table.Cell cell={cell} row={row}>
 *   <span>{cell.getValue()}</span>
 * </Table.Cell>
 * ```
 */
export function TableCell<TData>({
  cell,
  row,
  className,
  onContextMenu,
  children,
}: TableCellProps<TData>) {
  const { handleCellContextMenu } = useContextMenuHandlers<TData>();

  const handleContextMenu = (e: React.MouseEvent<HTMLTableCellElement>) => {
    if (onContextMenu) {
      onContextMenu(e, cell, row);
    } else {
      handleCellContextMenu(e, cell, cell.column, row);
    }
  };

  const cellClassName = className ? `${styles.td} ${className}` : styles.td;

  // Custom children - user takes full control of content
  if (children !== undefined) {
    return (
      <td className={cellClassName} onContextMenu={handleContextMenu}>
        {children}
      </td>
    );
  }

  // Default rendering with CellSlot
  return (
    <td className={cellClassName} onContextMenu={handleContextMenu}>
      <CellSlot cell={cell} column={cell.column} row={row}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </CellSlot>
    </td>
  );
}
