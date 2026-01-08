---
editUrl: false
next: false
prev: false
title: "cellContextMenuItem"
---

> **cellContextMenuItem**\<`TData`, `TArgs`\>(`id`, `factory`): [`CellContextMenuItemFactory`](/seizen-ui/api/plugin/interfaces/cellcontextmenuitemfactory/)\<`TData`, `TArgs`\>

Defined in: [contextMenuItem.ts:121](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L121)

Helper function to create a cell context menu item with full context access.

The factory function receives context including the clicked cell, column, row,
cell value, table instance, and plugin configuration args.

## Type Parameters

### TData

`TData`

### TArgs

`TArgs` = `unknown`

## Parameters

### id

`string`

Unique identifier for the menu item

### factory

(`ctx`) => [`ContextMenuItemEntry`](/seizen-ui/api/plugin/interfaces/contextmenuitementry/)

Factory function that receives context and returns menu item entry

## Returns

[`CellContextMenuItemFactory`](/seizen-ui/api/plugin/interfaces/cellcontextmenuitemfactory/)\<`TData`, `TArgs`\>

## Examples

```tsx
cellContextMenuItem("filter-by-value", (ctx) => ({
  label: `Filter by "${ctx.value}"`,
  onClick: () => {
    ctx.column.setFilterValue(ctx.value);
  },
}))
```

```tsx
cellContextMenuItem("copy-value", (ctx) => ({
  label: "Copy value",
  onClick: () => navigator.clipboard.writeText(String(ctx.value)),
  visible: ctx.value != null,
}))
```
