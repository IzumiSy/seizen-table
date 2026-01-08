---
editUrl: false
next: false
prev: false
title: "PluginArgsRegistry"
---

Defined in: [usePluginControl.ts:23](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/usePluginControl.ts#L23)

Registry for plugin open() args types.

Plugin authors can extend this interface via module augmentation
to provide type-safe args for their plugins.

## Example

```typescript
// In your plugin file:
declare module "@izumisy/seizen-datatable-react/plugin" {
  interface PluginArgsRegistry {
    "my-plugin": { row: MyRowType; mode: "view" | "edit" };
  }
}
```
