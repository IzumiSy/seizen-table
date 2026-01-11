import { Fragment } from "react";
import { useDataTableContext } from "./Root";
import { DataTableRow } from "./Row";

/**
 * Default table body component.
 *
 * Renders all rows using DataTable.Row component by default.
 * You can provide a custom renderRow function for full control.
 *
 * @example Default usage
 * ```tsx
 * <tbody>
 *   <DataTable.Body />
 * </tbody>
 * ```
 *
 * @example Custom row rendering
 * ```tsx
 * <tbody>
 *   <DataTable.Body
 *     renderRow={(row) => (
 *       <DataTable.Row key={row.id} row={row} className="custom" />
 *     )}
 *   />
 * </tbody>
 * ```
 */
export function DataTableBody() {
  const tableFromContext = useDataTableContext();
  const table = tableFromContext;
  const tanstack = table._tanstackTable;
  const rows = tanstack.getRowModel().rows;

  return (
    <>
      {rows.map((row) => (
        <Fragment key={row.id}>
          <DataTableRow row={row} />
        </Fragment>
      ))}
    </>
  );
}
