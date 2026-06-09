<p align="center">
  <img height="170" src="./Fidel.png" alt="Fidel logo" />
</p>
<h1 align="center">Fidel Tools</h1>
<p align="center">
  <strong>A modern, unified developer toolkit for Amharic Language Pre-processing 🔧</strong>
</p>
<p align="center">
  <a href="https://github.com/Yehonatal/fidel-tools">Felig Tools Web (Live Demo)</a>
</p>

---

## What is Fidel Tools?

**Fidel Tools** is an all-in-one ecosystem for Amharic Natural Language Processing (NLP) and text pre-processing. Built for speed and reliability, it enables developers to analyze, stem, normalize, and index Amharic text corpora with ease.

### Features & Capabilities

- **Amharic Lexical Analyzer**: Tokenizes Amharic text by removing whitespace, expanding abbreviations (e.g., `አ.አ` &rarr; `አዲስ አበባ`), splitting hyphenated phrases, and filtering punctuation (`፡`, `።`, `!`, `?`, etc.).
- **Amharic Stopword Remover**: Filters semantic noise by stripping out common conjunctions and auxiliary words (e.g., `እና`, `ስለዚህ`, `በመሆኑም`).
- **Amharic Transliterator**: Normalizes and converts Unicode Ethiopic characters into clean ASCII equivalents using two systems:
  - **Felig (Recommended)**: Groups phonetically redundant characters into unified targets to maximize recall.
  - **SERA (System for Ethiopic Representation in ASCII)**: Strict character-to-symbol phonetic mapping.
- **Amharic Stemmer**: Recursively strips inflectional and derivational affixes from words using a longest-match algorithm to extract base stems (e.g., `ልጆች` &rarr; `ልጅ`).
- **Amharic Corpus Indexer**: Builds structural indexes mapping stemmed terms back to source documents and tracks local word frequencies.
- **Term Weighter (TF-IDF)**: Computes word weights across indexed documents using normalized Term Frequency & Inverse Document Frequency.

---

## Monorepo Architecture

Fidel Tools is structured as a **pnpm workspace monorepo**. This enables atomic development workflows where core libraries, APIs, and client interfaces remain in perfect lockstep.

```
fidel-tools/
├── package.json               ← pnpm workspace root configuration
├── pnpm-workspace.yaml        ← workspace directories declaration
├── .github/
│   └── workflows/
│       ├── test.yml           ← CI validation running on every PR
│       ├── publish-npm.yml    ← publishes @fidel-tools/core on release
│       └── deploy.yml         ← automates API (Docker) & Web builds on merge
│
├── packages/
│   ├── core/                  ← Core JavaScript/TypeScript SDK (@fidel-tools/core)
│   │   ├── src/               ← Library source files
│   │   ├── tests/             ← Jest test suite
│   │   └── package.json
│   │
│   └── python/                ← Python port of the core toolkit (fidel-tools)
│       ├── fidel_tools/       ← Python source package
│       ├── tests/             ← Python unit tests
│       └── pyproject.toml
│
├── apps/
│   ├── api/                   ← High-performance Hono REST API
│   │   ├── src/               
│   │   │   ├── routes/        ← Endpoint handlers
│   │   │   ├── middleware/    ← Auth & rate limiters
│   │   │   └── index.ts       
│   │   ├── Dockerfile         ← Container configuration
│   │   └── package.json       
│   │
│   └── web/                   ← React static landing page & demo app
│       ├── src/               
│       └── package.json       
│
└── docs/                      ← Documentation site (Docusaurus/Starlight)
    └── README.md
```

### Workspace Relationships

```
packages/core  <──────────────  apps/api
     ▲                               ▲
     │                          apps/web (calls API for interactive demo)
     │
packages/python  (independent Python port of core logic)
```

- `apps/api` depends on `@fidel-tools/core` as a local workspace dependency via `"@fidel-tools/core": "workspace:*"`.
- pnpm links dependencies automatically. When you modify `packages/core`, modifications are immediately reflected in `apps/api` during local development without needing an intermediate publication step.

---

## Tooling Choices

| Concern | Selected Tool | Why? |
| :--- | :--- | :--- |
| **Workspace Manager** | `pnpm Workspaces` | Built-in monorepo support, fast, disk-efficient dependency linking. |
| **API Framework** | `Hono` | Lightweight, fast execution, multi-runtime support (Node/Edge). |
| **Web Frontend** | `React + Vite` | Fast HMR, modular UI building, easy static deployments. |
| **Python Toolchain** | `pyproject.toml` + `hatchling` | Modern PEP 621 Python packaging standards. |
| **CI / CD** | `GitHub Actions` | Automated workspace testing, NPM publishing, and Docker builds. |
| **Containerization** | `Docker` | Containerized API runtime suited for cloud and self-hosted environments. |

---

## Development Guide

### Prerequisites
- [Node.js](https://nodejs.org) (v20+ recommended)
- [pnpm](https://pnpm.io) (v9+ recommended)

### Setup & Installation
At the monorepo root directory, run:
```bash
pnpm install
```
This installs all workspace dependencies and establishes local package symlinks.

### Workspace Commands

- **Build Core Package**:
  ```bash
  pnpm --filter @fidel-tools/core build
  ```
- **Run Unit Tests**:
  ```bash
  pnpm --filter @fidel-tools/core test
  ```
- **Run API Dev Server**:
  ```bash
  pnpm --filter @fidel-tools/api dev
  ```
- **Run Web Dev Server**:
  ```bash
  pnpm --filter @fidel-tools/web dev
  ```

---

## Attribution

To design and implement these pre-processing engines, the following academic research and publications were referenced:

- [Girma Neshir Alemneh. “Amharic Light Stemmer”. ResearchGate. Sep 2020.](https://www.researchgate.net/publication/344285263_Amharic_Light_Stemmer)
- [Genet Mezemir Fikremariam. ”Automatic Stemming for Amharic text: An experiment using successor variety approach”. AAU. Jan 2009.](http://etd.aau.edu.et/bitstream/handle/123456789/14590/Genet%20Mezemir.pdf?sequence=1&isAllowed=y)
- [Tessema Mindaye Mengistu. “Design and Implementation of Amharic Search Engine”. ResearchGate. August 2007.](https://www.researchgate.net/publication/323384408_Design_and_Implementation_of_Amharic_Search_Engine)
- [Yitna Firdyiwek and Daniel Yaqob. “The System for Ethiopic Representation in ASCII”. ResearchGate. Jan 1997.](https://www.researchgate.net/publication/2682324_The_System_for_Ethiopic_Representation_in_ASCII)

---

## License

This project is licensed under the [MIT License](LICENSE).
