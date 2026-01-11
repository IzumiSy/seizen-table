import { Fragment } from "react";
import { useDataTableContext } from "./Root";
import { DataTableRow } from "./Row";

export interface DataTableBodyProps {
  /**
   * Custom row renderer (optional).
   * If provided, this function will be called for each row instead of using the default DataTable.Row component.
   *
   * @example
   * ```tsx
   * <DataTable.Body
   *   renderRow={(row) => (
   *     <tr key={row.id} className="custom-row">
   *       {row.getVisibleCells().map(cell => (
   *         <td key={cell.id}>{cell.getValue()}</td>
   *       ))}
   *     </tr>
   *   )}
   * />
   * ```
   */
  renderRow?: (row: any) => React.ReactNode;
}

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
export function DataTableBody({ renderRow }: DataTableBodyProps) {
  const tableFromContext = useDataTableContext();
  const table = tableFromContext;
  const tanstack = table._tanstackTable;
  const rows = tanstack.getRowModel().rows;

  if (renderRow) {
    return <>{rows.map(renderRow)}</>;
  }

  return (
    <>
      {rows.map((row: any) => (
        <Fragment key={row.id}>
          <DataTableRow row={row} />
        </Fragment>
      ))}
    </>
  );
}
