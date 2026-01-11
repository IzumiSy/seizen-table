import { flexRender } from "@tanstack/react-table";
import { useDataTableContext } from "./Root";
import { useContextMenu } from "../useContextMenu";
import { HeaderSlotRenderer } from "../../plugin/SlotRenderer";
import * as styles from "../styles.css";

export interface DataTableHeaderProps {
  // No props needed - uses context
}

/**
 * Default table header component.
 *
 * Renders:
 * - Column headers with sorting support
 * - Context menu on right-click
 * - Header slot (for plugin content between header and body)
 *
 * @example
 * ```tsx
 * <thead>
 *   <DataTable.Header />
 * </thead>
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
  const { handleColumnContextMenu } = useContextMenu();

  return (
    <>
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
      {/* Header Slot - between thead rows and tbody */}
      <tr>
        <th
          colSpan={tanstack.getAllColumns().length}
          style={{ padding: 0, border: "none" }}
        >
          <HeaderSlotRenderer />
        </th>
      </tr>
    </>
  );
}
