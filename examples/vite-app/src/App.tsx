import { DataTable, type ColumnDef } from "@izumisy/seizen-datatable-react";

type Person = {
  name: string;
  age: number;
  email: string;
};

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "email", header: "Email" },
];

const data: Person[] = [
  { name: "John Doe", age: 30, email: "john@example.com" },
  { name: "Jane Smith", age: 25, email: "jane@example.com" },
];

function App() {
  return (
    <div className="p-5">
      <DataTable data={data} columns={columns} />
    </div>
  );
}

export default App;
