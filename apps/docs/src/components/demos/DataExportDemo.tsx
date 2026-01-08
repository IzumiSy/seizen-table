import { useDataTable, DataTable } from "@izumisy/seizen-datatable-react";
import {
  FileExportPlugin,
  CsvExporter,
  JsonlExporter,
  TsvExporter,
} from "@izumisy/seizen-datatable-plugins/file-export";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "salary", header: "Salary" },
];

const data = [
  { name: "Alice Johnson", email: "alice@example.com", salary: 85000 },
  { name: "Bob Smith", email: "bob@example.com", salary: 72000 },
  { name: "Carol White", email: "carol@example.com", salary: 95000 },
  { name: "David Brown", email: "david@example.com", salary: 68000 },
];

export function DataExportDemo() {
  const table = useDataTable({
    data,
    columns,
    plugins: [
      FileExportPlugin.configure({
        filename: "employees",
        exporters: [CsvExporter, TsvExporter, JsonlExporter],
      }),
    ],
  });

  return (
    <div
      style={{
        border: "1px solid var(--sl-color-gray-5)",
        borderRadius: "8px",
        overflow: "hidden",
        marginBlock: "1rem",
      }}
    >
      <DataTable table={table} />
    </div>
  );
}
