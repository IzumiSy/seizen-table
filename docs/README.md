# Seizen Table Documentation

This package contains the documentation site for Seizen Table, built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/).

## Build Pipeline

This documentation site depends on the `@izumisy/seizen-table-example` package for demo components and assets. See [DEVELOPMENT.md](../DEVELOPMENT.md) for the full build pipeline diagram.

During the build process:
1. The `example` package builds its demo app to `dist-app/`
2. This docs site copies the demo assets from `example/dist-app/assets/` to `public/demos/assets/`
3. The `/demos/` page in docs loads these assets via iframe

## Project Structure

```
docs/
├── public/
│   └── demos/
│       └── assets/        # Copied from example/dist-app/assets during build
├── src/
│   ├── assets/            # Images and static assets
│   ├── components/        # React components for documentation
│   ├── content/
│   │   └── docs/          # MDX documentation files
│   ├── pages/
│   │   └── demos/         # Demo pages
│   └── styles/            # Custom CSS
├── astro.config.mjs       # Astro configuration with TypeDoc plugins
└── package.json
```

## Commands

All commands are run from the `docs/` directory:

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local dev server at `localhost:4321` |
| `pnpm build` | Build production site to `./dist/` |
| `pnpm preview` | Preview build locally before deploying |
| `pnpm type-check` | Run Astro type checking |

## Features

- **Starlight**: Documentation framework with sidebar navigation, search, and theming
- **TypeDoc Integration**: Auto-generated API documentation from TypeScript source
- **Link Validation**: Automated link checking via `starlight-links-validator`
- **LLM Support**: Generated `llms.txt` for AI assistants via `starlight-llms-txt`

## Learn More

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
