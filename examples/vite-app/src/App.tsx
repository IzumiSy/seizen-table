import {
  useDataTable,
  DataTable,
  type ColumnDef,
} from "@izumisy/seizen-datatable-react";
import { RowDetailPlugin } from "./plugins/RowDetailPlugin";
import {
  FileExportPlugin,
  CsvExporter,
  JsonlExporter,
} from "./plugins/FileExportPlugin";

type Person = {
  id: number;
  name: string;
  age: number;
  email: string;
  department: string;
  joinedAt: string;
};

const columns: ColumnDef<Person>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "department", header: "Department" },
];

const data: Person[] = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    department: "Engineering",
    joinedAt: "2022-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    email: "jane@example.com",
    department: "Design",
    joinedAt: "2023-03-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 35,
    email: "bob@example.com",
    department: "Marketing",
    joinedAt: "2021-08-10",
  },
  {
    id: 4,
    name: "Alice Williams",
    age: 28,
    email: "alice@example.com",
    department: "Engineering",
    joinedAt: "2022-11-05",
  },
  {
    id: 5,
    name: "Charlie Brown",
    age: 42,
    email: "charlie@example.com",
    department: "Sales",
    joinedAt: "2020-04-22",
  },
];

function App() {
  const table = useDataTable({
    data,
    columns,
    plugins: [
      RowDetailPlugin.configure({
        width: 450,
      }),
      FileExportPlugin.configure({
        width: 450,
        filename: "users",
        includeHeaders: true,
        exporters: [CsvExporter, JsonlExporter],
      }),
    ],
    onRowClick: (row) => {
      table.plugin.open("row-detail", { row });
    },
  });

  return (
    <div className="p-5">
      <DataTable table={table} />
    </div>
  );
}

export default App;
