# ፊደል Tools — Full Development Path to Finished Product

> Every checkbox reflects the actual state of `github.com/Yehonatal/fidel-tools`
> as of the audit. ✅ = done. ⚠️ = partial. [ ] = not started.

---

## Phase 0 — Foundation (Monorepo & Architecture)

### Repo Structure
- ✅ pnpm monorepo with `pnpm-workspace.yaml`
- ✅ `packages/core/` created
- ✅ `packages/lang-am/` created
- ✅ `packages/python/` scaffolded
- ✅ `apps/api/` created
- ✅ `apps/web/` created
- ✅ `docs/` directory created
- ✅ Root `package.json` with workspace build/test scripts
- ✅ `.gitignore` configured
- ✅ `LICENSE` (MIT)
- [ ] `CONTRIBUTING.md` — contributor guide
- [ ] `CHANGELOG.md` — version history

### CI/CD
- ✅ `test.yml` — runs on push/PR to main
- ✅ `publish-npm.yml` — publishes `@fidel-tools/core` on release
- ✅ `deploy.yml` — Docker build for API + web deploy on main push
- ⚠️ `test.yml` only runs on `main` — should also run on all branch pushes and PRs
- [ ] `publish-npm.yml` does not publish `@fidel-tools/lang-am` — needs to publish both
- [ ] Python publish workflow (`publish-pypi.yml`)
- [ ] Test coverage reporting (Codecov or similar idk abel will decide these cases)

---

## Phase 1 — Core Library (`@fidel-tools/core`)

### Architecture Refactor ✅ COMPLETE
- ✅ `types.ts` — `LanguagePack`, `StemmerConfig`, `TransliterationConfig` interfaces
- ✅ `pipeline.ts` — `Pipeline` class binding pack to all functions
- ✅ `index.ts` — clean exports of all types, Pipeline, and individual functions
- ✅ All hardcoded Amharic data removed from source files
- ✅ All functions accept `pack: LanguagePack` parameter
- ✅ `stemmer.ts` — `sfx_arr`/`pfx_arr` mutation bug fixed (arrays declared inside `stem()`)
- ✅ `stopword_remover.ts` — uses `replaceAll` instead of `replace`
- ✅ `indexer.ts` — `DocIndexData`/`QueryIndexData` interfaces, pure functions + compat wrapper
- ✅ `term_weighter.ts` — pure `weighTerms` + compat `weigh_terms` wrapper
- ✅ `transliterator.ts` — reads from `pack.transliteration`
- ✅ `lexical_analyzer.ts` — reads from `pack.abbreviations`
- ✅ `package.json` — correct repo URL, author set to "Yehonatal", version 2.0.1

### Remaining Core Bugs
- ⚠️ `indexer.ts` still imports `fs` at the top of the main file — should be in the compat wrapper only
- ⚠️ `term_weighter.ts` still imports `fs` at the top of the main file — same issue
- ⚠️ `lexical_analyzer.ts` abbreviation loop uses `replace` not `replaceAll` — only first occurrence expanded
- ⚠️ Regex injection: `new RegExp(`${key}`)` in `lexical_analyzer.ts` and the old stopword remover — special chars in keys could break
- ⚠️ `types.ts` still uses old schema (`suffix_list`/`prefix_list` strings, flat `sera`/`felig`) — doesn't match the new `am.json` format with `prefixes[]`/`suffixes[]` arrays and nested scheme objects
- [ ] `@babel/core` listed as a runtime dependency — should be devDependency

### Tests
- ✅ `stemmer.test.js` — updated to pass `amPack`
- ✅ `stopword_remover.test.js` — updated to pass `amPack`
- ✅ `lexical_analyzer.test.js` — present
- ✅ `transliterator.test.js` — present
- [ ] `indexer` tests — no test file exists
- [ ] `term_weighter` tests — no test file exists
- [ ] `pipeline.ts` integration test — no end-to-end test

---

## Phase 1 — Language Pack (`@fidel-tools/lang-am`)

### Current State
- ✅ `am.json` exists with stopwords (111), abbreviations (39), stemmer lists, transliteration maps (287 entries each)
- ✅ `index.ts` — loads and exports JSON with correct type
- ✅ `package.json` — correct name, workspace dependency on core
- ✅ `am.json` is still in the **old schema** — missing `normalization`, `tokenization`, `numbers`, `sentiment`, `ner` blocks; `meta` missing `native_name`, `version`, `authors`; stemmer still uses `suffix_list`/`prefix_list` pipe-strings instead of `prefixes[]`/`suffixes[]` arrays
- ✅ `types.ts` in core needs to be updated to match the new schema before `lang-am` can be fully used

---

## Phase 1 — Web App (`apps/web`)

