import type { DataTableInstance } from "./useDataTable";
import {
  DataTableRoot,
  DataTableContent,
  DataTableTable,
  DataTableHeader as DataTableHeaderComponent,
  DataTableBody,
  DataTableRow as DataTableRowComponent,
  DataTableCell as DataTableCellComponent,
} from "./components";
import { Paginator } from "./components/Paginator";
import { DataTablePlugins } from "../plugin/DataTablePlugins";

export interface PaginateOptions {
  /**
   * Whether to enable pagination
   * @default true
   */
  enable?: boolean;

  /**
   * Page size options to display in the paginator dropdown
   * @default [10, 20, 50, 100]
   */
  sizeOptions?: number[];
}

export interface DataTableProps<TData> {
  /**
   * The table instance from useDataTable
   */
  table: DataTableInstance<TData>;

  /**
   * Additional CSS class name for the table container
   */
  className?: string;

  /**
   * Pagination options
   */
  paginate?: PaginateOptions;
}

/**
 * DataTable component with default UI rendering (High-Level API)
 * Uses semantic HTML table elements with CSS Variables for theming
 *
 * This is the highest-level abstraction. For more control, use compound components:
 * - DataTable.Root
 * - DataTable.Table
 * - DataTable.Header
 * - DataTable.Body
 * - DataTable.Row
 * - DataTable.Cell
 * - DataTable.Paginator
 *
 * For plugin UI slots, use DataTablePlugins:
 * - DataTablePlugins.SidePanel
 * - DataTablePlugins.Header
 * - DataTablePlugins.Footer
 * - DataTablePlugins.InlineRow
 * - DataTablePlugins.CellSlot
 *
 * @example High-level usage (all-in-one)
 * ```tsx
 * <DataTable table={table} paginate={{ enable: true }} />
 * ```
 *
 * @example Mid-level usage (compound components with plugins)
 * ```tsx
 * <DataTable.Root table={table}>
 *   <DataTablePlugins.SidePanel position="left" />
 *   <DataTablePlugins.Header />
 *   <DataTable.Table>
 *     <DataTable.Header />
 *     <DataTable.Body />
 *   </DataTable.Table>
 *   <DataTablePlugins.Footer />
 *   <DataTable.Paginator />
 *   <DataTablePlugins.SidePanel position="right" />
 * </DataTable.Root>
 * ```
 */
export function DataTable<TData>({
  table,
  className,
  paginate,
}: DataTableProps<TData>) {
  const paginateEnabled = paginate?.enable ?? true;
  const paginateSizeOptions = paginate?.sizeOptions ?? [10, 20, 50, 100];

  return (
    <DataTableRoot table={table} className={className}>
      <DataTablePlugins.SidePanel position="left" />
      <DataTableContent>
        <DataTablePlugins.Header />
        <DataTableTable>
          <DataTableHeaderComponent />
          <DataTableBody />
        </DataTableTable>
        <DataTablePlugins.Footer />
        {paginateEnabled && (
          <Paginator table={table} sizeOptions={paginateSizeOptions} />
        )}
      </DataTableContent>
      <DataTablePlugins.SidePanel position="right" />
    </DataTableRoot>
  );
}

// =============================================================================
// Compound Component Namespace
// =============================================================================

/**
 * Compound components for building custom DataTable layouts
 */
DataTable.Root = DataTableRoot;
DataTable.Content = DataTableContent;
DataTable.Table = DataTableTable;
DataTable.Header = DataTableHeaderComponent;
DataTable.Body = DataTableBody;
DataTable.Row = DataTableRowComponent;
DataTable.Cell = DataTableCellComponent;
DataTable.Paginator = Paginator;
