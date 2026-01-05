import {
  useDataTable,
  useDataTableEvent,
  DataTable,
  type ColumnDef,
} from "@izumisy/seizen-datatable-react";
import { RowDetailPlugin } from "./plugins/RowDetailPlugin";
import {
  FileExportPlugin,
  CsvExporter,
  JsonlExporter,
  TsvExporter,
} from "./plugins/FileExportPlugin";
import { ColumnControlPlugin } from "./plugins/ColumnControlPlugin";
import { data, type Person } from "./data";

const columns: ColumnDef<Person>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "joinedAt", header: "Joined At" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "salary", header: "Salary" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "status", header: "Status" },
];

function App() {
  const table = useDataTable({
    data,
    columns,
    plugins: [
      RowDetailPlugin.configure({
        width: 450,
      }),
      ColumnControlPlugin.configure({
        width: 400,
      }),
      FileExportPlugin.configure({
        width: 450,
        filename: "users",
        includeHeaders: true,
        exporters: [CsvExporter, JsonlExporter, TsvExporter],
      }),
    ],
  });

  useDataTableEvent(table, "row-click", (row) => {
    table.plugin.open("row-detail", { row });
  });

  return (
    <div className="p-5">
      <DataTable table={table} />
    </div>
  );
}

export default App;
