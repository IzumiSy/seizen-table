import { useSeizenTable, SeizenTable } from "@izumisy/seizen-table";
import { FilterPlugin } from "@izumisy/seizen-table-plugins/filter";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    meta: { filterType: "string" as const },
  },
  {
    accessorKey: "age",
    header: "Age",
    meta: { filterType: "number" as const },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filterType: "enum" as const,
      filterEnumValues: ["active", "inactive"],
    },
  },
];

const data = [
  { name: "Alice Johnson", age: 28, status: "active" },
  { name: "Bob Smith", age: 34, status: "inactive" },
  { name: "Carol White", age: 45, status: "active" },
  { name: "David Brown", age: 23, status: "active" },
  { name: "Eve Davis", age: 31, status: "inactive" },
];

export function FilterDemo() {
  const table = useSeizenTable({
    data,
    columns,
    plugins: [FilterPlugin.configure({ width: 320 })],
  });

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <SeizenTable table={table} />
    </div>
  );
}
