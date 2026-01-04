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

## Plugin Interface

```typescript
import { z } from "zod";

interface DataTablePlugin<TData = unknown> {
  /**
   * Unique plugin identifier
   */
  id: string;

  /**
   * Plugin display name (used as vertical tab label in sidepanel)
   */
  name: string;

  /**
   * Plugin position in the DataTable layout
   */
  position: "left-sider" | "right-sider";

  /**
   * Render the plugin UI
   */
  render: () => ReactNode;
}

interface PluginContext<TArgs> {
  /**
   * Validated configuration from args schema
   */
  args: TArgs;
}

interface DefinePluginOptions<TData, TSchema extends z.ZodType> {
  /**
   * Unique plugin identifier
   */
  id: string;

  /**
   * Plugin display name (used as vertical tab label in sidepanel)
   */
  name: string;

  /**
   * Plugin position in the DataTable layout
   */
  position: "left-sider" | "right-sider";

  /**
   * Zod schema for configuration validation
   */
  args: TSchema;

  /**
   * Render function that receives context with validated args
   */
  render: (context: PluginContext<z.infer<TSchema>>) => () => ReactNode;
}

// definePlugin returns a plugin factory with type-safe configure method
function definePlugin<TData, TSchema extends z.ZodType>(
  options: DefinePluginOptions<TData, TSchema>
): {
  configure: (config: z.infer<TSchema>) => DataTablePlugin<TData>;
};
```

## usePluginContext Hook

Inside the plugin's `render` function, use `usePluginContext` to access table state:

```typescript
import { useState } from "react";
import { usePluginContext } from "@izumisy/seizen-datatable-react";

function MyPluginComponent() {
  const {
    // Table instance
    table,
    
    // DataAdapter instance (if provided)
    adapter,
    
    // Current data
    data,
    
    // Selected rows
    selectedRows,
    
    // Type-safe change subscription
    useOnChange,
  } = usePluginContext();

  // Local state (use React's useState as usual)
  const [isOpen, setIsOpen] = useState(false);

  return <div>...</div>;
}
```

## useOnChange Hook

Subscribe to various table state changes with type safety:

```typescript
type ChangeEventMap<TData> = {
  data: TData[];
  selection: RowSelectionState;
  filter: FilterState;
  sorting: SortingState;
  pagination: PaginationState;
};

// Usage
const { useOnChange } = usePluginContext();

// Type-safe: callback receives TData[]
useOnChange("data", (data) => {
  console.log("Data changed:", data);
});

// Type-safe: callback receives RowSelectionState
useOnChange("selection", (selection) => {
  console.log("Selection changed:", selection);
});

// Type-safe: callback receives FilterState
useOnChange("filter", (filter) => {
  console.log("Filter changed:", filter);
});

// Type-safe: callback receives SortingState
useOnChange("sorting", (sorting) => {
  console.log("Sorting changed:", sorting);
});
```

## Built-in Plugins

### RowDetail

Display row details in the sidepanel.

```typescript
import { RowDetail } from "@izumisy/seizen-datatable-plugin-row-detail";

const rowDetailPlugin = RowDetail.configure({
  // Render function for detail content
  render: (row) => <UserDetailView user={row} />,
  // Open on row click
  trigger: "row-click",
});
```

### FilterBuilder

Advanced filtering UI in the sidepanel.

```typescript
import { FilterBuilder } from "@izumisy/seizen-datatable-plugin-filter";

const filterPlugin = FilterBuilder.configure({
  // Filterable columns
  filterableColumns: ["name", "email", "status"],
  // Enable saved filters
  enableSavedFilters: true,
});
```

### ColumnCustomizer

UI for showing/hiding and reordering columns in the sidepanel.

```typescript
import { ColumnCustomizer } from "@izumisy/seizen-datatable-plugin-columns";

const columnPlugin = ColumnCustomizer.configure({
  // Persist column preferences
  persistKey: "users-table-columns",
  // Default visible columns
  defaultVisible: ["name", "email", "status"],
});
```

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

## Custom Plugin Example

```tsx
import { z } from "zod";
import { definePlugin, usePluginContext } from "@izumisy/seizen-datatable-react";

// Define the config schema with Zod
const BulkActionsSchema = z.object({
  // Enable delete action
  enableDelete: z.boolean().default(true),
  // Enable export action
  enableExport: z.boolean().default(true),
  // Custom actions
  actions: z.array(z.object({
    label: z.string(),
    onClick: z.function().args(z.array(z.unknown())).returns(z.void()),
  })).optional(),
});

function BulkActionsRenderer(context: PluginContext<z.infer<typeof BulkActionsSchema>>) {
  const { args } = context;

  return function Render() {
    const { selectedRows, useOnChange } = usePluginContext();

    useOnChange("selection", (selection) => {
      console.log("Selection changed:", selection);
    });

    if (selectedRows.length === 0) return null;

    return (
      <div className="bulk-actions">
        <span>{selectedRows.length} selected</span>
        {args.enableDelete && (
          <button onClick={() => handleDelete(selectedRows)}>Delete</button>
        )}
        {args.enableExport && (
          <button onClick={() => handleExport(selectedRows)}>Export</button>
        )}
        {args.actions?.map((action) => (
          <button key={action.label} onClick={() => action.onClick(selectedRows)}>
            {action.label}
          </button>
        ))}
      </div>
    );
  };
}

const BulkActions = definePlugin({
  id: "bulk-actions",
  name: "Bulk Actions",
  position: "right-sider",
  args: BulkActionsSchema,
  render: BulkActionsRenderer,
});

// Usage - config is type-safe and validated at runtime
<DataTable
  plugins={[
    BulkActions.configure({
      enableDelete: true,
      enableExport: false,
      actions: [
        { label: "Archive", onClick: (rows) => archiveUsers(rows) },
      ],
    }),
  ]}
/>
```

## Validation Behavior

When `configure()` is called, the config is validated against the Zod schema:

```typescript
// ✅ Valid - passes schema validation
BulkActions.configure({ enableDelete: true });

// ✅ Valid - uses default values from schema
BulkActions.configure({});

// ❌ Invalid - TypeScript error + runtime validation error
BulkActions.configure({ enableDelete: "yes" }); // Type 'string' is not assignable to type 'boolean'
```
