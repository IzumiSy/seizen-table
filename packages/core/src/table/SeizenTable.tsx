import type { SeizenTableInstance } from "./useSeizenTable";
import {
  TableRoot,
  TableContent,
  TableTable,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "./components";
import { Paginator } from "./components/Paginator";
import { SeizenTablePlugins } from "../plugin/SeizenTablePlugins";

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

export interface SeizenTableProps<TData> {
  /**
   * The table instance from useSeizenTable
   */
  table: SeizenTableInstance<TData>;

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
 * SeizenTable component with default UI rendering (High-Level API)
 * Uses semantic HTML table elements with CSS Variables for theming
 *
 * This is the highest-level abstraction. For more control, use compound components:
 * - SeizenTable.Root
 * - SeizenTable.Table
 * - SeizenTable.Header
 * - SeizenTable.Body
 * - SeizenTable.Row
 * - SeizenTable.Cell
 * - SeizenTable.Paginator
 *
 * For plugin UI slots, use SeizenTablePlugins:
 * - SeizenTablePlugins.SidePanel
 * - SeizenTablePlugins.Header
 * - SeizenTablePlugins.Footer
 * - SeizenTablePlugins.InlineRow
 * - SeizenTablePlugins.Cell
 *
 * @example High-level usage (all-in-one)
 * ```tsx
 * <SeizenTable table={table} paginate={{ enable: true }} />
 * ```
 *
 * @example Mid-level usage (compound components with plugins)
 * ```tsx
 * <SeizenTable.Root table={table}>
 *   <SeizenTablePlugins.SidePanel position="left" />
 *   <SeizenTablePlugins.Header />
 *   <SeizenTable.Table>
 *     <SeizenTable.Header />
 *     <SeizenTable.Body />
 *   </SeizenTable.Table>
 *   <SeizenTablePlugins.Footer />
 *   <SeizenTable.Paginator />
 *   <SeizenTablePlugins.SidePanel position="right" />
 * </SeizenTable.Root>
 * ```
 */
export function SeizenTable<TData>({
  table,
  className,
  paginate,
}: SeizenTableProps<TData>) {
  const paginateEnabled = paginate?.enable ?? true;
  const paginateSizeOptions = paginate?.sizeOptions ?? [10, 20, 50, 100];

  return (
    <TableRoot table={table} className={className}>
      <SeizenTablePlugins.SidePanel position="left" />
      <TableContent>
        <SeizenTablePlugins.Header />
        <TableTable>
          <TableHeader />
          <TableBody />
        </TableTable>
        <SeizenTablePlugins.Footer />
        {paginateEnabled && (
          <Paginator table={table} sizeOptions={paginateSizeOptions} />
        )}
      </TableContent>
      <SeizenTablePlugins.SidePanel position="right" />
    </TableRoot>
  );
}

// =============================================================================
// Compound Component Namespace
// =============================================================================

/**
 * Compound components for building custom SeizenTable layouts
 */
SeizenTable.Root = TableRoot;
SeizenTable.Content = TableContent;
SeizenTable.Table = TableTable;
SeizenTable.Header = TableHeader;
SeizenTable.Body = TableBody;
SeizenTable.Row = TableRow;
SeizenTable.Cell = TableCell;
SeizenTable.Paginator = Paginator;
