---
editUrl: false
next: false
prev: false
title: "SlotType"
---

> **SlotType** = `"sidepanel"` \| `"header"` \| `"footer"` \| `"cell"` \| `"inlineRow"`

Defined in: [definePlugin.ts:30](https://github.com/IzumiSy/seizen-ui/blob/1438e15c4c2cea3ef870f9a542c4a18eb9cbd7fe/packages/datatable-react/src/plugin/definePlugin.ts#L30)

Slot types available for plugins to render components.

- `sidepanel`: IDE-style vertical tab sidepanel (left or right)
- `header`: Renders between table header and body rows
- `footer`: Renders below the table
- `cell`: Custom cell renderer applied to all columns (first match wins)
- `inlineRow`: Renders below a specific row when opened (first match wins)
