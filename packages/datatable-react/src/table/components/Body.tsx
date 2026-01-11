import { Fragment, type ReactNode } from "react";
import type { Row } from "@tanstack/react-table";
import { useDataTableContext } from "./Root";
import { DataTableRow } from "./Row";
import { InlineRow } from "../../plugin/DataTablePlugins";

export interface DataTableBodyProps<TData = unknown> {
  /**
   * Custom row renderer function (render props pattern).
   * If not provided, uses default DataTable.Row rendering with InlineRow support.
   *
   * @param row - The TanStack Table Row object
   * @returns ReactNode to render for this row
   */
  children?: (row: Row<TData>) => ReactNode;
}

/**
 * Default table body component.
 *
 * Renders all rows using DataTable.Row component by default.
 * You can provide a render function as children for full control.
 *
 * @example Default usage (includes InlineRow automatically)
 * ```tsx
 * <tbody>
 *   <DataTable.Body />
 * </tbody>
 * ```
 *
 * @example Custom row rendering with render props
 * ```tsx
 * <tbody>
 *   <DataTable.Body>
 *     {(row) => (
 *       <>
 *         <DataTable.Row key={row.id} row={row} className="custom" />
 *         <DataTablePlugins.InlineRow row={row} colSpan={row.getVisibleCells().length} />
 *       </>
 *     )}
 *   </DataTable.Body>
 * </tbody>
 * ```
 *
 * @example Without InlineRow (opt-out)
 * ```tsx
 * <tbody>
 *   <DataTable.Body>
 *     {(row) => <DataTable.Row key={row.id} row={row} />}
 *   </DataTable.Body>
 * </tbody>
 * ```
 */
export function DataTableBody<TData>({ children }: DataTableBodyProps<TData>) {
  const tableFromContext = useDataTableContext<TData>();
  const table = tableFromContext;
  const tanstack = table._tanstackTable;
  const rows = tanstack.getRowModel().rows;

  // Custom rendering via render props
  if (children) {
    return (
      <>
        {rows.map((row) => (
          <Fragment key={row.id}>{children(row)}</Fragment>
        ))}
      </>
    );
  }

  // Default rendering with InlineRow support
  return (
    <>
      {rows.map((row) => (
        <Fragment key={row.id}>
          <DataTableRow row={row} />
          <InlineRow row={row} colSpan={row.getVisibleCells().length} />
        </Fragment>
      ))}
    </>
  );
}
