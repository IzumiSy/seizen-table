import { Fragment, type ReactNode } from "react";
import type { Row } from "@tanstack/react-table";
import { useSeizenTableContext } from "./Root";
import { TableRow } from "./Row";
import { InlineRow } from "../../plugin/SeizenTablePlugins";

export interface TableBodyProps<TData = unknown> {
  /**
   * Custom row renderer function (render props pattern).
   * If not provided, uses default SeizenTable.Row rendering with InlineRow support.
   *
   * @param row - The TanStack Table Row object
   * @returns ReactNode to render for this row
   */
  children?: (row: Row<TData>) => ReactNode;
}

/**
 * Default table body component.
 *
 * Renders all rows using SeizenTable.Row component by default.
 * You can provide a render function as children for full control.
 *
 * @example Default usage (includes InlineRow automatically)
 * ```tsx
 * <Table.Body />
 * ```
 *
 * @example Custom row rendering with render props
 * ```tsx
 * <Table.Body>
 *   {(row) => (
 *     <>
 *       <SeizenTable.Row key={row.id} row={row} className="custom" />
 *       <SeizenTablePlugins.InlineRow row={row} colSpan={row.getVisibleCells().length} />
 *     </>
 *   )}
 * </Table.Body>
 * ```
 *
 * @example Without InlineRow (opt-out)
 * ```tsx
 * <Table.Body>
 *   {(row) => <SeizenTable.Row key={row.id} row={row} />}
 * </Table.Body>
 * ```
 */
export function TableBody<TData>({ children }: TableBodyProps<TData>) {
  const tableFromContext = useSeizenTableContext<TData>();
  const table = tableFromContext;
  const tanstack = table._tanstackTable;
  const rows = tanstack.getRowModel().rows;

  // Custom rendering via render props
  if (children) {
    return (
      <tbody>
        {rows.map((row) => (
          <Fragment key={row.id}>{children(row)}</Fragment>
        ))}
      </tbody>
    );
  }

  // Default rendering with InlineRow support
  return (
    <tbody>
      {rows.map((row) => (
        <Fragment key={row.id}>
          <TableRow row={row} />
          <InlineRow row={row} colSpan={row.getVisibleCells().length} />
        </Fragment>
      ))}
    </tbody>
  );
}
