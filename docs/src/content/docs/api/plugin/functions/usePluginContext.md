---
editUrl: false
next: false
prev: false
title: "usePluginContext"
---

> **usePluginContext**\<`TPluginId`\>(): [`PluginContextValue`](/seizen-ui/api/plugin/interfaces/plugincontextvalue/)\<`TPluginId` *extends* `never` ? [`PluginArgsRegistry`](/seizen-ui/api/plugin/interfaces/pluginargsregistry/)\[`TPluginId`\<`TPluginId`\>\] : `unknown`\>

Defined in: [Context.tsx:303](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/Context.tsx#L303)

Hook to access table context from within a plugin component.

Note: `data`, `selectedRows`, and `table` are typed as `unknown` because
plugins are defined generically and cannot know the specific row type at
definition time. Cast as needed in your plugin implementation.

## Type Parameters

### TPluginId

`TPluginId` *extends* `string` & `object` = `string`

The plugin ID for type-safe openArgs (optional)

## Returns

[`PluginContextValue`](/seizen-ui/api/plugin/interfaces/plugincontextvalue/)\<`TPluginId` *extends* `never` ? [`PluginArgsRegistry`](/seizen-ui/api/plugin/interfaces/pluginargsregistry/)\[`TPluginId`\<`TPluginId`\>\] : `unknown`\>

## Examples

```tsx
function MyPluginComponent() {
  const { table, data, selectedRows, useEvent } = usePluginContext();

  useEvent("selection-change", (rows) => {
    console.log("Selection changed:", rows);
  });

  return <div>Total rows: {data.length}</div>;
}
```

```tsx
// First, register the plugin args type:
declare module "@izumisy/seizen-datatable-react/plugin" {
  interface PluginArgsRegistry {
    "row-detail": { row: Person };
  }
}

// Then use with plugin ID for type-safe openArgs:
function RowDetailPanel() {
  const { openArgs } = usePluginContext<"row-detail">();
  // openArgs is typed as { row: Person } | undefined
  const row = openArgs?.row;
}
```
