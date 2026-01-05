# Plugin System

## Motivation

Different use cases require different UI enhancements:

- Admin dashboards need bulk actions and row detail panels
- Data exploration apps need advanced filtering and search
- Analytics tools need column customization and export features

The plugin system allows these features to be added modularly.

## Layout

DataTable provides built-in sidepanels with IDE-style vertical tabs on both sides. Each plugin specifies which side to render on.

```
┌───────┬─────────────────────────────────────────────┬───────┐
│ [N]   │                                             │ [D]   │
│ [a]   │                                             │ [e]   │
│ [v]   │                                             │ [t]   │
│ [i]   │             Table Body                      │ [a]   │
│ [g]   │                                             │ [i]   │
│ [a]   │                                             │ [l]   │
│ [t]   ├─────────────────────────────────────────────┤ [s]   │
│ [e]   │                                             ├───────┤
│       │                                             │ [F]   │
│   ↑   │                                             │ [i]   │
│ left- │                                             │ [l]   │
│ sider │                                             │ [t]   │
│       │                                             │ [e]   │
│       │                                             │ [r]   │
│       │                                             │   ↑   │
│       │                                             │ right-│
│       │                                             │ sider │
└───────┴─────────────────────────────────────────────┴───────┘
```

| Position | Description |
|----------|-------------|
| `left-sider` | IDE-style vertical tab on the left side. Ideal for navigation, tree views. |
| `right-sider` | IDE-style vertical tab on the right side. Ideal for details, inspectors. |

Plugins can render modals/dialogs internally when needed.

## Plugin Usage

```tsx
import { DataTable } from "@izumisy/seizen-datatable-react";
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
} from "@izumisy/seizen-datatable-react/plugin";
```

### Plugin Types

There are two types of plugins:

1. **Sidepanel Plugin** - Renders UI in a sidepanel and optionally adds context menu items
2. **Context Menu Only Plugin** - Only adds items to the row context menu (no sidepanel UI)

## Creating a Sidepanel Plugin

Use `definePlugin` with `position` and `render` to create a sidepanel plugin.

### Basic Structure

```tsx
import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  type PluginContext,
} from "@izumisy/seizen-datatable-react/plugin";

// 1. Define configuration schema with Zod
const MyPluginSchema = z.object({
  width: z.number().default(320),
  title: z.string().default("My Plugin"),
});

type MyPluginConfig = z.infer<typeof MyPluginSchema>;

// 2. Create the render function
function MyPluginRenderer(context: PluginContext<MyPluginConfig>) {
  const { args } = context; // args contains validated config

  // Return a React component
  return function MyPluginPanel() {
    const { data, selectedRows, useEvent } = usePluginContext();

    return (
      <div style={{ width: args.width }}>
        <h2>{args.title}</h2>
        <p>Total rows: {data.length}</p>
      </div>
    );
  };
}

// 3. Define the plugin
export const MyPlugin = definePlugin({
  id: "my-plugin",
  name: "My Plugin",           // Tab label
  position: "right-sider",     // or "left-sider"
  args: MyPluginSchema,
  header: "My Plugin Header",  // Panel header (optional)
  render: MyPluginRenderer,
});
```

### Using the Plugin

```tsx
<DataTable
  data={data}
  columns={columns}
  plugins={[MyPlugin.configure({ width: 400, title: "Custom Title" })]}
/>
```

## Creating a Context Menu Only Plugin

Omit `position` and `render` to create a plugin that only adds context menu items.

```tsx
import { z } from "zod";
import { definePlugin, contextMenuItem } from "@izumisy/seizen-datatable-react/plugin";

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
declare module "@izumisy/seizen-datatable-react/plugin" {
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
declare module "@izumisy/seizen-datatable-react/plugin" {
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
  onRowClick: (row) => {
    table.plugin.open("row-detail", { row });
  },
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
} from "@izumisy/seizen-datatable-react/plugin";

// Type-safe plugin args
declare module "@izumisy/seizen-datatable-react/plugin" {
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
  position: "right-sider",
  args: RowDetailSchema,
  header: "Row Details",
  render: RowDetailRenderer,
});
```

## Complete Example: File Export Plugin with Custom Events

```tsx
import { z } from "zod";
import {
  definePlugin,
  usePluginContext,
  type PluginContext,
} from "@izumisy/seizen-datatable-react/plugin";

// Custom events for this plugin
declare module "@izumisy/seizen-datatable-react/plugin" {
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
  position: "right-sider",
  args: FileExportSchema,
  render: FileExportRenderer,
});
```
