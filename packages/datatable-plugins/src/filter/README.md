# FilterPlugin

Provides a side panel for adding column filters with type-aware operators.

## Import

```tsx
import { FilterPlugin } from "@izumisy/seizen-datatable-plugins/filter";
```

## Usage

```tsx
const table = useDataTable({
  data,
  columns,
  plugins: [FilterPlugin.configure({ width: 320 })],
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | `number` | `320` | Width of the side panel |
| `disableGlobalSearch` | `boolean` | `false` | Disable global search in header slot |

## Supported Filter Types

Define filter types in column meta:

```tsx
const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: { filterType: "string" },
  },
  {
    accessorKey: "age",
    header: "Age",
    meta: { filterType: "number" },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filterType: "enum",
      filterEnumValues: ["active", "inactive", "pending"],
    },
  },
];
```

| Type | Operators |
|------|-----------|
| `string` | Contains, Equals, Starts with, Ends with, Is empty, Is not empty |
| `number` | =, ≠, >, ≥, <, ≤ |
| `date` | =, Before, After |
| `enum` | Is, Is not |
