# Plugin System

## Motivation

Different use cases require different UI enhancements:

- Admin dashboards need bulk actions and advanced filtering
- Spreadsheet-like apps need cell editing and sheet tabs
- Analytics tools need column customization and export features

The plugin system allows these features to be added modularly.

## Plugin Interface

```typescript
import { z } from "zod";

interface DataTablePlugin<TData = unknown> {
  /**
   * Unique plugin identifier
   */
  id: string;

  /**
   * Plugin display name
   */
  name: string;

  /**
   * Plugin position in the DataTable layout
   */
  position: "toolbar" | "sidebar" | "footer" | "overlay";

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
   * Plugin display name
   */
  name: string;

  /**
   * Plugin position in the DataTable layout
   */
  position: "toolbar" | "sidebar" | "footer" | "overlay";

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

### SearchPanel

Global search and advanced filtering UI.

```typescript
import { SearchPanel } from "@izumisy/seizen-datatable-plugin-search";

const searchPlugin = SearchPanel.configure({
  // Searchable columns
  searchableColumns: ["name", "email"],
  // Enable advanced filter builder
  enableAdvancedFilter: true,
  // Debounce search input
  debounceMs: 300,
});
```

### SidePanel

Slide-out panel for row details, editing, or custom content.

```typescript
import { SidePanel } from "@izumisy/seizen-datatable-plugin-sidepanel";

const sidePanelPlugin = SidePanel.configure({
  // Render function for panel content
  render: (row) => <UserDetailPanel user={row} />,
  // Panel width
  width: 400,
  // Open on row click
  trigger: "row-click",
});
```

### SheetView

Spreadsheet-like tabs for multiple views/datasets.

```typescript
import { SheetView } from "@izumisy/seizen-datatable-plugin-sheet";

const sheetPlugin = SheetView.configure({
  sheets: [
    { id: "all", label: "All Users", filter: {} },
    { id: "active", label: "Active", filter: { status: "active" } },
    { id: "inactive", label: "Inactive", filter: { status: "inactive" } },
  ],
  // Allow users to create custom sheets
  allowCustomSheets: true,
});
```

### ColumnCustomizer

UI for showing/hiding and reordering columns.

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
import { SearchPanel } from "@izumisy/seizen-datatable-plugin-search";
import { SidePanel } from "@izumisy/seizen-datatable-plugin-sidepanel";

function UsersTable() {
  return (
    <DataTable
      data={data}
      columns={columns}
      plugins={[
        SearchPanel.configure({ searchableColumns: ["name", "email"] }),
        SidePanel.configure({ render: (row) => <UserDetail user={row} /> }),
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
  position: "toolbar",
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
