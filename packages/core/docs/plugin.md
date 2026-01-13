# Plugin System

## Motivation

Different use cases require different UI enhancements:

- Admin dashboards need bulk actions and row detail panels
- Data exploration apps need advanced filtering and search
- Analytics tools need column customization and export features

The plugin system allows these features to be added modularly.

## Layout & Slots

DataTable provides 5 slots where plugins can render UI components:

```
┌───────┬─────────────────────────────────────────────┬───────┐
│ [N]   │  ┌─────────────────────────────────────┐    │ [D]   │
│ [a]   │  │         Header Slot                 │    │ [e]   │
│ [v]   │  └─────────────────────────────────────┘    │ [t]   │
│ [i]   │  ┌─────────────────────────────────────┐    │ [a]   │
│ [g]   │  │         Table Row 1                 │    │ [i]   │
│ [a]   │  ├─────────────────────────────────────┤    │ [l]   │
│ [t]   │  │  Inline Row Slot (when opened)      │    │ [s]   │
│ [e]   │  ├─────────────────────────────────────┤    ├───────┤
│       │  │         Table Row 2                 │    │ [F]   │
│   ↑   │  │         ...                         │    │ [i]   │
│ left- │  └─────────────────────────────────────┘    │ [l]   │
│ sider │  ┌─────────────────────────────────────┐    │ [t]   │
│       │  │         Footer Slot                 │    │ [e]   │
│       │  └─────────────────────────────────────┘    │ [r]   │
│       │                                             │   ↑   │
│       │                                             │ right-│
│       │                                             │ sider │
└───────┴─────────────────────────────────────────────┴───────┘
```

### Available Slots

| Slot | Description | Rendering Strategy |
|------|-------------|-------------------|
| `sidepanel` | IDE-style vertical tab panel (left or right) | Tab-based toggle |
| `header` | Between table header row and body rows | Sequential (all plugins) |
| `footer` | Below the table | Sequential (all plugins) |
| `cell` | Custom cell renderer for all columns | First match wins |
| `inlineRow` | Expandable sub-row below a specific row | First match wins |

### Slot Rendering Strategies

- **Tab-based toggle**: Only one sidepanel can be active at a time per position
- **Sequential**: All plugins with this slot render in registration order
- **First match wins**: Only the first plugin with this slot renders

## Plugin Usage

```tsx
import { DataTable } from "@izumisy/seizen-table";
import { RowDetail } from "@izumisy/seizen-datatable-plugin-row-detail";
import { FilterBuilder } from "@izumisy/seizen-datatable-plugin-filter";

function UsersTable() {
  return (
    <DataTable
      data={data}
      columns={columns}
      plugins={[
        // These will appear as vertical tabs in the sidepanel
        RowDetail.configure({ render: (row) => <UserDetail user={row} /> }),
        FilterBuilder.configure({ filterableColumns: ["name", "email"] }),
      ]}
    />
  );
}
```

## Plugin Development Guide

This section explains how to create custom plugins for DataTable.

### Import Path

All plugin development utilities are exported from a dedicated subpath:

```tsx
import {
  definePlugin,
  contextMenuItem,
  usePluginContext,
  type PluginContext,
  type PluginContextValue,
} from "@izumisy/seizen-table-plugins";
```

### Plugin Types

There are two types of plugins:

1. **Slot Plugin** - Renders UI in one or more slots (sidepanel, header, footer, cell, inlineRow)
2. **Context Menu Only Plugin** - Only adds items to the row context menu (no slot UI)

## Creating a Slot Plugin

Use `definePlugin` with the `slots` option to create a plugin that uses one or more slots.

### Basic Structure

