# Development

## Prerequisites

- Node.js 24+
- pnpm 10+

## Project Structure

```
seizen-table/
├── packages/
│   ├── core/           # @izumisy/seizen-table - Core table component
│   └── plugins/        # @izumisy/seizen-table-plugins - Official plugins
├── example/            # @izumisy/seizen-table-example - Demo app & exportable components
└── docs/               # Documentation site (Astro + Starlight)
```

### Packages

| Package | Description |
|---------|-------------|
| `@izumisy/seizen-table` | Core table component built on TanStack Table |
| `@izumisy/seizen-table-plugins` | Official plugins (filter, column-control, file-export, row-detail) |
| `@izumisy/seizen-table-example` | Demo application with example components |

## Build Pipeline

The project uses [Turborepo](https://turbo.build/) to orchestrate builds with proper dependency ordering:

- **packages/core** → Base dependency for all other packages
- **packages/plugins** → Depends on core
- **example** → Depends on core and plugins; builds both a library (for docs) and a standalone app
  - `dist/` - Exportable component set (imported by docs)
  - `dist-app/` - Standalone demo app
- **docs** → Depends on example's `dist/` (component set)

## Setup

```bash
# Install dependencies
pnpm install
```

## Commands

All commands should be run from the repository root to ensure proper dependency resolution via Turborepo.

```bash
# Build all packages (in dependency order)
pnpm build

# Run tests
pnpm test

# Type check all packages
pnpm type-check

# Start documentation site with all packages in watch mode (http://localhost:4321)
pnpm dev

# Start only example with library watch build + dev server (http://localhost:5174)
pnpm dev:example
```

## Useful Links

- [Astro Documentation](https://docs.astro.build)
- [Starlight Documentation](https://starlight.astro.build/)
- [TanStack Table Documentation](https://tanstack.com/table)
