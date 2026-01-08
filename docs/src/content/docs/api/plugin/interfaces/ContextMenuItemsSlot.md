---
editUrl: false
next: false
prev: false
title: "ContextMenuItemsSlot"
---

Defined in: [definePlugin.ts:86](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L86)

Context menu items configuration for plugins

## Type Parameters

### TData

`TData` = `unknown`

## Properties

### cell?

> `optional` **cell**: [`CellContextMenuItemFactory`](/seizen-ui/api/plugin/interfaces/cellcontextmenuitemfactory/)\<`TData`, `unknown`\>[]

Defined in: [definePlugin.ts:88](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L88)

Cell context menu items - shown when right-clicking a cell

***

### column?

> `optional` **column**: [`ColumnContextMenuItemFactory`](/seizen-ui/api/plugin/interfaces/columncontextmenuitemfactory/)\<`TData`, `unknown`\>[]

Defined in: [definePlugin.ts:90](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L90)

Column context menu items - shown when right-clicking a column header
