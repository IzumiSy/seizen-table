# ColumnControlPlugin

Provides a side panel with column visibility controls and multi-column sorting.

## Import

```tsx
import { ColumnControlPlugin } from "@izumisy/seizen-datatable-plugins/column-control";
```

## Usage

```tsx
const table = useDataTable({
  data,
  columns,
  plugins: [ColumnControlPlugin.configure({ width: 280 })],
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | `number` | `280` | Width of the side panel |

## Features

### Visibility Tab
- Toggle column visibility with checkboxes
- Search columns by name
- Drag & drop to reorder columns

### Sorter Tab
- Add/remove sorting per column
- Toggle ascending/descending direction
- Drag & drop to change sort priority
- Multi-column sorting support

## Context Menu Items

This plugin registers the following context menu items for column headers:

- **Hide column** - Hide the clicked column
- **Sort ascending** - Sort by this column (ascending)
- **Sort descending** - Sort by this column (descending)
- **Clear sort** - Remove sorting for this column
