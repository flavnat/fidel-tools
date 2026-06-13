<p align="center">
  <img height="150" src="./Fidel.png" alt="Fidel Tools logo" />
</p>

<h1 align="center">Fidel Tools</h1>

<p align="center">
  <strong>The Developer-Friendly, Schema-Driven NLP Pipeline for Amharic Text Pre-processing.</strong>
</p>

<p align="center">
  <a href="https://github.com/Yehonatal/fidel-tools/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
  <a href="https://www.npmjs.com/package/@fidel-tools/core"><img src="https://img.shields.io/npm/v/@fidel-tools/core.svg" alt="NPM Version" /></a>
  <a href="https://fidel-tools.vercel.app/"><img src="https://img.shields.io/badge/demo-live-brightgreen.svg" alt="Live Demo" /></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/maintained%20with-pnpm-ff69b4.svg" alt="pnpm" /></a>
</p>

---

## The Amharic NLP Challenge

Amharic (Fidel script) is spoken by over **50 million people** globally, yet it remains critically underserved in the modern Natural Language Processing (NLP) ecosystem. Building search engines, search indexers, sentiment analyzers, or LLM-preprocessors for Amharic is historically challenging due to:
* **Rich morphology**: Highly complex prefixing and suffixing.
* **Orthographic variations**: Homophones and labialized characters (e.g. `ቷ` to `ቱዋ`).
* **Lack of developer tooling**: Few high-performance, lightweight pre-processing runtimes in TypeScript or JavaScript.

**Fidel Tools** is the first enterprise-grade, schema-driven monorepo toolkit designed to normalize, tokenize, clean, stem, and transliterate Amharic text with academic precision and runtime efficiency.

---

## Features

*  **Schema-Driven Architecture**: The entire pipeline configuration (stopwords, transliteration rules, stemmer affixes, token exceptions) is driven by a standardized JSON schema. No hardcoded logic.
*  **Advanced Normalization**: Resolves homophone characters, expands complex labialized sequences, and collapses character-repetition gemination (e.g. social media repetitions).
*  **Sentence & Word Tokenization**: Clean sentence boundary splitting combined with abbreviation expansion leveraging a built-in database of 570+ standard contractions.
*  **Morphology-Aware Stopword Filtering**: Filters out 430+ academic stopwords using prefix-aware boundary rules (e.g. removing `ተጨማሪ` from `የተጨማሪ` while keeping the preposition `የ`) without corrupting root strings.
*  **Lightweight Stemmer**: Longest-match affix-removal algorithms that extract root forms based on sorted prefix and suffix tables.
*  **Ethiopic Transliteration**: Full support for bidirectional SERA (System for Ethiopic Representation in ASCII) and Felig mappings.
*  **Search Utilities**: Built-in document indexing and TF-IDF term-weighting wrappers.
*  **Developer Guardrails**: A formal validator CLI (`@fidel-tools/validate-pack`) that enforces schema compliance, cycle detection, and includes a `--fix` flag to automatically repair duplicates or configuration overlaps.

---

## Monorepo Architecture

Fidel Tools is structured as a pnpm workspace monorepo:

```text
fidel-tools/
├── packages/
│   ├── core/            # High-performance processing runtime (TS)
│   ├── lang-am/         # Curated Amharic language pack and schema config
│   └── validate-pack/   # CLI validator for verifying and fixing language packs
├── apps/
│   └── web/             # Interactive React/Next.js playground & visual console
└── docs/                # Architectural diagrams and developer checklist
```

---

## Quick Start

### Installation

Install the core runtime and Amharic language pack:

```bash
pnpm add @fidel-tools/core @fidel-tools/lang-am
```

### Basic Usage

Instantiate the pipeline with the Amharic pack:

```typescript
import { Pipeline } from '@fidel-tools/core'
import amPack from '@fidel-tools/lang-am'

// Initialize the schema-driven pipeline
const nlp = new Pipeline(amPack)

// 1. Normalization (Homophones, labialization, gemination)
const rawText = "ሐኪም ኀይሉ በልቷልልል!"
const normalized = nlp.normalize(rawText)
console.log(normalized) // "ሃኪም ሃይሉ በልቱዋልል!"

// 2. Tokenization & Abbreviation Expansion
const sentences = nlp.sentenceTokenize("ይህ የመጀመሪያው ዓረፍተ ነገር ነው። ሁለተኛው ደግሞ ት/ቤት ይከተላል፡")
console.log(sentences)
// [
//   "ይህ የመጀመሪያው ዓረፍተ ነገር ነው",
//   "ሁለተኛው ደግሞ ትምህርት ቤት ይከተላል"
// ]

// 3. Stopword Filtering (Using prefix-aware rules)
const textWithStopwords = "ያወጣውን የተጨማሪ እሴት"
const cleaned = nlp.removeStopwords(textWithStopwords)
console.log(cleaned) // "ያወጣውን የ እሴት" (leaves preposition 'የ' intact, removes 'ተጨማሪ')

// 4. Stemming
const stem = nlp.stem("ልጆቻቸውን")
console.log(stem) // "ልጅ"
```

---

## Tooling & Validation

To guarantee runtime stability, the `@fidel-tools/validate-pack` package parses language packs and validates schema constraints, duplicate entries, and loops.

### Validate a Pack
```bash
pnpm --filter @fidel-tools/validate-pack validate
```

### Auto-Fix Warnings and Duplicates
If you modify `am.json` and introduce warnings (e.g. duplicate affixes or stopwords), run the validator with the `--fix` flag to resolve them automatically:
```bash
pnpm --filter @fidel-tools/validate-pack validate -- --fix
```

---

## Development & Testing

### Prerequisites
* **Node.js**: v20 or later
* **pnpm**: v9 or later

### Local Setup
```bash
# Clone the repository
git clone https://github.com/Yehonatal/fidel-tools.git
cd fidel-tools

# Install workspace dependencies
pnpm install

# Build all workspace packages
pnpm build

# Run all test suites
pnpm test
```

---

## Academic & Research Foundations

The processing logic in this project draws on research and references in Amharic NLP and Ethiopic transliteration:

- [Girma Neshir Alemneh. “Amharic Light Stemmer”. ResearchGate. Sep 2020.](https://www.researchgate.net/publication/344285263_Amharic_Light_Stemmer)
- [Genet Mezemir Fikremariam. “Automatic Stemming for Amharic text: An experiment using successor variety approach”. AAU. Jan 2009.](http://etd.aau.edu.et/bitstream/handle/123456789/14590/Genet%20Mezemir.pdf?sequence=1&isAllowed=y)
- [Tessema Mindaye Mengistu. “Design and Implementation of Amharic Search Engine”. ResearchGate. August 2007.](https://www.researchgate.net/publication/323384408_Design_and_Implementation_of_Amharic_Search_Engine)
- [Yitna Firdyiwek and Daniel Yaqob. “The System for Ethiopic Representation in ASCII”. ResearchGate. Jan 1997.](https://www.researchgate.net/publication/2682324_The_System_for_Ethiopic_Representation_in_ASCII)

---

## Contributing

We welcome contributions to expand coverage for other Ethiopic script languages (e.g. Tigrinya, Ge'ez). Please read our [Contributing Guide](CONTRIBUTING.md) and [Changelog](CHANGELOG.md) to get started.

---

## License

Licensed under the [MIT License](LICENSE). Developed and maintained by the Fidel Tools Team.
