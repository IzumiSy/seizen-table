# RowDetailPlugin

Displays detailed information about a clicked row in a side panel.

## Import

```tsx
import { RowDetailPlugin } from "@izumisy/seizen-table-plugins/row-detail";
```

## Usage

```tsx
const table = useSeizenTable({
  data,
  columns,
  plugins: [RowDetailPlugin.configure({ width: 350 })],
});

// Open side panel when row is clicked
useSeizenTableEvent(table, "row-click", (row) => {
  table.plugin.open("row-detail", { row });
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | `number` | `320` | Width of the side panel |

## Features

- Displays all fields of the selected row
- Automatically updates when clicking different rows while panel is open
- Formats object values as JSON
