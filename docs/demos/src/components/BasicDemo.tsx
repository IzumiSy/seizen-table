import { useDataTable, DataTable } from "@izumisy/seizen-table";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "email", header: "Email" },
];

const data = [
  { name: "John Doe", age: 30, email: "john@example.com" },
  { name: "Jane Smith", age: 25, email: "jane@example.com" },
  { name: "Bob Wilson", age: 35, email: "bob@example.com" },
];

export function BasicDemo() {
  const table = useDataTable({ data, columns });

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
