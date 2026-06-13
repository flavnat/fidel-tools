# @fidel-tools/validate-pack

The automated CLI validation and linting tool for verifying schema correctness, duplicate rules, and cyclic maps in Fidel Tools language packs.

---

## Features

- **Schema Check**: Ensures language pack JSON files conform to the `LanguagePack` TypeScript interface.
- **Cycle Detection**: Analyzes character mappings (`char_map`, `labialized_map`) to identify circular references (e.g. `A -> B -> A`) that would lead to infinite loops.
- **Consistency Enforcement**: Checks that protected words are not flagged as stopwords.
- **Clean Rule Lists**: Detects duplicates in prefix, suffix, and stopword arrays.
- **Auto-Fix Flag**: Includes a `--fix` option to automatically deduplicate arrays and resolve configuration overlaps.

---

## Installation

```bash
pnpm add -g @fidel-tools/validate-pack
```

---

## CLI Usage

### Run Validation

Check your language pack config:
```bash
validate-pack ./path/to/am.json
```

### Run Auto-Fix

Automatically resolve duplicates and overlaps in the JSON pack:
```bash
validate-pack --fix ./path/to/am.json
```

---

## Programmatic API

```typescript
import { validatePack, fixPack } from '@fidel-tools/validate-pack'
import amPack from '@fidel-tools/lang-am'

// Validate pack
const result = validatePack(amPack)
console.log(result.isValid) // true

// Fix pack
const { fixedPack, fixedCount } = fixPack(amPack)
```

---

## License

[MIT License](../../LICENSE)
