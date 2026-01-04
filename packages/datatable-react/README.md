# @izumisy/seizen-datatable-react

A rich, enterprise-grade DataTable component for React, powered by [TanStack Table](https://tanstack.com/table).

## Features

- 🎨 **CSS Variables theming** - Customize appearance by simply defining CSS variables
- 🔧 **TypeScript** - Full type safety out of the box
- ⚡ **Lightweight** - Built with vanilla-extract for zero-runtime CSS-in-JS

## Installation

```bash
npm install @izumisy/seizen-datatable-react
# or
pnpm add @izumisy/seizen-datatable-react
```

## Quick Start

```tsx
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
  return <DataTable data={data} columns={columns} />;
}
```

## Theming with CSS Variables

Customize the appearance by defining CSS variables. All variables have sensible defaults.

```css
:root {
  /* Colors */
  --sdt-color-text: #1f2937;
  --sdt-color-bg: #ffffff;
  --sdt-header-bg: #f9fafb;
  --sdt-header-color: #6b7280;
  --sdt-border-color: #e5e7eb;
  --sdt-row-hover-bg: #f3f4f6;
  --sdt-row-selected-bg: #eff6ff;

  /* Typography */
  --sdt-font-family: system-ui, -apple-system, sans-serif;
  --sdt-font-size: 14px;
  --sdt-line-height: 1.5;
  --sdt-header-font-size: 12px;
  --sdt-header-font-weight: 600;

  /* Spacing */
  --sdt-cell-padding-x: 12px;
  --sdt-cell-padding-y: 10px;

  /* Border */
  --sdt-border-width: 1px;
  --sdt-border-radius: 8px;
}
```

### Dark Mode Example

```css
@media (prefers-color-scheme: dark) {
  :root {
    --sdt-color-text: #f9fafb;
    --sdt-color-bg: #111827;
    --sdt-header-bg: #1f2937;
    --sdt-header-color: #9ca3af;
    --sdt-border-color: #374151;
    --sdt-row-hover-bg: #374151;
    --sdt-row-selected-bg: #1e3a5f;
  }
}
```

## Headless Usage

For full control over rendering, use the `useDataTable` hook:

```tsx
import { useDataTable, flexRender, type ColumnDef } from "@izumisy/seizen-datatable-react";

function CustomTable<TData>({ data, columns }: { data: TData[]; columns: ColumnDef<TData>[] }) {
  const table = useDataTable({ data, columns });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
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
        {table.getRowModel().rows.map((row) => (
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

## License

MIT
