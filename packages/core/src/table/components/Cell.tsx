import type { ReactNode } from "react";
import { flexRender, type Cell, type Row } from "@tanstack/react-table";
import { useContextMenuHandlers } from "../../plugin/contextMenu";
import { SeizenTablePlugins } from "../../plugin/SeizenTablePlugins";
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
   * Custom cell content.
   * If provided, replaces the default SeizenTablePlugins.Cell rendering.
   * Use SeizenTablePlugins.Cell inside children if you want plugin support.
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
 *   <SeizenTable.Cell key={cell.id} cell={cell} row={row} />
 * ))}
 * ```
 *
 * @example Custom context menu handler
 * ```tsx
 * <SeizenTable.Cell
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
 * <SeizenTable.Cell cell={cell} row={row}>
 *   <SeizenTablePlugins.Cell cell={cell} column={cell.column} row={row}>
 *     <CustomContent value={cell.getValue()} />
 *   </SeizenTablePlugins.Cell>
 * </SeizenTable.Cell>
 * ```
 *
 * @example Custom cell content without plugin support
 * ```tsx
 * <SeizenTable.Cell cell={cell} row={row}>
 *   <span>{cell.getValue()}</span>
 * </SeizenTable.Cell>
 * ```
 */
export function TableCell<TData>({
  cell,
  row,
  className,
  children,
}: TableCellProps<TData>) {
  const { handleCellContextMenu } = useContextMenuHandlers<TData>();
  const cellClassName = className ? `${styles.td} ${className}` : styles.td;

  return (
    <td
      className={cellClassName}
      onContextMenu={(e) => {
        handleCellContextMenu(e, cell, cell.column, row);
      }}
    >
      {children ?? (
        <SeizenTablePlugins.Cell cell={cell} column={cell.column} row={row}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </SeizenTablePlugins.Cell>
      )}
    </td>
  );
}
