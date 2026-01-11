import type { ReactNode } from "react";
import type { Cell, Column, Row } from "@tanstack/react-table";
import {
  SidePanelSlotRenderer,
  HeaderSlotRenderer,
  FooterSlotRenderer,
  InlineRowSlotRenderer as InlineRowSlotRendererInternal,
  CellSlotRenderer as CellSlotRendererInternal,
} from "./SlotRenderer";

// =============================================================================
// SidePanel
// =============================================================================

export interface SidePanelProps {
  /**
   * Position of the side panel
   */
  position: "left" | "right";
}

/**
 * Renders plugin side panels for the specified position.
 *
 * Place this component outside of DataTable.Content to position
 * side panels to the left or right of the main table content.
 *
 * @example
 * ```tsx
 * <DataTable.Root table={table}>
 *   <DataTablePlugins.SidePanel position="left" />
 *   <DataTable.Content>
 *     <DataTable.Table>...</DataTable.Table>
 *   </DataTable.Content>
 *   <DataTablePlugins.SidePanel position="right" />
 * </DataTable.Root>
 * ```
 */
export function SidePanel({ position }: SidePanelProps) {
  const internalPosition = position === "left" ? "left-sider" : "right-sider";
  return <SidePanelSlotRenderer position={internalPosition} />;
}

// =============================================================================
// Header
// =============================================================================

/**
 * Renders all plugin header slots.
 *
 * Place this component above the table to render plugin-provided
 * header content (e.g., filter bars, toolbars).
 *
 * @example
 * ```tsx
 * <DataTable.Content>
 *   <DataTablePlugins.Header />
 *   <DataTable.Table>...</DataTable.Table>
 * </DataTable.Content>
 * ```
 */
export function Header() {
  return <HeaderSlotRenderer />;
}

// =============================================================================
// Footer
// =============================================================================

/**
 * Renders all plugin footer slots.
 *
 * Place this component below the table to render plugin-provided
 * footer content.
 *
 * @example
 * ```tsx
 * <DataTable.Content>
 *   <DataTable.Table>...</DataTable.Table>
 *   <DataTablePlugins.Footer />
 *   <DataTable.Paginator />
 * </DataTable.Content>
 * ```
 */
export function Footer() {
  return <FooterSlotRenderer />;
}

// =============================================================================
// InlineRow
// =============================================================================

export interface InlineRowProps<TData> {
  /**
   * The TanStack Table Row object
   */
  row: Row<TData>;

  /**
   * Number of columns for colspan (typically row.getVisibleCells().length)
   */
  colSpan: number;
}

/**
 * Renders inline row content for a specific row when a plugin is active.
 *
 * Use this component after DataTable.Row to render expandable content
 * provided by plugins (e.g., row details panel).
 *
 * @example
 * ```tsx
 * <DataTable.Body>
 *   {(row) => (
 *     <>
 *       <DataTable.Row row={row} />
 *       <DataTablePlugins.InlineRow row={row} colSpan={row.getVisibleCells().length} />
 *     </>
 *   )}
 * </DataTable.Body>
 * ```
 */
export function InlineRow<TData>({ row, colSpan }: InlineRowProps<TData>) {
  return <InlineRowSlotRendererInternal row={row} colSpan={colSpan} />;
}

// =============================================================================
// CellSlot
// =============================================================================

export interface CellSlotProps<TData> {
  /**
   * The TanStack Table Cell object
   */
  cell: Cell<TData, unknown>;

  /**
   * The TanStack Table Column object
   */
  column: Column<TData, unknown>;

  /**
   * The TanStack Table Row object
   */
  row: Row<TData>;

  /**
   * Default content to render if no plugin handles the cell
   */
  children: ReactNode;
}

/**
 * Renders cell content using plugin cell slots, or falls back to children.
 *
 * Use this component to wrap cell content when you want plugins to be able
 * to customize cell rendering.
 *
 * @example
 * ```tsx
 * <DataTable.Cell cell={cell} row={row}>
 *   <DataTablePlugins.CellSlot cell={cell} column={cell.column} row={row}>
 *     {flexRender(cell.column.columnDef.cell, cell.getContext())}
 *   </DataTablePlugins.CellSlot>
 * </DataTable.Cell>
 * ```
 */
export function CellSlot<TData>({
  cell,
  column,
  row,
  children,
}: CellSlotProps<TData>) {
  return (
    <CellSlotRendererInternal cell={cell} column={column} row={row}>
      {children}
    </CellSlotRendererInternal>
  );
}

// =============================================================================
// Namespace Export
// =============================================================================

/**
 * DataTablePlugins - Compound components for plugin-provided UI slots.
 *
 * These components render content provided by DataTable plugins.
 * Use them to compose custom layouts with plugin integration.
 *
 * @example Full custom layout
 * ```tsx
 * <DataTable.Root table={table}>
 *   <DataTablePlugins.SidePanel position="left" />
 *   <DataTablePlugins.Header />
 *   <DataTable.Table>
 *     <thead><DataTable.Header /></thead>
 *     <tbody>
 *       <DataTable.Body>
 *         {(row) => (
 *           <>
 *             <DataTable.Row row={row} />
 *             <DataTablePlugins.InlineRow row={row} colSpan={row.getVisibleCells().length} />
 *           </>
 *         )}
 *       </DataTable.Body>
 *     </tbody>
 *   </DataTable.Table>
 *   <DataTablePlugins.Footer />
 *   <DataTable.Paginator />
 *   <DataTablePlugins.SidePanel position="right" />
 * </DataTable.Root>
 * ```
 */
export const DataTablePlugins = {
  SidePanel,
  Header,
  Footer,
  InlineRow,
  CellSlot,
} as const;
