---
editUrl: false
next: false
prev: false
title: "PluginContextValue"
---

Defined in: [Context.tsx:48](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/Context.tsx#L48)

Plugin context value available to all plugins.

Note: `data`, `selectedRows`, and `table` are typed as `unknown` because
plugins are defined generically and cannot know the specific row type.

## Type Parameters

### TOpenArgs

`TOpenArgs` = `unknown`

## Properties

### columns

> **columns**: [`PluginColumnInfo`](/seizen-ui/api/plugin/interfaces/plugincolumninfo/)[]

Defined in: [Context.tsx:62](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/Context.tsx#L62)

Column information (key and header)

***

### data

> **data**: `unknown`[]

Defined in: [Context.tsx:57](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/Context.tsx#L57)

Current table data

***

### openArgs

> **openArgs**: `TOpenArgs` \| `undefined`

Defined in: [Context.tsx:89](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/Context.tsx#L89)

Arguments passed to openPlugin() when the plugin was opened.
Use this to receive initial data when the plugin mounts.

For type-safe access, pass the plugin ID as the type parameter:
```tsx
const { openArgs } = usePluginContext<"row-detail">();
// openArgs is typed as { row: Person } if registered in PluginArgsRegistry
```

#### Example

```tsx
// Application opens plugin with args:
table.plugin.open("row-detail", { row: clickedRow });

// Plugin receives args (type-safe):
const { openArgs } = usePluginContext<"row-detail">();
const initialRow = openArgs?.row;
```

***

### selectedRows

> **selectedRows**: `unknown`[]

Defined in: [Context.tsx:67](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/Context.tsx#L67)

Currently selected rows

***

### table

> **table**: `DataTableInstance`\<`unknown`\>

Defined in: [Context.tsx:52](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/Context.tsx#L52)

The DataTable instance

***

### useEvent()

> **useEvent**: \<`K`\>(`event`, `callback`) => `void`

Defined in: [Context.tsx:117](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/Context.tsx#L117)

Hook to subscribe to events emitted by DataTable.

Built-in events:
- `data-change`: Table data changed
- `selection-change`: Row selection changed
- `filter-change`: Column filters changed
- `sorting-change`: Sorting changed
- `pagination-change`: Pagination changed
- `row-click`: A row was clicked

#### Type Parameters

##### K

`K` *extends* keyof DataTableEventMap\<unknown\> \| `string` & `object`

#### Parameters

##### event

`K`

##### callback

(`payload`) => `void`

#### Returns

`void`

#### Example

```tsx
const { useEvent } = usePluginContext();

// Subscribe to selection changes
useEvent("selection-change", (selectedRows) => {
  console.log("Selection changed:", selectedRows);
});

// Subscribe to row clicks
useEvent("row-click", (row) => {
  console.log("Row clicked:", row);
});
```
