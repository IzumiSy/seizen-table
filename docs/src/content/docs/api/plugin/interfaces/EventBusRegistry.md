---
editUrl: false
next: false
prev: false
title: "EventBusRegistry"
---

Defined in: [useEventBus.ts:32](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/useEventBus.ts#L32)

Registry for custom event types.

Plugin authors can extend this interface via module augmentation
to provide type-safe custom events.

## Example

```typescript
// In your plugin file:
declare module "@izumisy/seizen-datatable-react/plugin" {
  interface EventBusRegistry {
    "my-plugin:action": { itemId: string; action: "create" | "delete" };
    "my-plugin:complete": { success: boolean };
  }
}
```

## Extended by

- [`DataTableEventMap`](/seizen-ui/api/plugin/interfaces/datatableeventmap/)
