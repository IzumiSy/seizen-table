export { DataTable } from "./DataTable";
export { useDataTable } from "./useDataTable";
export { useDataTableEvent } from "./useDataTableEvent";
export type { DataTableProps } from "./DataTable";

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
