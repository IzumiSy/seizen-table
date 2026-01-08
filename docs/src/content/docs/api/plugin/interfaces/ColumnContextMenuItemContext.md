---
editUrl: false
next: false
prev: false
title: "ColumnContextMenuItemContext"
---

Defined in: [contextMenuItem.ts:68](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L68)

Context passed to columnContextMenuItem factory function

## Type Parameters

### TData

`TData`

### TArgs

`TArgs` = `unknown`

## Properties

### column

> **column**: `Column`\<`TData`, `unknown`\>

Defined in: [contextMenuItem.ts:70](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L70)

The column header that was right-clicked

***

### emit()

> **emit**: \<`K`\>(`event`, `payload`) => `void`

Defined in: [contextMenuItem.ts:76](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L76)

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

Defined in: [contextMenuItem.ts:74](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L74)

Plugin configuration args (validated by Zod schema)

***

### table

> **table**: `Table`\<`TData`\>

Defined in: [contextMenuItem.ts:72](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/contextMenuItem.ts#L72)

TanStack Table instance
