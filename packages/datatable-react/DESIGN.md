# DataTable Design Document

This document outlines the architecture and design decisions for `@izumisy/seizen-datatable-react`.

## Overview

The DataTable is designed as a modular, enterprise-grade table component with three core pillars:

1. **Core** - Headless table logic powered by TanStack Table
2. **DataAdapter** - Abstracted data fetching layer
3. **Plugin** - Extensible UI customization system

```
┌─────────────────────────────────────────────────────────────┐
│                        DataTable                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Core     │  │ DataAdapter │  │       Plugins       │  │
│  │             │  │             │  │                     │  │
│  │ TanStack    │◄─┤ GraphQL     │  │ SearchPanel         │  │
│  │ Table       │  │ REST/OpenAPI│  │ SidePanel           │  │
│  │             │  │ SQL         │  │ SheetView           │  │
│  │             │  │ Custom      │  │ ColumnCustomizer    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Documentation

- [DataAdapter](docs/data-adapter.md) - Abstracted data fetching layer for GraphQL, REST, SQL, etc.
- [Plugin System](docs/plugin.md) - Extensible UI customization system

---

## Package Structure

```
packages/
├── datatable-react/           # Core component
│   ├── src/
│   │   ├── table/             # DataTable component and hooks
│   │   └── plugin/            # Plugin definition utilities
│   └── docs/                  # Design documents
│
├── datatable-adapter-graphql/ # GraphQL adapter
├── datatable-adapter-rest/    # REST/OpenAPI adapter
├── datatable-adapter-sql/     # SQL adapter
│
├── datatable-plugin-search/   # Search panel plugin
├── datatable-plugin-sidepanel/# Side panel plugin
├── datatable-plugin-sheet/    # Sheet view plugin
└── datatable-plugin-columns/  # Column customizer plugin
```

---

## Open Questions

1. **Adapter state management**: Should adapters use their own state or integrate with external state managers (Zustand, Jotai)?

2. **Plugin styling**: Should plugins ship with styles or be completely headless?

3. **Server-side operations**: How to handle server-side sorting/filtering in a way that's adapter-agnostic?

4. **Plugin composition**: Should plugins be able to depend on or communicate with other plugins?

---

## Future Considerations

- **Virtualization**: Integration with TanStack Virtual for large datasets
- **Real-time updates**: WebSocket/SSE support in adapters
- **Collaborative editing**: OT/CRDT support for multi-user scenarios
- **Accessibility**: Full ARIA support and keyboard navigation
