---
editUrl: false
next: false
prev: false
title: "useEventBus"
---

> **useEventBus**(): `object`

Defined in: [useEventBus.ts:131](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L131)

Hook to create an event bus for plugin communication.

This provides a simple pub/sub mechanism that allows the application
to communicate with plugins without tight coupling.

## Returns

### emit()

> **emit**: \<`K`\>(`event`, `payload`) => `void`

Emit an event to all subscribers

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

### subscribe()

> **subscribe**: \<`K`\>(`event`, `callback`) => () => `void`

Subscribe to an event

#### Type Parameters

##### K

`K` *extends* keyof DataTableEventMap\<unknown\> \| `string` & `object`

#### Parameters

##### event

`K`

##### callback

(`payload`) => `void`

#### Returns

Unsubscribe function

> (): `void`

##### Returns

`void`

## Example

```tsx
// In useDataTable:
const eventBus = useEventBus();

// Application emits events:
eventBus.emit("row-click", row);

// Plugins subscribe via usePluginContext:
const { useEvent } = usePluginContext();
useEvent("row-click", (row) => {
  console.log("Row clicked:", row);
});
```
