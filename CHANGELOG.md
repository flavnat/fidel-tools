# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-06-13

### Added
- **Monorepo Architecture**: Setup pnpm workspaces containing `@fidel-tools/core` (engine), `@fidel-tools/lang-am` (language configuration), `@fidel-tools/validate-pack` (CLI validator), `@fidel-tools/web` (preview application), and `@fidel-tools/api`.
- **Schema-Driven Pipeline**: Decoupled processing logic from linguistic rules by storing all prefix, suffix, abbreviation, stopword, and character-mapping configurations in standard `am.json` files.
- **Normalizer Stage**: Added character mapping, labialization mapping (e.g. `ቷ` -> `ቱዋ`), and configurable gemination collapse.
- **Sentence Tokenizer**: Added clean sentence boundary splitting.
- **Pack Validator CLI**: Created the `@fidel-tools/validate-pack` CLI utility to enforce language pack schema consistency and cycle checks, featuring a `--fix` flag to automatically prune duplicates.
- **Prefix-Aware Stopwords**: Rebuilt `removeStopwords` with prefix-aware boundaries to prevent root word corruption.
- **Amharic Language Resources**: Expanded vocabulary to 435+ cleaned academic stopwords and 578+ token exceptions.
- **Integration Tests**: Comprehensive unit and end-to-end integration test coverage.
