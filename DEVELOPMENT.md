# Development

## Prerequisites

- Node.js 20+
- pnpm 9+

## Project Structure

```
seizen-table/
├── packages/
│   ├── core/              # SeizenTable component
└── apps/
    └── example-vite-app/  # Vite + React example app
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

The example app (`apps/example-vite-app`) demonstrates the usage of Seizen Table components.

```bash
# Start the example app
pnpm dev
```

This will start the Vite dev server at `http://localhost:5173`.
