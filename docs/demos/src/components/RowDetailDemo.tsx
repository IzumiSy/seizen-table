import {
  useDataTable,
  DataTable,
  useDataTableEvent,
} from "@izumisy/seizen-datatable-react";
import { RowDetailPlugin } from "@izumisy/seizen-datatable-plugins/row-detail";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "department", header: "Department" },
];

const data = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
    phone: "555-0101",
    location: "New York",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    department: "Design",
    phone: "555-0102",
    location: "San Francisco",
  },
  {
    name: "Carol White",
    email: "carol@example.com",
    department: "Engineering",
    phone: "555-0103",
    location: "Chicago",
  },
];

export function RowDetailDemo() {
  const table = useDataTable({
    data,
    columns,
    plugins: [RowDetailPlugin.configure({ width: 320 })],
  });

  useDataTableEvent(table, "row-click", (row) => {
    table.plugin.open("row-detail", { row });
  });

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <DataTable table={table} />
    </div>
  );
}
