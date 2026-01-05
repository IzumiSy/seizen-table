# Plugin System

## Motivation

Different use cases require different UI enhancements:

- Admin dashboards need bulk actions and row detail panels
- Data exploration apps need advanced filtering and search
- Analytics tools need column customization and export features

The plugin system allows these features to be added modularly.

## Layout

DataTable provides built-in sidepanels with IDE-style vertical tabs on both sides. Each plugin specifies which side to render on.

```
┌───────┬─────────────────────────────────────────────┬───────┐
│ [N]   │                                             │ [D]   │
│ [a]   │                                             │ [e]   │
│ [v]   │                                             │ [t]   │
│ [i]   │             Table Body                      │ [a]   │
│ [g]   │                                             │ [i]   │
│ [a]   │                                             │ [l]   │
│ [t]   ├─────────────────────────────────────────────┤ [s]   │
│ [e]   │                                             ├───────┤
│       │                                             │ [F]   │
│   ↑   │                                             │ [i]   │
│ left- │                                             │ [l]   │
│ sider │                                             │ [t]   │
│       │                                             │ [e]   │
│       │                                             │ [r]   │
│       │                                             │   ↑   │
│       │                                             │ right-│
│       │                                             │ sider │
└───────┴─────────────────────────────────────────────┴───────┘
```

| Position | Description |
|----------|-------------|
| `left-sider` | IDE-style vertical tab on the left side. Ideal for navigation, tree views. |
| `right-sider` | IDE-style vertical tab on the right side. Ideal for details, inspectors. |

Plugins can render modals/dialogs internally when needed.

## Plugin Usage

```tsx
import { DataTable } from "@izumisy/seizen-datatable-react";
import { RowDetail } from "@izumisy/seizen-datatable-plugin-row-detail";
import { FilterBuilder } from "@izumisy/seizen-datatable-plugin-filter";

function UsersTable() {
  return (
    <DataTable
      data={data}
      columns={columns}
      plugins={[
        // These will appear as vertical tabs in the sidepanel
        RowDetail.configure({ render: (row) => <UserDetail user={row} /> }),
        FilterBuilder.configure({ filterableColumns: ["name", "email"] }),
      ]}
    />
  );
}
```

See the `definePlugin` and `contextMenuItem` function documentation for detailed examples of creating custom plugins.
