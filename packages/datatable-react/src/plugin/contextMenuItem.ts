import type { ReactNode } from "react";
import type { Table } from "@tanstack/react-table";

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

/**
 * Context passed to contextMenuItem factory function
 */
export interface ContextMenuItemContext<TData, TArgs = unknown> {
  /** The row that was right-clicked */
  row: TData;
  /** Index of the right-clicked row */
  rowIndex: number;
  /** Currently selected rows in the table */
  selectedRows: TData[];
  /** TanStack Table instance */
  table: Table<TData>;
  /** Plugin configuration args (validated by Zod schema) */
  pluginArgs: TArgs;
}

/**
 * Factory type for creating context menu items
 */
export interface ContextMenuItemFactory<TData, TArgs = unknown> {
  id: string;
  create: (ctx: ContextMenuItemContext<TData, TArgs>) => ContextMenuItemEntry;
}

/**
 * Helper function to create a context menu item with full context access.
 *
 * The factory function receives context including the clicked row, selected rows,
 * table instance, and plugin configuration args.
 *
 * @param id - Unique identifier for the menu item
 * @param factory - Factory function that receives context and returns menu item entry
 *
 * @example Basic usage
 * ```tsx
 * contextMenuItem("copy-id", (ctx) => ({
 *   label: "Copy ID",
 *   onClick: () => navigator.clipboard.writeText(ctx.row.id),
 * }))
 * ```
 *
 * @example With visibility and plugin args
 * ```tsx
 * contextMenuItem("delete", (ctx) => ({
 *   label: ctx.selectedRows.length > 1
 *     ? `Delete ${ctx.selectedRows.length} items`
 *     : "Delete",
 *   onClick: () => {
 *     const targets = ctx.selectedRows.length > 0 ? ctx.selectedRows : [ctx.row];
 *     handleDelete(targets);
 *   },
 *   visible: ctx.pluginArgs.enableDelete,
 *   disabled: ctx.selectedRows.length === 0,
 * }))
 * ```
 */
export function contextMenuItem<TData, TArgs = unknown>(
  id: string,
  factory: (ctx: ContextMenuItemContext<TData, TArgs>) => ContextMenuItemEntry
): ContextMenuItemFactory<TData, TArgs> {
  return {
    id,
    create: factory,
  };
}