```tsx
import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  type PluginContext,
} from "@izumisy/seizen-table-plugins";

const MultiSlotSchema = z.object({
  primaryColor: z.string().default("#3b82f6"),
});

type MultiSlotConfig = z.infer<typeof MultiSlotSchema>;

// SidePanel renderer
function createSidePanelRenderer(context: PluginContext<MultiSlotConfig>) {
  return function SidePanelContent() {
    const { data } = usePluginContext();
    return <div>Total: {data.length} rows</div>;
  };
}

// Header renderer
function createHeaderRenderer(context: PluginContext<MultiSlotConfig>) {
  const { args } = context;
  return function HeaderContent() {
    return (
      <div style={{ borderLeft: `3px solid ${args.primaryColor}` }}>
        Header content
      </div>
    );
  };
}

// Footer renderer
function createFooterRenderer(context: PluginContext<MultiSlotConfig>) {
  return function FooterContent() {
    return <div>Footer content</div>;
  };
}

// Cell renderer (receives cell, column, row)
function createCellRenderer(context: PluginContext<MultiSlotConfig>) {
  const { args } = context;
  return function CellContent(
    cell: { getValue: () => unknown },
    column: unknown,
    row: unknown
  ) {
    const value = cell.getValue();
    if (typeof value === "number") {
      return <span style={{ color: args.primaryColor }}>{value.toLocaleString()}</span>;
    }
    return <>{String(value ?? "")}</>;
  };
}

// Inline row renderer (receives row)
function createInlineRowRenderer(context: PluginContext<MultiSlotConfig>) {
  const { args } = context;
  return function InlineRowContent(row: { original: Record<string, unknown> }) {
    const { table } = usePluginContext();
    return (
      <div style={{ padding: 16 }}>
        <h4>Row Details</h4>
        <pre>{JSON.stringify(row.original, null, 2)}</pre>
        <button onClick={() => table.plugin.close()}>Close</button>
      </div>
    );
  };
}

export const MultiSlotPlugin = definePlugin({
  id: "multi-slot",
  name: "Multi Slot",
  args: MultiSlotSchema,
  slots: {
    sidePanel: {
      position: "right-sider",
      header: "Multi Slot Plugin",
      render: createSidePanelRenderer,
    },
    header: {
      render: createHeaderRenderer,
    },
    footer: {
      render: createFooterRenderer,
    },
    cell: {
      render: createCellRenderer,
    },
    inlineRow: {
      render: createInlineRowRenderer,
    },
  },
});
```

### Opening Inline Row

The `inlineRow` slot renders below a specific row when opened via `plugin.open`:

```tsx
// Open inline row for a specific row by ID
table.plugin.open("multi-slot", { id: row.id });

// Close the inline row
table.plugin.close();
```

The `id` in `openArgs` is matched against each row's `id` field to determine which row to expand.

## Creating a Context Menu Only Plugin

Omit `slots` to create a plugin that only adds context menu items.

```tsx
import { z } from "zod";
import { definePlugin, contextMenuItem } from "@izumisy/seizen-table-plugins";

const RowActionsSchema = z.object({
  enableCopyId: z.boolean().default(true),
  enableDelete: z.boolean().default(false),
});

export const RowActionsPlugin = definePlugin({
  id: "row-actions",
  name: "Row Actions",
  args: RowActionsSchema,
  contextMenu: {
    items: [
      contextMenuItem("copy-id", (ctx) => ({
        label: "Copy ID",
        onClick: () => navigator.clipboard.writeText(String(ctx.row.id)),
        visible: ctx.pluginArgs.enableCopyId,
      })),
      contextMenuItem("delete", (ctx) => ({
        label: `Delete ${ctx.selectedRows.length > 1 ? `${ctx.selectedRows.length} items` : "item"}`,
        onClick: () => handleDelete(ctx.selectedRows.length > 0 ? ctx.selectedRows : [ctx.row]),
        visible: ctx.pluginArgs.enableDelete,
        disabled: ctx.selectedRows.length === 0,
      })),
    ],
  },
});
```

---

## Plugin Context (`usePluginContext`)

Inside your plugin component, use `usePluginContext` to access table data and APIs.

```tsx
const {
  table,         // DataTable instance
  data,          // Current table data (unknown[])
  columns,       // Column info ({ key, header }[])
  selectedRows,  // Currently selected rows (unknown[])
  openArgs,      // Arguments passed via table.plugin.open()
  useEvent,      // Hook to subscribe to events
} = usePluginContext();
```

### `openArgs` - Receiving Initial Data

When a plugin is opened with `table.plugin.open(pluginId, args)`, the `args` are available via `openArgs`:

```tsx
// Application side
table.plugin.open("row-detail", { row: clickedRow });

// Inside plugin
const { openArgs } = usePluginContext<"row-detail">();
const initialRow = openArgs?.row;
```

## Event System (`useEvent`)

Plugins can subscribe to DataTable events using the `useEvent` hook.

### Subscribing to Events

```tsx
function MyPluginPanel() {
  const { useEvent } = usePluginContext();
  const [lastClickedRow, setLastClickedRow] = useState(null);

  useEvent("row-click", (row) => {
    setLastClickedRow(row);
  });

  useEvent("selection-change", (selectedRows) => {
    console.log("Selection changed:", selectedRows.length);
  });

  return <div>...</div>;
}
```

### Custom Events (Module Augmentation)

Plugins can define and emit custom events with type safety:

```tsx
// In your plugin file, declare custom events
declare module "@izumisy/seizen-table/plugin" {
  interface EventBusRegistry {
    "my-plugin:action": { itemId: string; action: "create" | "delete" };
    "my-plugin:complete": { success: boolean };
  }
}

// Now these events are type-safe
useEvent("my-plugin:action", (payload) => {
  // payload is typed as { itemId: string; action: "create" | "delete" }
});
```

## Context Menu Items (`contextMenuItem`)

Add items to the row right-click context menu.

