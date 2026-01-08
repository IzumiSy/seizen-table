---
editUrl: false
next: false
prev: false
title: "definePlugin"
---

> **definePlugin**\<`TData`, `TSchema`\>(`options`): `object`

Defined in: [definePlugin.ts:273](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L273)

Define a plugin with type-safe configuration.

This function creates a plugin factory with a `configure` method that validates
configuration at runtime using the provided Zod schema.

## Type Parameters

### TData

`TData`

### TSchema

`TSchema` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

## Parameters

### options

[`DefinePluginOptions`](/seizen-ui/api/plugin/type-aliases/definepluginoptions/)\<`TData`, `TSchema`\>

## Returns

`object`

### configure()

> **configure**: (`config`) => [`DataTablePlugin`](/seizen-ui/api/plugin/interfaces/datatableplugin/)\<`TData`\>

#### Parameters

##### config

`input`\<`TSchema`\>

#### Returns

[`DataTablePlugin`](/seizen-ui/api/plugin/interfaces/datatableplugin/)\<`TData`\>

## Example

```tsx
import { z } from "zod";
import { definePlugin, cellContextMenuItem, usePluginContext } from "@izumisy/seizen-datatable-react/plugin";

const BulkActionsSchema = z.object({
  enableDelete: z.boolean().default(true),
  enableExport: z.boolean().default(true),
});

function createSidepanelRenderer(context: PluginContext<z.infer<typeof BulkActionsSchema>>) {
  const { args } = context;
  return function SidepanelContent() {
    const { selectedRows } = usePluginContext();
    if (selectedRows.length === 0) return null;
    return (
      <div className="bulk-actions">
        <span>{selectedRows.length} selected</span>
        {args.enableDelete && <button>Delete</button>}
        {args.enableExport && <button>Export</button>}
      </div>
    );
  };
}

const BulkActions = definePlugin({
  id: "bulk-actions",
  name: "Bulk Actions",
  args: BulkActionsSchema,
  slots: {
    sidepanel: {
      position: "right-sider",
      render: createSidepanelRenderer,
    },
  },
  contextMenuItems: {
    cell: [
      cellContextMenuItem("copy-value", (ctx) => ({
        label: "Copy value",
        onClick: () => navigator.clipboard.writeText(String(ctx.value)),
      })),
    ],
  },
});

// Usage
<DataTable plugins={[BulkActions.configure({ enableDelete: true })]} />
```
