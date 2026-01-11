export { DataTable } from "./DataTable";
export { Paginator } from "./components/Paginator";
export { useDataTable } from "./useDataTable";
export { useDataTableEvent } from "./useDataTableEvent";
export { useDataTableContext } from "./components/Root";
export type { DataTableProps, PaginateOptions } from "./DataTable";
export type { PaginatorProps } from "./components/Paginator";

// Compound component types
export type {
  DataTableRootProps,
  DataTableContentProps,
  DataTableTableProps,
  DataTableHeaderProps,
  DataTableBodyProps,
  DataTableRowProps,
  DataTableCellProps,
} from "./DataTable";

// Hooks
export { useContextMenu } from "./useContextMenu";

// Types
export type {
  DataTableColumn,
  DataTableInstance,
  UseDataTableOptions,
} from "./useDataTable";

// Event types (re-export from plugin)
export type {
  DataTableEventMap,
  DataTableEventName,
  EventBus,
} from "../plugin/useEventBus";

// Re-export PluginArgsRegistry for module augmentation
// This ensures that module augmentation on "@izumisy/seizen-datatable-react/plugin"
// also affects types imported from "@izumisy/seizen-datatable-react"
export type { PluginArgsRegistry } from "../plugin/usePluginControl";

// Re-export useful types from TanStack Table
export type {
  ColumnDef,
  Row,
  Cell,
  Header,
  HeaderGroup,
  Table,
  RowSelectionState,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
export { flexRender } from "@tanstack/react-table";
