import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

export interface UseDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
}

/**
 * Hook for creating a headless data table instance
 * Returns a TanStack Table instance for full control over rendering
 */
export function useDataTable<TData>({
  data,
  columns,
}: UseDataTableOptions<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return table;
}
