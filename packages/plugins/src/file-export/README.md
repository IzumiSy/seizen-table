# FileExportPlugin

Provides a UI for exporting table data to various file formats.

## Import

```tsx
import {
  FileExportPlugin,
  CsvExporter,
  JsonlExporter,
  TsvExporter,
} from "@izumisy/seizen-table-plugins/file-export";
```

## Usage

```tsx
const table = useDataTable({
  data,
  columns,
  plugins: [
    FileExportPlugin.configure({
      filename: "export",
      exporters: [CsvExporter, JsonlExporter, TsvExporter],
    }),
  ],
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | `number` | `300` | Width of the side panel |
| `filename` | `string` | `"export"` | Default filename (without extension) |
| `includeHeaders` | `boolean` | `true` | Include headers in export |
| `exporters` | `Exporter[]` | `[CsvExporter]` | Available exporters |

## Built-in Exporters

| Exporter | Format | Extension |
|----------|--------|-----------|
| `CsvExporter` | Comma-separated values | `.csv` |
| `JsonlExporter` | JSON Lines | `.jsonl` |
| `TsvExporter` | Tab-separated values | `.tsv` |

## Custom Exporter

You can create custom exporters by implementing the `Exporter` interface:

```tsx
import type { Exporter } from "@izumisy/seizen-table-plugins/file-export";

const MyExporter: Exporter = {
  id: "my-format",
  name: "My Format",
  extension: "txt",
  mimeType: "text/plain",
  convert: (data, columns, options) => {
    return data.map(row => 
      columns.map(col => row[col.key]).join(" | ")
    ).join("\n");
  },
};
```