### Basic Usage

```tsx
contextMenuItem("copy-id", (ctx) => ({
  label: "Copy ID",
  onClick: () => navigator.clipboard.writeText(ctx.row.id),
}))
```

### Dynamic Labels and Conditions

```tsx
contextMenuItem("bulk-delete", (ctx) => ({
  label: ctx.selectedRows.length > 1
    ? `Delete ${ctx.selectedRows.length} items`
    : "Delete",
  onClick: () => {
    const targets = ctx.selectedRows.length > 0 ? ctx.selectedRows : [ctx.row];
    handleBulkDelete(targets);
  },
  visible: ctx.pluginArgs.enableBulkDelete,
  disabled: ctx.selectedRows.length === 0,
}))
```

## Type-Safe Plugin Args (`PluginArgsRegistry`)

Enable type-safe `table.plugin.open()` calls via module augmentation:

```tsx
// In your plugin file
declare module "@izumisy/seizen-table/plugin" {
  interface PluginArgsRegistry {
    "my-plugin": { row: MyRowType; mode: "view" | "edit" };
  }
}

// Now table.plugin.open is type-safe
table.plugin.open("my-plugin", { row, mode: "view" }); // ✅ Type-checked
table.plugin.open("my-plugin", { foo: 1 });            // ❌ Type error
```

## Plugin Control API

The `table.plugin` object provides methods to programmatically control plugins.

### Example: Open Plugin on Row Click

```tsx
const table = useDataTable({
  data,
  columns,
  plugins: [RowDetailPlugin.configure({ width: 350 })],
});

useDataTableEvent(table, "row-click", (row) => {
  table.plugin.open("row-detail", { row });
});
```

## Complete Example: Row Detail Plugin

```tsx
import { useState } from "react";
import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  type PluginContext,
} from "@izumisy/seizen-table-plugins";

// Type-safe plugin args
declare module "@izumisy/seizen-table/plugin" {
  interface PluginArgsRegistry {
    "row-detail": { row: unknown };
  }
}

const RowDetailSchema = z.object({
  width: z.number().default(320),
});

type RowDetailConfig = z.infer<typeof RowDetailSchema>;

function RowDetailRenderer(context: PluginContext<RowDetailConfig>) {
  const { args } = context;

  return function RowDetailPanel() {
    const { openArgs, useEvent } = usePluginContext<"row-detail">();
    // Initialize with openArgs (for first click)
    const initialRow = openArgs?.row ?? null;
    const [selectedRow, setSelectedRow] = useState<unknown>(initialRow);

    // Subscribe to row-click for subsequent clicks while panel is open
    useEvent("row-click", (row) => {
      setSelectedRow(row);
    });

    if (!selectedRow) {
      return <div style={{ width: args.width }}>Click a row to view details</div>;
    }

    return (
      <div style={{ width: args.width }}>
        {Object.entries(selectedRow as Record<string, unknown>).map(
          ([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {String(value)}
            </div>
          )
        )}
      </div>
    );
  };
}

export const RowDetailPlugin = definePlugin({
  id: "row-detail",
  name: "Details",
  args: RowDetailSchema,
  slots: {
    sidePanel: {
      position: "right-sider",
      header: "Row Details",
      render: RowDetailRenderer,
    },
  },
});
```

## Complete Example: File Export Plugin with Custom Events

```tsx
import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  type PluginContext,
} from "@izumisy/seizen-table-plugins";

// Custom events for this plugin
declare module "@izumisy/seizen-table/plugin" {
  interface EventBusRegistry {
    "file-export:start": { format: string; rowCount: number };
    "file-export:complete": { filename: string; format: string };
  }
}

const FileExportSchema = z.object({
  width: z.number().default(300),
  filename: z.string().default("export"),
  formats: z.array(z.enum(["csv", "json"])).default(["csv"]),
});

function FileExportRenderer(context: PluginContext<z.infer<typeof FileExportSchema>>) {
  const { args } = context;

  return function FileExportPanel() {
    const { data, columns, table } = usePluginContext();

    const handleExport = (format: string) => {
      // Emit start event
      table.eventBus.emit("file-export:start", { format, rowCount: data.length });

      // ... export logic ...

      // Emit complete event
      table.eventBus.emit("file-export:complete", { filename: args.filename, format });
    };

    return (
      <div style={{ width: args.width }}>
        <p>{data.length} rows to export</p>
        {args.formats.map((format) => (
          <button key={format} onClick={() => handleExport(format)}>
            Export as {format.toUpperCase()}
          </button>
        ))}
      </div>
    );
  };
}

export const FileExportPlugin = definePlugin({
  id: "file-export",
  name: "Export",
  args: FileExportSchema,
  slots: {
    sidePanel: {
      position: "right-sider",
      render: FileExportRenderer,
    },
  },
});
```
