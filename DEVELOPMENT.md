# Development

## Prerequisites

- Node.js 20+
- pnpm 9+

## Project Structure

```
seizen-ui/
├── packages/
│   ├── datatable-react/          # DataTable component
│   └── command-palette-react/    # Command palette component
└── examples/
    └── vite-app/                 # Vite + React example app
```

## Setup

```bash
# Install dependencies
pnpm install
```

## Commands

```bash
# Build all packages
pnpm build

# Run tests
pnpm test
```

## Example App

The example app (`examples/vite-app`) demonstrates the usage of Seizen UI components.

```bash
# Start the example app
pnpm dev
```

This will start the Vite dev server at `http://localhost:5173`.
