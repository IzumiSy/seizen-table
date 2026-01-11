# AllSlotsDemo

A demonstration plugin that showcases all 5 slot types available in the plugin system.

## Import

```tsx
import { AllSlotsDemo } from "@izumisy/seizen-datatable-plugins/all-slots-demo";
```

## Usage

```tsx
const table = useDataTable({
  data,
  columns,
  plugins: [
    AllSlotsDemo.configure({
      sidePanelTitle: "Demo Panel",
      enableCellHighlight: true,
      primaryColor: "#8b5cf6",
    }),
  ],
});

// Open inline row for a specific row
table.plugin.open("all-slots-demo", { id: rowId });
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sidePanelTitle` | `string` | `"All Slots Demo"` | Title shown in side panel |
| `enableCellHighlight` | `boolean` | `true` | Highlight numeric cells |
| `primaryColor` | `string` | `"#3b82f6"` | Primary color for styling |

## Slot Demonstrations

| Slot | Description |
|------|-------------|
| `sidePanel` | Shows plugin info, stats, and row click counter |
| `header` | Displays record count and selection info |
| `footer` | Shows column names |
| `cell` | Custom numeric highlighting |
| `inlineRow` | Expandable row details below each row |
