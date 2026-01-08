---
editUrl: false
next: false
prev: false
title: "ColumnFilterMeta"
---

Defined in: [columnMeta.ts:126](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/columnMeta.ts#L126)

Column filter metadata - used to configure filtering for a column.
Add this to your column's `meta` property.

## Example

```tsx
const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: { filterType: "string" },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filterType: "enum",
      filterEnumValues: ["active", "inactive"],
    },
  },
];
```

## Properties

### filterEnumValues?

> `optional` **filterEnumValues**: `string`[]

Defined in: [columnMeta.ts:138](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/columnMeta.ts#L138)

Enum values for enum type columns.
Required when filterType is "enum"

***

### filterOperators?

> `optional` **filterOperators**: [`FilterOperator`](/seizen-ui/api/plugin/type-aliases/filteroperator/)[]

Defined in: [columnMeta.ts:133](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/columnMeta.ts#L133)

Custom operators to use instead of defaults.
If not provided, uses DEFAULT_FILTER_OPERATORS[filterType]

***

### filterType?

> `optional` **filterType**: [`FilterType`](/seizen-ui/api/plugin/type-aliases/filtertype/)

Defined in: [columnMeta.ts:128](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/columnMeta.ts#L128)

Filter type - determines available operators and input UI
