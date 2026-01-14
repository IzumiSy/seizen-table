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

```bash
# Build all packages (in dependency order)
pnpm build

# Run tests
pnpm test

# Type check all packages
pnpm type-check

# Start development mode (all packages in watch mode)
pnpm dev
```

## Development Workflow

### Working on Core/Plugins

```bash
# Start watching core package changes
cd packages/core && pnpm dev

# In another terminal, start watching plugins
cd packages/plugins && pnpm dev
```

### Working on Example App

```bash
cd example

# Start the standalone demo app (http://localhost:5174)
pnpm dev:app

# Build for library export (used by docs)
pnpm dev
```

### Working on Documentation

```bash
cd docs

# Start the docs dev server (http://localhost:4321)
pnpm dev

# Build the documentation site
pnpm build
```

## Useful Links

- [Astro Documentation](https://docs.astro.build)
- [Starlight Documentation](https://starlight.astro.build/)
- [TanStack Table Documentation](https://tanstack.com/table)