### Landing Page
- ✅ Coming-soon page live at `fidel-tools.vercel.app`
- ✅ Countdown timer to July 9, 2026
- ✅ Email capture form
- ✅ Light/dark theme toggle
- ✅ About and Terms modals
- ✅ GitHub link
- ✅ Free/Premium badge indicators

### Preview / Demo Console
- ✅ `PreviewPage.tsx` exists — full demo console built
- ✅ `Pipeline` imported and instantiated directly in the browser (no API call needed)
- ✅ Tabs: Pipeline, Stemmer, Stopword Remover, Lexical Analyzer, Transliterator
- ✅ `LexicalTab.tsx`, `StemmerTab.tsx`, `StopwordTab.tsx`, `TransliteratorTab.tsx`, `PipelineTab.tsx`
- ✅ Code snippet copy button per tab
- ✅ Language/scheme selectors for transliterator
- [ ] Demo console not yet reachable from landing page (no nav link or button to open it)
- [ ] Mobile layout polish
- [ ] Error handling when input is empty or invalid
- [ ] Loading state while Pipeline initializes

---

## Phase 1 — REST API (`apps/api`)

- ✅ Hono framework installed and running
- ✅ Dockerfile written (multi-stage, production-ready)
- ✅ Docker build + push wired in CI
- ⚠️ API is a stub — only `GET /` returning a text string
- [ ] Import and wire `@fidel-tools/core` + `@fidel-tools/lang-am`
- [ ] `POST /stem` — `{ word: string }` → `{ stem: string }`
- [ ] `POST /tokenize` — `{ text: string }` → `{ tokens: string[] }`
- [ ] `POST /transliterate` — `{ word: string, direction: "am-en"|"en-am", scheme: "felig"|"sera" }` → `{ result: string }`
- [ ] `POST /stopwords/remove` — `{ text: string }` → `{ result: string }`
- [ ] `POST /analyze` — `{ text: string }` → `{ result: string }` (lexical analysis)
- [ ] `POST /pipeline` — `{ text: string, steps: string[] }` → full pipeline output
- [ ] `POST /index` — `{ docs: [{id, content}] }` → index data
- [ ] `POST /weigh` — `{ index: object, type: string }` → weighted terms
- [ ] `GET /health` — health check endpoint
- [ ] Input validation (Zod or Hono validator)
- [ ] Error handling middleware
- [ ] CORS middleware
- [ ] Request logging
- [ ] API deployed to a live URL (Railway, Fly.io, or Render)

---

## Phase 1 — Python Package (`packages/python`)

- ✅ `pyproject.toml` scaffolded with correct metadata
- ✅ `fidel_tools/__init__.py` exists
- ⚠️ `__init__.py` is empty — no actual code
- [ ] Port `stem()` to Python
- [ ] Port `removeStopwords()` to Python
- [ ] Port `lexAnalyze()` to Python
- [ ] Port `felig_transliterate()` / `sera_transliterate()` to Python
- [ ] Load `am.json` as the Amharic language pack
- [ ] `Pipeline` class in Python
- [ ] Python tests (`tests/` directory)
- [ ] Publish to PyPI as `fidel-tools`

---

## Phase 2 — Stabilization & Quality

### Schema & Type Alignment
- [ ] Update `types.ts` in core to match new `am.json` schema:
  - `stemmer.prefixes: string[]` and `stemmer.suffixes: string[]` (arrays, not pipe strings)
  - `stemmer.protected_words: string[]`
  - `normalization.char_map`, `normalization.labialized_map`, `normalization.gemination_threshold`
  - `tokenization.split_on_spaces`, `tokenization.sentence_boundaries`, `tokenization.punctuation`, `tokenization.exceptions`
  - `transliteration.sera.scheme` + `transliteration.sera.map` (nested)
  - `transliteration.felig.scheme` + `transliteration.felig.map` (nested)
  - `numbers.ethiopic_to_arabic`
  - Optional: `sentiment`, `ner`
- [ ] Update `stemmer.ts` to use `pack.stemmer.prefixes` and `pack.stemmer.suffixes` arrays directly (no more split on `|`)
- [ ] Update `transliterator.ts` to read from `pack.transliteration.felig.map` and `pack.transliteration.sera.map`
- [ ] Commit the new `am.json` (with normalization, tokenization, numbers, sentiment, ner blocks)

### New Pipeline Components (from new schema)
- [ ] `normalizer.ts` — apply `pack.normalization.char_map` and `pack.normalization.labialized_map` before tokenization
- [ ] `sentence_tokenizer.ts` — split on `pack.tokenization.sentence_boundaries`; expose `sentenceTokenize(text, pack): string[]`
- [ ] Wire `Normalizer` into `Pipeline` class as first step
- [ ] Wire `SentenceTokenizer` into `Pipeline` class
- [ ] Add `Pipeline.normalize(text)` and `Pipeline.sentenceTokenize(text)` methods

