---
editUrl: false
next: false
prev: false
title: "DefinePluginSlots"
---

Defined in: [definePlugin.ts:166](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L166)

Slot render function definitions for defineSlotPlugin

## Type Parameters

### TData

`TData`

### TSchema

`TSchema` *extends* `z.ZodType`

## Properties

### cell?

> `optional` **cell**: `object`

Defined in: [definePlugin.ts:182](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L182)

Cell slot - custom cell renderer for all columns (first match wins)

#### render()

> **render**: (`context`) => (`cell`, `column`, `row`) => `ReactNode`

##### Parameters

###### context

[`PluginContext`](/seizen-ui/api/plugin/interfaces/plugincontext/)\<`output`\<`TSchema`\>\>

##### Returns

> (`cell`, `column`, `row`): `ReactNode`

###### Parameters

###### cell

`Cell`\<`TData`, `unknown`\>

###### column

`Column`\<`TData`, `unknown`\>

###### row

`Row`\<`TData`\>

###### Returns

`ReactNode`

***

### footer?

> `optional` **footer**: `object`

Defined in: [definePlugin.ts:178](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L178)

Footer slot - renders below the table

#### render()

> **render**: (`context`) => () => `ReactNode`

##### Parameters

###### context

[`PluginContext`](/seizen-ui/api/plugin/interfaces/plugincontext/)\<`output`\<`TSchema`\>\>

##### Returns

> (): `ReactNode`

###### Returns

`ReactNode`

***

### header?

> `optional` **header**: `object`

Defined in: [definePlugin.ts:174](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L174)

Header slot - renders between table header and body

#### render()

> **render**: (`context`) => () => `ReactNode`

##### Parameters

###### context

[`PluginContext`](/seizen-ui/api/plugin/interfaces/plugincontext/)\<`output`\<`TSchema`\>\>

##### Returns

> (): `ReactNode`

###### Returns

`ReactNode`

***

### inlineRow?

> `optional` **inlineRow**: `object`

Defined in: [definePlugin.ts:192](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L192)

Inline row slot - renders below a specific row when opened (first match wins)

#### render()

> **render**: (`context`) => (`row`) => `ReactNode`

##### Parameters

###### context

[`PluginContext`](/seizen-ui/api/plugin/interfaces/plugincontext/)\<`output`\<`TSchema`\>\>

##### Returns

> (`row`): `ReactNode`

###### Parameters

###### row

`Row`\<`TData`\>

###### Returns

`ReactNode`

***

### sidepanel?

> `optional` **sidepanel**: `object`

Defined in: [definePlugin.ts:168](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L168)

Sidepanel slot - renders in left or right sidepanel

#### header?

> `optional` **header**: `string` \| (`context`) => `ReactNode`

#### position

> **position**: [`PluginPosition`](/seizen-ui/api/plugin/type-aliases/pluginposition/)

#### render()

> **render**: (`context`) => () => `ReactNode`

##### Parameters

###### context

[`PluginContext`](/seizen-ui/api/plugin/interfaces/plugincontext/)\<`output`\<`TSchema`\>\>

##### Returns

> (): `ReactNode`

###### Returns

`ReactNode`
