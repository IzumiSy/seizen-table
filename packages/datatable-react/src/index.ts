export { DataTable } from "./DataTable";
export { useDataTable } from "./useDataTable";
export type { DataTableProps } from "./DataTable";
export type { DataTableColumn } from "./types";

// Re-export useful types from TanStack Table
export type {
  ColumnDef,
  Row,
  Cell,
  Header,
  HeaderGroup,
  Table,
} from "@tanstack/react-table";
export { flexRender } from "@tanstack/react-table";
