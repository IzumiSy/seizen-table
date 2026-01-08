---
editUrl: false
next: false
prev: false
title: "CellContextMenuItemContext"
---

Defined in: [contextMenuItem.ts:32](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L32)

Context passed to cellContextMenuItem factory function

## Type Parameters

### TData

`TData`

### TArgs

`TArgs` = `unknown`

## Properties

### cell

> **cell**: `Cell`\<`TData`, `unknown`\>

Defined in: [contextMenuItem.ts:34](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L34)

The cell that was right-clicked

***

### column

> **column**: `Column`\<`TData`, `unknown`\>

Defined in: [contextMenuItem.ts:36](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L36)

The column of the right-clicked cell

***

### emit()

> **emit**: \<`K`\>(`event`, `payload`) => `void`

Defined in: [contextMenuItem.ts:48](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L48)

Emit an event to the EventBus

#### Type Parameters

##### K

`K` *extends* keyof DataTableEventMap\<unknown\> \| `string` & `object`

#### Parameters

##### event

`K`

##### payload

`K` *extends* keyof [`DataTableEventMap`](/seizen-ui/api/plugin/interfaces/datatableeventmap/)\<`unknown`\> ? [`DataTableEventMap`](/seizen-ui/api/plugin/interfaces/datatableeventmap/)\<`unknown`\>\[`K`\<`K`\>\] : `unknown`

#### Returns

`void`

***

### pluginArgs

> **pluginArgs**: `TArgs`

Defined in: [contextMenuItem.ts:46](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L46)

Plugin configuration args (validated by Zod schema)

***

### row

> **row**: `Row`\<`TData`\>

Defined in: [contextMenuItem.ts:38](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L38)

The row containing the right-clicked cell

***

### selectedRows

> **selectedRows**: `TData`[]

Defined in: [contextMenuItem.ts:42](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L42)

Currently selected rows in the table

***

### table

> **table**: `Table`\<`TData`\>

Defined in: [contextMenuItem.ts:44](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L44)

TanStack Table instance

***

### value

> **value**: `unknown`

Defined in: [contextMenuItem.ts:40](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L40)

The raw value of the cell (cell.getValue())
