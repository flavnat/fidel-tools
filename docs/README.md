# Fidel Tools Documentation Workspace

This directory will contain the developer documentation site for Fidel Tools, using a documentation site builder like Astro Starlight or Docusaurus.

## Content Structure

- `/docs` - Markdown and MDX documents
  - `index.md` - Homepage
  - `getting-started/` - Setup, installation, and run guide
  - `packages/` - Core Node.js API and Python port references
  - `api/` - REST API specification and examples
  - `playground/` - Integration details for the live demo playground
- `/src` - Custom custom layouts, components, and styling
- `package.json` - Documentation workspace dependencies and build scripts

## Getting Started

To run the documentation site locally:

```bash
pnpm --filter docs dev
```
