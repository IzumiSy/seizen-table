export { SeizenTable } from "./SeizenTable";
export { Paginator } from "./components/Paginator";
export { useSeizenTable } from "./useSeizenTable";
export { useSeizenTableEvent } from "./useSeizenTableEvent";
export { useSeizenTableContext } from "./components/Root";
export type { SeizenTableProps, PaginateOptions } from "./SeizenTable";
export type { PaginatorProps } from "./components/Paginator";

// Compound component types
export type {
  TableRootProps,
  TableRowProps,
  TableCellProps,
} from "./components";

// Hooks - re-export from plugin for convenience
export { useContextMenuHandlers } from "../plugin/contextMenu";

// Types
export type {
  SeizenTableColumn,
  SeizenTableInstance,
  UseSeizenTableOptions,
  RemoteOptions,
} from "./useSeizenTable";

// Re-export PluginArgsRegistry for module augmentation
// This ensures that module augmentation on "@izumisy/seizen-table/plugin"
// also affects types imported from "@izumisy/seizen-table"
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
