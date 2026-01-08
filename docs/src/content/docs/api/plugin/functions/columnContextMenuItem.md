---
editUrl: false
next: false
prev: false
title: "columnContextMenuItem"
---

> **columnContextMenuItem**\<`TData`, `TArgs`\>(`id`, `factory`): [`ColumnContextMenuItemFactory`](/seizen-ui/api/plugin/interfaces/columncontextmenuitemfactory/)\<`TData`, `TArgs`\>

Defined in: [contextMenuItem.ts:167](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L167)

Helper function to create a column context menu item with full context access.

The factory function receives context including the clicked column header,
table instance, and plugin configuration args.

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

[`ColumnContextMenuItemFactory`](/seizen-ui/api/plugin/interfaces/columncontextmenuitemfactory/)\<`TData`, `TArgs`\>

## Examples

```tsx
columnContextMenuItem("hide-column", (ctx) => ({
  label: "Hide column",
  onClick: () => {
    ctx.column.toggleVisibility(false);
  },
}))
```

```tsx
columnContextMenuItem("sort-asc", (ctx) => ({
  label: "Sort ascending",
  onClick: () => {
    ctx.column.toggleSorting(false);
  },
  visible: ctx.column.getCanSort(),
}))
```
