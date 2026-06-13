# @fidel-tools/lang-am

The curated Amharic language pack and schema configuration for Fidel Tools.

---

## Features

Contains a comprehensive, schema-compliant definition of Amharic linguistic rules, containing:
- **`meta`**: Versioning, authors, and script information.
- **`normalization`**: Key-value pairs mapping Amharic homophones, labialized sequences (`ቷ` -> `ቱዋ`), and gemination repetition rules.
- **`tokenization`**: Sentence boundaries, punctuation, and `578+` abbreviation expansion rules.
- **`stopwords`**: A cleaned, academic stopword list containing `435+` unique words.
- **`stemmer`**: Prefix and suffix rules for light stemming, alongside protected terms (e.g. proper nouns like `ኢትዮጵያ`).
- **`transliteration`**: SERA and Felig ASCII transliteration schemas.

---

## Installation

```bash
pnpm add @fidel-tools/lang-am
```

---

## Usage

Pass the Amharic language pack into the `@fidel-tools/core` Pipeline:

```typescript
import { Pipeline } from '@fidel-tools/core'
import amPack from '@fidel-tools/lang-am'

const nlp = new Pipeline(amPack)
console.log(nlp.normalize("ሐኪም ኀይሉ")) // "ሃኪም ሃይሉ"
```

---

## License

[MIT License](../../LICENSE)
