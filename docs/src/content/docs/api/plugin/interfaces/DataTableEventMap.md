---
editUrl: false
next: false
prev: false
title: "DataTableEventMap"
---

Defined in: [useEventBus.ts:47](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L47)

Map of built-in event names to their payload types.

DataTable automatically emits these events:
- State change events: data, selection, filter, sorting, pagination
- Action events: row-click

Plugins can extend EventBusRegistry to add custom events.

## Extends

- [`EventBusRegistry`](/seizen-ui/api/plugin/interfaces/eventbusregistry/)

## Type Parameters

### TData

`TData` = `unknown`

The type of row data. Defaults to `unknown`.

## Properties

### cell-context-menu

> **cell-context-menu**: `object`

Defined in: [useEventBus.ts:85](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L85)

Emitted when cell context menu is opened.
Payload includes the cell, column, row, and value.

#### cell

> **cell**: `Cell`\<`TData`, `unknown`\>

#### column

> **column**: `Column`\<`TData`, `unknown`\>

#### row

> **row**: `Row`\<`TData`\>

#### value

> **value**: `unknown`

***

### column-context-menu

> **column-context-menu**: `object`

Defined in: [useEventBus.ts:96](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L96)

Emitted when column header context menu is opened.
Payload includes the column.

#### column

> **column**: `Column`\<`TData`, `unknown`\>

***

### data-change

> **data-change**: `TData`[]

Defined in: [useEventBus.ts:52](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L52)

Emitted when table data changes.
Payload is the entire data array.

***

### filter-change

> **filter-change**: `ColumnFiltersState`

Defined in: [useEventBus.ts:63](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L63)

Emitted when column filters change.

***

### pagination-change

> **pagination-change**: `PaginationState`

Defined in: [useEventBus.ts:73](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L73)

Emitted when pagination changes.

***

### row-click

> **row-click**: `TData`

Defined in: [useEventBus.ts:79](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L79)

Emitted when a table row is clicked.
Payload is the clicked row data.

***

### selection-change

> **selection-change**: `TData`[]

Defined in: [useEventBus.ts:58](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L58)

Emitted when row selection changes.
Payload is the array of selected rows.

***

### sorting-change

> **sorting-change**: `SortingState`

Defined in: [useEventBus.ts:68](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L68)

Emitted when sorting changes.
