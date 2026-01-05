import { Fragment } from "react";
import { flexRender } from "@tanstack/react-table";
import type { DataTableInstance } from "./useDataTable";
import {
  SidepanelSlotRenderer,
  HeaderSlotRenderer,
  FooterSlotRenderer,
  CellSlotRenderer,
  InlineRowSlotRenderer,
} from "../plugin/Renderer";
import { PluginContextProvider } from "../plugin/Context";
import * as styles from "./styles.css";

export interface DataTableProps<TData> {
  /**
   * The table instance from useDataTable
   */
  table: DataTableInstance<TData>;

  /**
   * Additional CSS class name for the table container
   */
  className?: string;
}

/**
 * DataTable component with default UI rendering
 * Uses semantic HTML table elements with CSS Variables for theming
 */
export function DataTable<TData>({ table, className }: DataTableProps<TData>) {
  const tanstack = table._tanstackTable;

  const containerClassName = className
    ? `${styles.container} ${className}`
    : styles.container;

  return (
    <PluginContextProvider table={table}>
      <div className={containerClassName}>
        {/* Left Sidepanel */}
        <SidepanelSlotRenderer position="left-sider" />

        {/* Main Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              {tanstack.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={styles.th}>
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
            </thead>
            <tbody>
              {tanstack.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <tr
                    className={styles.tr}
                    data-selected={row.getIsSelected() || undefined}
                    onClick={() => {
                      table.eventBus.emit("row-click", row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={styles.td}>
                        <CellSlotRenderer
                          cell={cell}
                          column={cell.column}
                          row={row}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </CellSlotRenderer>
                      </td>
                    ))}
                  </tr>
                  {/* Inline Row Slot - renders below matching row */}
                  <InlineRowSlotRenderer
                    row={row}
                    colSpan={row.getVisibleCells().length}
                  />
                </Fragment>
              ))}
            </tbody>
          </table>
          {/* Footer Slot - below the table */}
          <FooterSlotRenderer />
        </div>

        {/* Right Sidepanel */}
        <SidepanelSlotRenderer position="right-sider" />
      </div>
    </PluginContextProvider>
  );
}
