# @fidel-tools/core

The core NLP pipeline and text pre-processing engine for Amharic and Ethiopic script processing.

---

## Features

- **Normalization**: Standardizes homophones, expands labialized strings, and collapses character gemination.
- **Tokenization**: Standard and sentence-level tokenizers with exception mapping (abbreviation expansion).
- **Stopwords**: Morphology-aware boundary filtering that removes stopwords safely without corrupting base stems.
- **Light Stemmer**: Prefix- and suffix-removal algorithms for root extraction.
- **Transliteration**: Bidirectional SERA and Felig ASCII transliterators.

---

## Installation

```bash
pnpm add @fidel-tools/core
```

---

## API & Usage

### 1. Unified Pipeline

```typescript
import { Pipeline } from '@fidel-tools/core'
import amPack from '@fidel-tools/lang-am' // Or your custom pack

const nlp = new Pipeline(amPack)

const normalized = nlp.normalize("ሐኪም ኀይሉ")
const tokens = nlp.lexAnalyze("ት/ቤት እና መስሪያ ቤት")
const stemmed = nlp.stem("ልጆቻቸውን")
```

### 2. Low-Level Component Exports

```typescript
import { normalize, sentenceTokenize, removeStopwords, stem } from '@fidel-tools/core'
import amPack from '@fidel-tools/lang-am'

// Individual functional components
const text = normalize("ሐኪም ኀይሉ", amPack)
const sentences = sentenceTokenize("ይህ ዓረፍተ ነገር ነው። ያኛው ደግሞ፡", amPack)
const cleaned = removeStopwords("እና በመሆኑም ትምህርት", amPack)
```

---

## License

[MIT License](../../LICENSE)
