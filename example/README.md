# Seizen Table Example

This package serves two purposes:

1. **Demo Application**: A standalone Vite + React app showcasing Seizen Table features
2. **Exportable Components**: Demo components that can be imported by the documentation site

## Build Pipeline

This package sits between the core libraries and the documentation site. See [DEVELOPMENT.md](../DEVELOPMENT.md) for the full build pipeline diagram.

### Two Build Modes

The package has two build configurations controlled by Vite's mode:

| Mode | Output | Purpose |
|------|--------|---------|
| `lib` | `dist/` | Library build - exports components for docs to import |
| default | `dist-app/` | App build - standalone demo app served at `/demos/` |

## Project Structure

```
example/
├── src/
│   ├── main.tsx         # App entry point
│   ├── App.tsx          # Main app component with routing
│   ├── index.ts         # Library exports
│   ├── styles.css.ts    # Vanilla Extract styles
│   └── components/      # Demo components
│       ├── BasicDemo.tsx
│       ├── FilterDemo.tsx
│       ├── ColumnControlDemo.tsx
│       ├── DataExportDemo.tsx
│       ├── RowDetailDemo.tsx
│       ├── ThemingDemo.tsx
│       └── FullDemo.tsx
├── dist/                # Library build output
├── dist-app/            # Standalone app build output
└── vite.config.ts       # Vite configuration with dual-mode setup
```

## Commands

| Command | Action |
|---------|--------|
| `pnpm dev` | Watch mode for library build (outputs to `dist/`) |
| `pnpm dev:app` | Start standalone demo app at `http://localhost:5174` |
| `pnpm build` | Build both library (`dist/`) and app (`dist-app/`) |
| `pnpm build:app` | Build standalone app only |
| `pnpm preview` | Preview the built app |
| `pnpm type-check` | Run TypeScript type checking |

## Usage

### As a Library (for docs)

The docs package imports this as a dependency:

```json
{
  "dependencies": {
    "@izumisy/seizen-table-example": "workspace:*"
  }
}
```

Then imports demo components:

```tsx
import { BasicDemo, FilterDemo } from "@izumisy/seizen-table-example";
```

### As a Standalone App

Run `pnpm dev:app` to start the development server at `http://localhost:5174`.

The app is served with base path `/seizen-table/demos/` to match the production deployment URL.

## Dependencies

- `@izumisy/seizen-table` - Core table component
- `@izumisy/seizen-table-plugins` - Official plugins (filter, column-control, file-export, row-detail)
- React 19
- Vite
- Vanilla Extract (for styling)
