---
editUrl: false
next: false
prev: false
title: "DefineSlotPluginOptions"
---

Defined in: [definePlugin.ts:202](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L202)

Options for defining a slot-based plugin

## Extends

- `BasePluginOptions`\<`TSchema`\>

## Type Parameters

### TData

`TData`

### TSchema

`TSchema` *extends* `z.ZodType`

## Properties

### args

> **args**: `TSchema`

Defined in: [definePlugin.ts:160](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L160)

Zod schema for configuration validation

#### Inherited from

`BasePluginOptions.args`

***

### contextMenuItems?

> `optional` **contextMenuItems**: `object`

Defined in: [definePlugin.ts:207](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L207)

Context menu items for cell and column

#### cell?

> `optional` **cell**: [`CellContextMenuItemFactory`](/seizen-ui/api/plugin/interfaces/cellcontextmenuitemfactory/)\<`TData`, `output`\<`TSchema`\>\>[]

#### column?

> `optional` **column**: [`ColumnContextMenuItemFactory`](/seizen-ui/api/plugin/interfaces/columncontextmenuitemfactory/)\<`TData`, `output`\<`TSchema`\>\>[]

***

### id

> **id**: `string`

Defined in: [definePlugin.ts:156](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L156)

Unique plugin identifier

#### Inherited from

`BasePluginOptions.id`

***

### name

> **name**: `string`

Defined in: [definePlugin.ts:158](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L158)

Plugin display name (used as vertical tab label for sidepanel plugins)

#### Inherited from

`BasePluginOptions.name`

***

### slots

> **slots**: [`DefinePluginSlots`](/seizen-ui/api/plugin/interfaces/definepluginslots/)\<`TData`, `TSchema`\>

Defined in: [definePlugin.ts:205](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L205)

Slot configurations
