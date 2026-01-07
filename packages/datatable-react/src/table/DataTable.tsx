import { Fragment, useCallback } from "react";
import {
  flexRender,
  type Cell,
  type Column,
  type Row,
} from "@tanstack/react-table";
import type { DataTableInstance } from "./useDataTable";
import {
  SidepanelSlotRenderer,
  HeaderSlotRenderer,
  FooterSlotRenderer,
  CellSlotRenderer,
  InlineRowSlotRenderer,
} from "../plugin/SlotRenderer";
import { PluginContextProvider } from "../plugin/Context";
import {
  ContextMenuProvider,
  useContextMenu,
} from "../plugin/ContextMenuRenderer";
import { Paginator } from "./Paginator";
import * as styles from "./styles.css";

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
 * DataTable component with default UI rendering
 * Uses semantic HTML table elements with CSS Variables for theming
 */
export function DataTable<TData>({
  table,
  className,
  paginate,
}: DataTableProps<TData>) {
  const tanstack = table._tanstackTable;
  const paginateEnabled = paginate?.enable ?? true;
  const paginateSizeOptions = paginate?.sizeOptions ?? [10, 20, 50, 100];

  const containerClassName = className
    ? `${styles.container} ${className}`
    : styles.container;

  return (
    <PluginContextProvider table={table}>
      <ContextMenuProvider
        table={tanstack}
        plugins={table.plugins}
        selectedRows={table.getSelectedRows()}
        emit={table.eventBus.emit}
      >
        <DataTableInner
          table={table}
          containerClassName={containerClassName}
          paginateEnabled={paginateEnabled}
          paginateSizeOptions={paginateSizeOptions}
        />
      </ContextMenuProvider>
    </PluginContextProvider>
  );
}

interface DataTableInnerProps<TData> {
  table: DataTableInstance<TData>;
  containerClassName: string;
  paginateEnabled: boolean;
  paginateSizeOptions: number[];
}

function DataTableInner<TData>({
  table,
  containerClassName,
  paginateEnabled,
  paginateSizeOptions,
}: DataTableInnerProps<TData>) {
  const tanstack = table._tanstackTable;
  const { openCellMenu, openColumnMenu } = useContextMenu<TData>();

  const handleCellContextMenu = useCallback(
    (
      e: React.MouseEvent<HTMLTableCellElement>,
      cell: Cell<TData, unknown>,
      column: Column<TData, unknown>,
      row: Row<TData>
    ) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      openCellMenu(cell, column, row, rect);
    },
    [openCellMenu]
  );

  const handleColumnContextMenu = useCallback(
    (
      e: React.MouseEvent<HTMLTableCellElement>,
      column: Column<TData, unknown>
    ) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      openColumnMenu(column, rect);
    },
    [openColumnMenu]
  );

  return (
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
                  <th
                    key={header.id}
                    className={styles.th}
                    onContextMenu={(e) =>
                      handleColumnContextMenu(e, header.column)
                    }
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
                    <td
                      key={cell.id}
                      className={styles.td}
                      onContextMenu={(e) =>
                        handleCellContextMenu(e, cell, cell.column, row)
                      }
                    >
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
        {/* Paginator - below footer slot */}
        {paginateEnabled && (
          <Paginator table={table} sizeOptions={paginateSizeOptions} />
        )}
      </div>

      {/* Right Sidepanel */}
      <SidepanelSlotRenderer position="right-sider" />
    </div>
  );
}
