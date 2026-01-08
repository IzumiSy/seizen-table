---
editUrl: false
next: false
prev: false
title: "DataTableInstance"
---

Defined in: [packages/datatable-react/src/table/useDataTable.ts:51](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L51)

DataTable instance returned by useDataTable

## Type Parameters

### TData

`TData`

## Properties

### clearSelection()

> **clearSelection**: () => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:71](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L71)

Clear all row selections.

#### Returns

`void`

***

### eventBus

> **eventBus**: `object`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:228](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L228)

Event bus for plugin communication.
Use this to emit custom events that plugins can subscribe to.

#### emit()

> **emit**: \<`K`\>(`event`, `payload`) => `void`

Emit an event to all subscribers

##### Type Parameters

###### K

`K` *extends* keyof DataTableEventMap\<unknown\> \| `string` & `object`

##### Parameters

###### event

`K`

###### payload

`K` *extends* keyof [`DataTableEventMap`](/seizen-ui/api/datatable/interfaces/datatableeventmap/)\<`unknown`\> ? [`DataTableEventMap`](/seizen-ui/api/datatable/interfaces/datatableeventmap/)\<`unknown`\>\[`K`\<`K`\>\] : `unknown`

##### Returns

`void`

#### subscribe()

> **subscribe**: \<`K`\>(`event`, `callback`) => () => `void`

Subscribe to an event

##### Type Parameters

###### K

`K` *extends* keyof DataTableEventMap\<unknown\> \| `string` & `object`

##### Parameters

###### event

`K`

###### callback

(`payload`) => `void`

##### Returns

Unsubscribe function

> (): `void`

###### Returns

`void`

#### Example

```tsx
// Emit a custom event
table.eventBus.emit("my-custom-event", { data: "value" });
```

***

### getColumnOrder()

> **getColumnOrder**: () => `ColumnOrderState`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:185](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L185)

Get the current column order.

#### Returns

`ColumnOrderState`

Array of column IDs in order

***

### getColumns()

> **getColumns**: () => [`DataTableColumn`](/seizen-ui/api/datatable/type-aliases/datatablecolumn/)\<`TData`\>[]

Defined in: [packages/datatable-react/src/table/useDataTable.ts:153](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L153)

Get the column definitions.

#### Returns

[`DataTableColumn`](/seizen-ui/api/datatable/type-aliases/datatablecolumn/)\<`TData`\>[]

Array of column definitions

***

### getColumnVisibility()

> **getColumnVisibility**: () => `VisibilityState`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:163](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L163)

Get the current column visibility state.

#### Returns

`VisibilityState`

Object mapping column IDs to visibility (true = visible)

***

### getData()

> **getData**: () => `TData`[]

Defined in: [packages/datatable-react/src/table/useDataTable.ts:147](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L147)

Get the current table data.

#### Returns

`TData`[]

Array of row data

***

### getFilterState()

> **getFilterState**: () => [`ColumnFiltersState`](/seizen-ui/api/datatable/type-aliases/columnfiltersstate/)

Defined in: [packages/datatable-react/src/table/useDataTable.ts:81](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L81)

Get the current column filter state.

#### Returns

[`ColumnFiltersState`](/seizen-ui/api/datatable/type-aliases/columnfiltersstate/)

Array of column filters

***

### getGlobalFilter()

> **getGlobalFilter**: () => `string`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:93](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L93)

Get the current global filter value.

#### Returns

`string`

Global filter string

***

### getPaginationState()

> **getPaginationState**: () => [`PaginationState`](/seizen-ui/api/datatable/interfaces/paginationstate/)

Defined in: [packages/datatable-react/src/table/useDataTable.ts:125](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L125)

Get the current pagination state.

#### Returns

[`PaginationState`](/seizen-ui/api/datatable/interfaces/paginationstate/)

Pagination state including pageIndex and pageSize

***

### getSelectedRows()

> **getSelectedRows**: () => `TData`[]

Defined in: [packages/datatable-react/src/table/useDataTable.ts:60](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L60)

Get the currently selected rows.

#### Returns

`TData`[]

Array of selected row data

***

### getSortingState()

> **getSortingState**: () => [`SortingState`](/seizen-ui/api/datatable/type-aliases/sortingstate/)

Defined in: [packages/datatable-react/src/table/useDataTable.ts:109](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L109)

Get the current sorting state.

#### Returns

[`SortingState`](/seizen-ui/api/datatable/type-aliases/sortingstate/)

Array of sorting configurations

***

### moveColumn()

> **moveColumn**: (`columnId`, `toIndex`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:198](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L198)

Move a column to a new position.

#### Parameters

##### columnId

`string`

The column ID to move

##### toIndex

`number`

The target index

#### Returns

`void`

***

### plugin

> **plugin**: `PluginControl`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:212](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L212)

Plugin control interface.

***

### plugins

> **plugins**: `DataTablePlugin`\<`any`\>[]

Defined in: [packages/datatable-react/src/table/useDataTable.ts:207](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L207)

Plugins registered with this table.

***

### setColumnOrder()

> **setColumnOrder**: (`order`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:191](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L191)

Set the column order.

#### Parameters

##### order

`ColumnOrderState`

Array of column IDs in desired order

#### Returns

`void`

***

### setColumnVisibility()

> **setColumnVisibility**: (`visibility`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:169](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L169)

Set column visibility state.

#### Parameters

##### visibility

`VisibilityState`

Object mapping column IDs to visibility

#### Returns

`void`

***

### setFilter()

> **setFilter**: (`filter`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:87](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L87)

Set column filters programmatically.

#### Parameters

##### filter

[`ColumnFiltersState`](/seizen-ui/api/datatable/type-aliases/columnfiltersstate/)

Column filter state to apply

#### Returns

`void`

***

### setGlobalFilter()

> **setGlobalFilter**: (`value`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:99](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L99)

Set the global filter value.

#### Parameters

##### value

`string`

Filter string to apply across all columns

#### Returns

`void`

***

### setPageIndex()

> **setPageIndex**: (`index`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:131](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L131)

Set the current page index (0-based).

#### Parameters

##### index

`number`

Page index to navigate to

#### Returns

`void`

***

### setPageSize()

> **setPageSize**: (`size`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:137](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L137)

Set the number of rows per page.

#### Parameters

##### size

`number`

Number of rows to display per page

#### Returns

`void`

***

### setSelectedRows()

> **setSelectedRows**: (`rows`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:66](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L66)

Set the selected rows programmatically.

#### Parameters

##### rows

`TData`[]

Array of row data to select

#### Returns

`void`

***

### setSorting()

> **setSorting**: (`sorting`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:115](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L115)

Set sorting programmatically.

#### Parameters

##### sorting

[`SortingState`](/seizen-ui/api/datatable/type-aliases/sortingstate/)

Sorting state to apply

#### Returns

`void`

***

### toggleColumnVisibility()

> **toggleColumnVisibility**: (`columnId`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:175](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L175)

Toggle visibility of a specific column.

#### Parameters

##### columnId

`string`

The column ID to toggle

#### Returns

`void`