### Language Pack Quality
- [ ] Expand stopword list from 111 to 400+ entries (cross-reference academic Amharic NLP corpora)
- [ ] Fix duplicate stopwords in current list (`እና`, `ወይም`, `ብቻ`, `ሌላ`, `ስለዚህ`, `ተጨማሪ`, `በጣም`, `ወይም` appear twice)
- [ ] Expand abbreviation list — current 39 entries is thin; target 100+
- [ ] Add `protected_words` to stemmer (at minimum: `ኢትዮጵያ`, `አፍሪካ`, `አዲስ አበባ`)
- [ ] Complete labialized sequence coverage in `normalization.labialized_map`
- [ ] Add gemination normalization logic using `gemination_threshold`

### Pack Validation Tool
- [ ] `packages/validate-pack/` — new package
- [ ] JSON schema for `LanguagePack`
- [ ] CLI: `npx @fidel-tools/validate-pack ./am.json`
- [ ] Checks: required fields, no duplicate stopwords, no empty abbreviation values, no empty-key transliteration entries, char_map has no cycles
- [ ] Smoke test: instantiate `Pipeline` with the pack, run sample text through all components

### API Authentication
- [ ] API key generation and storage (Supabase recommended)
- [ ] Auth middleware for Hono — validate `X-API-Key` header
- [ ] Rate limiting per key per tier
- [ ] `POST /keys` endpoint (or admin-only key management)
- [ ] Usage tracking per key (request count, endpoint breakdown)

---

## Phase 3 — Go To Market

### Documentation (`docs/`)
- ⚠️ `docs/README.md` exists but is empty
- [ ] Choose docs framework (Starlight/Astro recommended — already using Vite/React)
- [ ] Getting started guide (npm install, first Pipeline usage)
- [ ] API reference for all `Pipeline` methods
- [ ] REST API reference with curl examples
- [ ] Language pack format spec (the JSON schema, explained for non-engineers)
- [ ] "How to contribute a language pack" guide
- [ ] Architecture overview (engine / script adapter / language pack three-layer model)
- [ ] Migration guide from `felig-toolkit` v1 to `@fidel-tools/core` v2
- [ ] Python SDK docs
- [ ] Deploy to `docs.fidel.tools` or as subdirectory of main site

### Landing Page Completion
- [ ] Link landing page countdown to demo console (the demo exists but is unreachable)
- [ ] Features section with live mini-demos
- [ ] Pricing section (Free / Starter $19 / Growth $79 / Enterprise)
- [ ] "Get API Key" CTA button
- [ ] Code example section (npm + Python)
- [ ] Testimonials / social proof section (placeholder until real users)
- [ ] Footer with docs, GitHub, npm, PyPI links

### Publishing
- [ ] Publish `@fidel-tools/core` to npm (v2.0.1 is ready once type/schema alignment done)
- [ ] Publish `@fidel-tools/lang-am` to npm
- [ ] Publish `fidel-tools` to PyPI
- [ ] Deploy REST API to live URL
- [ ] Deploy docs site
- [ ] Announce on dev.to / Hacker News / Ethiopian tech communities / Twitter/X

---

## Phase 4 — Multi-Language & Extensibility

### Script Adapter Layer
- [ ] `packages/script-ethiopic/` — `EthiopicScriptAdapter` class
  - [ ] `isLetter(char)`, `isPunctuation(char)`, `isEthiopic(char)`
  - [ ] Unicode block range detection (U+1200–U+137F)
  - [ ] Unicode normalization (NFC)
  - [ ] Syllabary-aware character splitting
- [ ] `packages/script-latin/` — `LatinScriptAdapter` (for Oromo/Afaan written in Latin)
- [ ] Wire script adapter into `Pipeline` constructor (auto-selected from `pack.meta.script`)

### Tigrinya (`@fidel-tools/lang-ti`)
- [ ] `packages/lang-ti/ti.json` — stopwords, affixes, transliteration map
- [ ] Validate with `@fidel-tools/validate-pack`
- [ ] Publish `@fidel-tools/lang-ti` to npm
- [ ] Add Tigrinya tests to CI

### Oromo (`@fidel-tools/lang-om`)
- [ ] `packages/lang-om/om.json` — uses Latin script, different adapter
- [ ] Validate and publish
- [ ] Add to CI

### Community Language Pack Ecosystem
- [ ] Publish JSON schema for language packs at `schema.fidel.tools`
- [ ] `packages/validate-pack` published to npm as `@fidel-tools/validate-pack`
- [ ] GitHub issue template: "Submit a language pack"
- [ ] `awesome-fidel-tools` community registry (markdown list of community packs)

