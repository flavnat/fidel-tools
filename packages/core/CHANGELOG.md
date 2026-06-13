# @fidel-tools/core Changelog

All notable changes to this package will be documented in this file.

---

## [0.1.0] - 2026-06-13

### Added
- **Normalizer Stage**: Added character mapping, labialization mapping (e.g. `ቷ` -> `ቱዋ`), and configurable gemination collapse.
- **Sentence Tokenizer**: Added clean sentence boundary splitting.
- **Prefix-Aware Stopwords**: Rebuilt `removeStopwords` with prefix-aware boundaries to prevent root word corruption.
- **Integration Tests**: Comprehensive unit and end-to-end integration test coverage for the pipeline stages.
- **NPM Config**: Added `files` array and `publishConfig` for public registry distribution.
