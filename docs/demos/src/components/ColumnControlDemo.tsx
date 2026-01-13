import { useDataTable, DataTable } from "@izumisy/seizen-table";
import { ColumnControlPlugin } from "@izumisy/seizen-table-plugins/column-control";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "role", header: "Role" },
];

const data = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
    role: "Developer",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    department: "Design",
    role: "Designer",
  },
  {
    name: "Carol White",
    email: "carol@example.com",
    department: "Engineering",
    role: "Manager",
  },
  {
    name: "David Brown",
    email: "david@example.com",
    department: "Marketing",
    role: "Analyst",
  },
];

export function ColumnControlDemo() {
  const table = useDataTable({
    data,
    columns,
    plugins: [ColumnControlPlugin.configure({ width: 280 })],
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
