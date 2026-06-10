<p align="center">
  <img height="170" src="./Fidel.png" alt="Fidel logo" />
</p>
<h1 align="center">Fidel Tools</h1>
<p align="center">
  <strong>A modern toolkit for Amharic language pre-processing</strong>
</p>
<p align="center">
  <a href="https://fidel-tools.vercel.app/">Fidel Tools Web Demo</a>
</p>

---

## Overview

Fidel Tools is a pnpm workspace monorepo for Amharic NLP and text pre-processing. The current setup centers on two core pieces:

- `@fidel-tools/core`, which exposes the processing pipeline and individual algorithms.
- `@fidel-tools/lang-am`, which packages the Amharic language data used by the pipeline.

The toolkit covers lexical analysis, stopword removal, stemming, transliteration, document indexing, and term weighting.

## Core API

The main entry point is the `Pipeline` class from `@fidel-tools/core`. It accepts a `LanguagePack` and wraps the lower-level functions in a single interface:

- `stem(word)`
- `removeStopwords(corpus)`
- `lexAnalyze(corpus)`
- `feligTransliterate(word, lang)`
- `seraTransliterate(word, lang)`
- `indexDocuments(docs)`
- `indexQuery(query)`
- `weighTerms(index, type)`

The shared language pack types are defined in `packages/core/src/types.ts`:

- `LanguagePackMeta`
- `StemmerConfig`
- `TransliterationConfig`
- `LanguagePack`

## Amharic Language Pack

The `@fidel-tools/lang-am` package ships the Amharic pack as JSON and exports it for direct use with the pipeline.

It includes:

- Metadata for the language code, name, and script.
- Stopwords for filtering common function words.
- Abbreviations for lexical expansion.
- Stemmer prefix and suffix lists.
- Transliteration mappings for both SERA and Felig output.

Example usage:

```ts
import { Pipeline } from '@fidel-tools/core'
import amPack from '@fidel-tools/lang-am'

const nlp = new Pipeline(amPack)

const text = 'ት/ቤት እና መስሪያ ቤት'
const lexed = nlp.lexAnalyze(text)
const cleaned = nlp.removeStopwords(lexed)
const stem = nlp.stem('ልጆቻቸውን')

console.log({ lexed, cleaned, stem })
```

## Demo App

The web app includes an interactive preview console that exercises the pipeline against the Amharic pack. A lightweight mock file-system module is used in the preview layer so the UI can run without depending on browser file APIs during development and testing.

---

## Monorepo Architecture

```
fidel-tools/
├── package.json
├── pnpm-workspace.yaml
├── packages/
│   ├── core/
│   │   ├── src/
│   │   └── tests/
│   └── lang-am/
│       ├── am.json
│       └── index.ts
├── apps/
│   ├── api/
│   └── web/
└── docs/
```

### Workspace Relationships

```
packages/core  <──────────────  packages/lang-am
     ▲                               ▲
     │                               │
     ├────────────── apps/api        └────────── apps/web
```

- `apps/api` depends on `@fidel-tools/core` through the local workspace.
- `apps/web` depends on both `@fidel-tools/core` and `@fidel-tools/lang-am` for the preview console.
- pnpm links workspace packages automatically, so local changes are reflected immediately across the repo.

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org) v20+ recommended
- [pnpm](https://pnpm.io) v9+ recommended

### Setup

Install dependencies from the monorepo root:

```bash
pnpm install
```

### Workspace Commands

- Build everything: `pnpm build`
- Run tests: `pnpm test`
- Build the core package only: `pnpm --filter @fidel-tools/core build`
- Run core tests only: `pnpm --filter @fidel-tools/core test`
- Start the API: `pnpm --filter @fidel-tools/api dev`
- Start the web demo: `pnpm --filter @fidel-tools/web dev`

### Quick Start

```ts
import { Pipeline } from '@fidel-tools/core'
import amPack from '@fidel-tools/lang-am'

const nlp = new Pipeline(amPack)
console.log(nlp.removeStopwords('እና በመሆኑም ት/ቤት'))
```

---

## Attribution

The processing logic in this project draws on research and references in Amharic NLP and Ethiopic transliteration:

- [Girma Neshir Alemneh. “Amharic Light Stemmer”. ResearchGate. Sep 2020.](https://www.researchgate.net/publication/344285263_Amharic_Light_Stemmer)
- [Genet Mezemir Fikremariam. “Automatic Stemming for Amharic text: An experiment using successor variety approach”. AAU. Jan 2009.](http://etd.aau.edu.et/bitstream/handle/123456789/14590/Genet%20Mezemir.pdf?sequence=1&isAllowed=y)
- [Tessema Mindaye Mengistu. “Design and Implementation of Amharic Search Engine”. ResearchGate. August 2007.](https://www.researchgate.net/publication/323384408_Design_and_Implementation_of_Amharic_Search_Engine)
- [Yitna Firdyiwek and Daniel Yaqob. “The System for Ethiopic Representation in ASCII”. ResearchGate. Jan 1997.](https://www.researchgate.net/publication/2682324_The_System_for_Ethiopic_Representation_in_ASCII)

---

## License

This project is licensed under the [MIT License](LICENSE).