---

## Phase 5 — Intelligence Layer (ML Features)

### Sentiment Analysis
- [ ] Source or build Amharic sentiment lexicon (positive/negative scored word list)
  - Reference: academic Amharic sentiment datasets (several exist in ACL Anthology)
- [ ] `packages/core/src/sentiment.ts` — lexicon-based scorer
  - `analyzeSentiment(text, pack): { label: "positive"|"negative"|"neutral", score: number }`
- [ ] `pack.sentiment.lexicon` field consumed by the sentiment component
- [ ] Add `POST /sentiment` to REST API
- [ ] Add Sentiment tab to web demo console
- [ ] Sentiment tests

### Named Entity Recognition (NER) — Rule-Based
- [ ] Curate Amharic name lists: Ethiopian cities, common personal names, major organizations
- [ ] `packages/core/src/ner.ts` — rule-based NER using name lists from `pack.ner.name_lists`
  - `recognizeEntities(text, pack): Entity[]` where `Entity = { text, label, start, end }`
- [ ] `pack.ner.name_lists` field consumed by NER component
- [ ] Add `POST /ner` to REST API
- [ ] Add NER tab to web demo console
- [ ] NER tests

### Number Normalization
- [ ] `packages/core/src/number_normalizer.ts`
  - `normalizeNumbers(text, pack): string` — converts Ethiopic numerals using `pack.numbers.ethiopic_to_arabic`
- [ ] Wire into Pipeline as optional step
- [ ] Tests

### ML Models (Long Term)
- [ ] Collect and annotate Amharic sentiment training dataset (500+ labeled sentences minimum)
- [ ] Train lightweight sentiment classifier (distilBERT fine-tuned or fastText)
- [ ] Package as `@fidel-tools/models-am-sentiment`
- [ ] Collect and annotate NER training data
- [ ] Train NER model
- [ ] Package as `@fidel-tools/models-am-ner`
- [ ] POS tagger (requires annotated treebank — research partnership needed)
- [ ] Morphological analyzer (research-level, requires morpheme dictionary)

---

## Phase 6 — Platform & Monetization

### Developer Platform
- [ ] Auth system — sign up / sign in (Better Auth)
- [ ] Dashboard — API key management, usage charts, billing
- [ ] API key creation, rotation, deletion
- [ ] Usage analytics per key (daily/monthly call counts, endpoint breakdown)
- [ ] Upgrade/downgrade plan flow
- [ ] Billing integration (chapa, tele, stripe, or similar)
  - [ ] Free tier (1k calls/month, no card required)
  - [ ] Starter $19/month (100k calls/month)
  - [ ] Growth $79/month (1M calls/month)
  - [ ] Enterprise (custom, contact form)
- [ ] Webhook support for async/batch jobs
- [ ] Batch API endpoint `POST /batch` (array of texts, returns array of results)

### Enterprise Features
- [ ] Self-hosted Docker image (Dockerfile already exists — just needs docs)
- [ ] SLA documentation
- [ ] On-premise deployment guide
- [ ] Custom language pack support (enterprise customers can upload private packs)
- [ ] Priority support channel

### Outreach
- [ ] Submit to Lacuna Fund (low-resource language NLP grants)
- [ ] Submit to Mozilla Technology Fund
- [ ] Reach out to Addis Ababa University NLP research group
- [ ] Post on Ethiopian developer communities (ET dev Discord, Telegram groups)
- [ ] Publish introductory blog post on dev.to
- [ ] Submit `@fidel-tools/core` to Awesome NLP lists on GitHub
- [ ] Academic paper or technical report (citable reference for researchers)

---

## Summary — Where Things Stand Right Now

```
Phase 0 — Foundation           ████████░░  80%  (CI scope needs widening)
Phase 1 — Core Library         ████████░░  75%  (fs coupling + type mismatch remaining)
Phase 1 — lang-am Pack         ██████░░░░  55%  (new am.json not committed, old schema in types.ts)
Phase 1 — Web App              ████████░░  75%  (demo built but unreachable from landing)
Phase 1 — REST API             ██░░░░░░░░  15%  (stub only)
Phase 1 — Python Package       █░░░░░░░░░   5%  (scaffold only)
Phase 2 — Stabilization        ░░░░░░░░░░   0%
Phase 3 — Go To Market         ███░░░░░░░  25%  (landing page exists, nothing published)
Phase 4 — Multi-Language       ░░░░░░░░░░   0%
Phase 5 — ML Features          ░░░░░░░░░░   0%
Phase 6 — Platform             ░░░░░░░░░░   0%
```

