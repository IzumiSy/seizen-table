---
editUrl: false
next: false
prev: false
title: "UseDataTableOptions"
---

Defined in: [packages/datatable-react/src/table/useDataTable.ts:38](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L38)

Options for useDataTable hook

## Type Parameters

### TData

`TData`

## Properties

### columns

> **columns**: [`DataTableColumn`](/seizen-ui/api/datatable/type-aliases/datatablecolumn/)\<`TData`\>[]

Defined in: [packages/datatable-react/src/table/useDataTable.ts:40](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L40)

***

### data

> **data**: `TData`[]

Defined in: [packages/datatable-react/src/table/useDataTable.ts:39](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L39)

***

### enableMultiSelect?

> `optional` **enableMultiSelect**: `boolean`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:44](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L44)

***

### initialSelection?

> `optional` **initialSelection**: [`RowSelectionState`](/seizen-ui/api/datatable/type-aliases/rowselectionstate/)

Defined in: [packages/datatable-react/src/table/useDataTable.ts:43](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L43)

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`selection`) => `void`

Defined in: [packages/datatable-react/src/table/useDataTable.ts:45](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L45)

#### Parameters

##### selection

`TData`[]

#### Returns

`void`

***

### plugins?

> `optional` **plugins**: `DataTablePlugin`\<`any`\>[]

Defined in: [packages/datatable-react/src/table/useDataTable.ts:42](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/table/useDataTable.ts#L42)

Plugins to use. Plugins that don't use context menu can be DataTablePlugin<any>.
