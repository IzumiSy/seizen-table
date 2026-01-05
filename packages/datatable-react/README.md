# @izumisy/seizen-datatable-react

A rich, enterprise-grade DataTable component for React, powered by [TanStack Table](https://tanstack.com/table).

## Features

- 🎨 **CSS Variables theming** - Customize appearance by simply defining CSS variables
- 🔧 **TypeScript** - Full type safety out of the box
- 🔌 **Data Adapters** - Connect to Supabase, Firestore, Hasura, and more with zero boilerplate
- 🧩 **Plugin System** - Add search panels, side panels, column customization with a single line
- 📄 **Pagination built-in** - Both offset-based and cursor-based pagination supported

## Installation

```bash
npm install @izumisy/seizen-datatable-react
# or
pnpm add @izumisy/seizen-datatable-react
```

## Quick Start

```tsx
import { useDataTable, DataTable, type ColumnDef } from "@izumisy/seizen-datatable-react";

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
  const table = useDataTable({ data, columns });

  return <DataTable table={table} />;
}
```

`useDataTable` and `DataTable` are always used together. This pattern provides:

- **Full control** - Access table state and methods from the hook
- **Flexibility** - Trigger actions from outside the table component
- **Composability** - Share table instance across multiple components

```tsx
function UsersPage() {
  const table = useDataTable({
    data: users,
    columns,
    plugins: [
      RowDetail.configure({ render: (row) => <UserDetail user={row} /> }),
    ],
  });

  // Access selected rows from the hook
  const handleBulkDelete = () => {
    const selectedRows = table.getSelectedRows();
    deleteUsers(selectedRows);
    table.clearSelection();
  };

  // Access filter state
  const handleExport = () => {
    const currentFilter = table.getFilterState();
    exportWithFilter(currentFilter);
  };

  return (
    <div>
      <div className="toolbar">
        <button onClick={handleBulkDelete}>Delete Selected</button>
        <button onClick={handleExport}>Export</button>
        <span>{table.getSelectedRows().length} selected</span>
      </div>
      <DataTable table={table} />
    </div>
  );
}
```

## Theming with CSS Variables

Customize the appearance by defining CSS variables. All variables have sensible defaults.

```css
:root {
  /* Colors */
  --szui-color-text: #1f2937;
  --szui-color-bg: #ffffff;
  --szui-header-bg: #f9fafb;
  --szui-header-color: #6b7280;
  --szui-border-color: #e5e7eb;
  --szui-row-hover-bg: #f3f4f6;
  --szui-row-selected-bg: #eff6ff;

  /* Typography */
  --szui-font-family: system-ui, -apple-system, sans-serif;
  --szui-font-size: 14px;
  --szui-line-height: 1.5;
  --szui-header-font-size: 12px;
  --szui-header-font-weight: 600;

  /* Spacing */
  --szui-cell-padding-x: 12px;
  --szui-cell-padding-y: 10px;

  /* Border */
  --szui-border-width: 1px;
  --szui-border-radius: 8px;
}
```

### Dark Mode Example

```css
@media (prefers-color-scheme: dark) {
  :root {
    --szui-color-text: #f9fafb;
    --szui-color-bg: #111827;
    --szui-header-bg: #1f2937;
    --szui-header-color: #9ca3af;
    --szui-border-color: #374151;
    --szui-row-hover-bg: #374151;
    --szui-row-selected-bg: #1e3a5f;
  }
}
```

## Custom Table Rendering

For full control over table rendering, use `table.render()` or access the TanStack Table instance directly:

```tsx
import { useDataTable, flexRender, type ColumnDef } from "@izumisy/seizen-datatable-react";

function CustomTable<TData>({ data, columns }: { data: TData[]; columns: ColumnDef<TData>[] }) {
  const table = useDataTable({ data, columns });
  const tanstack = table._tanstackTable;

  return (
    <table>
      <thead>
        {tanstack.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {tanstack.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Data Adapters

Connect your DataTable to any backend with minimal setup. Sorting, filtering, and pagination are handled automatically by the adapter.

```tsx
import { useDataTable, DataTable } from "@izumisy/seizen-datatable-react";
import { SupabaseAdapter } from "@izumisy/seizen-datatable-adapter-supabase";

const adapter = SupabaseAdapter.configure({
  client: supabase,
  table: "users",
});

function UsersTable() {
  const table = useDataTable({
    columns,
    adapter,
  });

  return <DataTable table={table} />;
}
```

**Planned Adapters:**
- Supabase Database
- Supabase pg_graphql
- Hasura GraphQL
- Firebase Firestore

## Plugins

Enhance your DataTable with pre-built UI components. Add powerful features without writing complex code.

```tsx
import { useDataTable, DataTable } from "@izumisy/seizen-datatable-react";
import { RowDetail } from "@izumisy/seizen-datatable-plugin-row-detail";
import { FilterBuilder } from "@izumisy/seizen-datatable-plugin-filter";

function UsersTable() {
  const table = useDataTable({
    data,
    columns,
    plugins: [
      RowDetail.configure({ render: (row) => <UserDetail user={row} /> }),
      FilterBuilder.configure({ filterableColumns: ["name", "email"] }),
    ],
  });

  return <DataTable table={table} />;
}
```

**Planned Plugins:**
- **RowDetail** - Row details in a sidepanel
- **FilterBuilder** - Advanced filtering UI
- **ColumnCustomizer** - Show/hide and reorder columns

## License

MIT

---

## Learn More

- [Architecture & Design](./DESIGN.md)
- [Data Adapters](./docs/data-adapter.md)
- [Plugin System](./docs/plugin.md)
