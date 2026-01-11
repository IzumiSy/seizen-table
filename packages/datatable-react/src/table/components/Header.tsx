import { flexRender } from "@tanstack/react-table";
import { useDataTableContext } from "./Root";
import { useContextMenuHandlers } from "../../plugin/contextMenu";
import * as styles from "../styles.css";

/**
 * Default table header component.
 *
 * Renders:
 * - Column headers with sorting support
 * - Context menu on right-click
 *
 * @example
 * ```tsx
 * <DataTable.Header />
 * ```
 *
 * For full control, you can render headers manually:
 * ```tsx
 * <thead>
 *   {table._tanstackTable.getHeaderGroups().map(group => (
 *     <tr key={group.id}>
 *       {group.headers.map(header => (
 *         <th key={header.id}>
 *           {flexRender(header.column.columnDef.header, header.getContext())}
 *         </th>
 *       ))}
 *     </tr>
 *   ))}
 * </thead>
 * ```
 */
export function DataTableHeader() {
  const table = useDataTableContext();
  const tanstack = table._tanstackTable;
  const { handleColumnContextMenu } = useContextMenuHandlers();

  return (
    <thead>
      {tanstack.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className={styles.th}
              onContextMenu={(e) => handleColumnContextMenu(e, header.column)}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
