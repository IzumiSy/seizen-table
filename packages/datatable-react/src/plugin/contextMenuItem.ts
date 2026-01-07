import type { ReactNode } from "react";
import type { Table, Cell, Column, Row } from "@tanstack/react-table";

// =============================================================================
// Context Menu Types
// =============================================================================

/**
 * Context menu item definition (resolved from factory)
 */
export interface ContextMenuItemEntry {
  /** Display label for the menu item */
  label: string;
  /** Optional icon to display alongside the label */
  icon?: ReactNode;
  /** Handler called when the menu item is clicked */
  onClick: () => void;
  /** Whether to show this item (default: true) */
  visible?: boolean;
  /** Whether the item is disabled (default: false) */
  disabled?: boolean;
}

// =============================================================================
// Cell Context Menu
// =============================================================================

/**
 * Context passed to cellContextMenuItem factory function
 */
export interface CellContextMenuItemContext<TData, TArgs = unknown> {
  /** The cell that was right-clicked */
  cell: Cell<TData, unknown>;
  /** The column of the right-clicked cell */
  column: Column<TData, unknown>;
  /** The row containing the right-clicked cell */
  row: Row<TData>;
  /** The raw value of the cell (cell.getValue()) */
  value: unknown;
  /** Currently selected rows in the table */
  selectedRows: TData[];
  /** TanStack Table instance */
  table: Table<TData>;
  /** Plugin configuration args (validated by Zod schema) */
  pluginArgs: TArgs;
}

/**
 * Factory type for creating cell context menu items
 */
export interface CellContextMenuItemFactory<TData, TArgs = unknown> {
  id: string;
  create: (
    ctx: CellContextMenuItemContext<TData, TArgs>
  ) => ContextMenuItemEntry;
}

// =============================================================================
// Column Context Menu
// =============================================================================

/**
 * Context passed to columnContextMenuItem factory function
 */
export interface ColumnContextMenuItemContext<TData, TArgs = unknown> {
  /** The column header that was right-clicked */
  column: Column<TData, unknown>;
  /** TanStack Table instance */
  table: Table<TData>;
  /** Plugin configuration args (validated by Zod schema) */
  pluginArgs: TArgs;
}

/**
 * Factory type for creating column context menu items
 */
export interface ColumnContextMenuItemFactory<TData, TArgs = unknown> {
  id: string;
  create: (
    ctx: ColumnContextMenuItemContext<TData, TArgs>
  ) => ContextMenuItemEntry;
}

// =============================================================================
// Cell Context Menu Factory
// =============================================================================

/**
 * Helper function to create a cell context menu item with full context access.
 *
 * The factory function receives context including the clicked cell, column, row,
 * cell value, table instance, and plugin configuration args.
 *
 * @param id - Unique identifier for the menu item
 * @param factory - Factory function that receives context and returns menu item entry
 *
 * @example Basic usage - Filter by cell value
 * ```tsx
 * cellContextMenuItem("filter-by-value", (ctx) => ({
 *   label: `Filter by "${ctx.value}"`,
 *   onClick: () => {
 *     ctx.column.setFilterValue(ctx.value);
 *   },
 * }))
 * ```
 *
 * @example With visibility based on column type
 * ```tsx
 * cellContextMenuItem("copy-value", (ctx) => ({
 *   label: "Copy value",
 *   onClick: () => navigator.clipboard.writeText(String(ctx.value)),
 *   visible: ctx.value != null,
 * }))
 * ```
 */
export function cellContextMenuItem<TData, TArgs = unknown>(
  id: string,
  factory: (
    ctx: CellContextMenuItemContext<TData, TArgs>
  ) => ContextMenuItemEntry
): CellContextMenuItemFactory<TData, TArgs> {
  return {
    id,
    create: factory,
  };
}

// =============================================================================
// Column Context Menu Factory
// =============================================================================

/**
 * Helper function to create a column context menu item with full context access.
 *
 * The factory function receives context including the clicked column header,
 * table instance, and plugin configuration args.
 *
 * @param id - Unique identifier for the menu item
 * @param factory - Factory function that receives context and returns menu item entry
 *
 * @example Basic usage - Hide column
 * ```tsx
 * columnContextMenuItem("hide-column", (ctx) => ({
 *   label: "Hide column",
 *   onClick: () => {
 *     ctx.column.toggleVisibility(false);
 *   },
 * }))
 * ```
 *
 * @example Sort column
 * ```tsx
 * columnContextMenuItem("sort-asc", (ctx) => ({
 *   label: "Sort ascending",
 *   onClick: () => {
 *     ctx.column.toggleSorting(false);
 *   },
 *   visible: ctx.column.getCanSort(),
 * }))
 * ```
 */
export function columnContextMenuItem<TData, TArgs = unknown>(
  id: string,
  factory: (
    ctx: ColumnContextMenuItemContext<TData, TArgs>
  ) => ContextMenuItemEntry
): ColumnContextMenuItemFactory<TData, TArgs> {
  return {
    id,
    create: factory,
  };
}
