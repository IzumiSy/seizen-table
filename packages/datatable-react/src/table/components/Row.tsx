import type { Row } from "@tanstack/react-table";
import { useDataTableContext } from "./Root";
import { DataTableCell } from "./Cell";
import { InlineRowSlotRenderer } from "../../plugin/SlotRenderer";
import * as styles from "../styles.css";

export interface DataTableRowProps<TData> {
  /**
   * The TanStack Table Row object
   */
  row: Row<TData>;

  /**
   * Additional CSS class name for the row
   */
  className?: string;

  /**
   * Custom onClick handler for the row.
   * If not provided, automatically emits "row-click" event via eventBus.
   */
  onClick?: (row: Row<TData>) => void;

  /**
   * Custom cell renderer (optional).
   * If provided, this function will be called for each cell instead of using the default DataTable.Cell component.
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
 *   <DataTable.Row key={row.id} row={row} />
 * ))}
 * ```
 *
 * @example Custom click handler
 * ```tsx
 * <DataTable.Row
 *   row={row}
 *   onClick={(row) => console.log('Custom click:', row.original)}
 * />
 * ```
 *
 * @example Custom cell rendering
 * ```tsx
 * <DataTable.Row
 *   row={row}
 *   renderCell={(cell) => (
 *     <td key={cell.id} className="custom-cell">
 *       {cell.getValue()}
 *     </td>
 *   )}
 * />
 * ```
 */
export function DataTableRow<TData>({
  row,
  className,
  onClick,
  renderCell,
}: DataTableRowProps<TData>) {
  const tableFromContext = useDataTableContext();
  const table = tableFromContext;

  const handleClick = () => {
    if (onClick) {
      onClick(row);
    } else {
      // Default: emit row-click event
      table.eventBus.emit("row-click", row.original);
    }
  };

  const rowClassName = className ? `${styles.tr} ${className}` : styles.tr;

  return (
    <>
      <tr
        className={rowClassName}
        data-selected={row.getIsSelected() || undefined}
        onClick={handleClick}
      >
        {renderCell
          ? row.getVisibleCells().map(renderCell)
          : row
              .getVisibleCells()
              .map((cell) => (
                <DataTableCell key={cell.id} cell={cell} row={row} />
              ))}
      </tr>
      {/* Inline Row Slot - renders below matching row */}
      <InlineRowSlotRenderer row={row} colSpan={row.getVisibleCells().length} />
    </>
  );
}
