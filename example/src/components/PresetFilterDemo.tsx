import { useSeizenTable, SeizenTable } from "@izumisy/seizen-table";
import { PresetFilterPlugin } from "@izumisy/seizen-table-plugins/preset-filter";

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
      filterEnumValues: ["active", "inactive", "pending"],
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    meta: {
      filterType: "enum" as const,
      filterEnumValues: ["Engineering", "Sales", "Marketing", "HR"],
    },
  },
];

const data = [
  {
    name: "Alice Johnson",
    age: 28,
    status: "active",
    department: "Engineering",
  },
  { name: "Bob Smith", age: 34, status: "inactive", department: "Sales" },
  { name: "Carol White", age: 45, status: "active", department: "Marketing" },
  {
    name: "David Brown",
    age: 23,
    status: "pending",
    department: "Engineering",
  },
  { name: "Eve Davis", age: 31, status: "inactive", department: "HR" },
  { name: "Frank Miller", age: 52, status: "active", department: "Sales" },
  { name: "Grace Lee", age: 29, status: "active", department: "Engineering" },
  { name: "Henry Wilson", age: 38, status: "pending", department: "Marketing" },
];

export function PresetFilterDemo() {
  const table = useSeizenTable({
    data,
    columns,
    plugins: [
      PresetFilterPlugin.configure({
        presets: [
          {
            id: "active-only",
            label: "Active Only",
            filters: [
              { columnKey: "status", operator: "equals", value: "active" },
            ],
          },
          {
            id: "engineering",
            label: "Engineering",
            filters: [
              {
                columnKey: "department",
                operator: "equals",
                value: "Engineering",
              },
            ],
          },
          {
            id: "senior",
            label: "Senior (40+)",
            filters: [{ columnKey: "age", operator: "gte", value: "40" }],
          },
          {
            id: "active-engineering",
            label: "Active Engineers",
            filters: [
              { columnKey: "status", operator: "equals", value: "active" },
              {
                columnKey: "department",
                operator: "equals",
                value: "Engineering",
              },
            ],
          },
        ],
        allLabel: "All Employees",
        enableGlobalSearch: true,
        searchPlaceholder: "Search employees...",
      }),
    ],
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
