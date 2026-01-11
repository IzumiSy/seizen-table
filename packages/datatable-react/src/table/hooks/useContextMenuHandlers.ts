import { useCallback, useContext } from "react";
import type { Cell, Column, Row } from "@tanstack/react-table";
import {
  ContextMenuContext,
  type ContextMenuContextValue,
} from "../../plugin/ContextMenuRenderer";

/**
 * Hook to get context menu handlers for table cells and column headers.
 *
 * This hook provides event handlers that:
 * - Prevent default browser context menu
 * - Calculate element position (DOMRect)
 * - Open the appropriate context menu type
 *
 * @example
 * ```tsx
 * const handlers = useContextMenuHandlers<Person>();
 *
 * <td onContextMenu={(e) => handlers.handleCellContextMenu(e, cell, column, row)}>
 *   {content}
 * </td>
 *
 * <th onContextMenu={(e) => handlers.handleColumnContextMenu(e, column)}>
 *   {header}
 * </th>
 * ```
 *
 * @returns Object with handleCellContextMenu and handleColumnContextMenu functions
 */
export function useContextMenuHandlers<TData>() {
  const ctx = useContext(
    ContextMenuContext
  ) as ContextMenuContextValue<TData> | null;

  if (!ctx) {
    throw new Error(
      "useContextMenuHandlers must be used within a context menu provider (DataTable.Root or ContextMenuProvider)"
    );
  }

  const { openCellMenu, openColumnMenu } = ctx;

  const handleCellContextMenu = useCallback(
    (
      e: React.MouseEvent<HTMLTableCellElement>,
      cell: Cell<TData, unknown>,
      column: Column<TData, unknown>,
      row: Row<TData>
    ) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      openCellMenu(cell, column, row, rect);
    },
    [openCellMenu]
  );

  const handleColumnContextMenu = useCallback(
    (
      e: React.MouseEvent<HTMLTableCellElement>,
      column: Column<TData, unknown>
    ) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      openColumnMenu(column, rect);
    },
    [openColumnMenu]
  );

  return {
    /**
     * Handler for cell context menu events.
     * Call this in the onContextMenu prop of table cells.
     */
    handleCellContextMenu,

    /**
     * Handler for column header context menu events.
     * Call this in the onContextMenu prop of table header cells.
     */
    handleColumnContextMenu,
  };
}
