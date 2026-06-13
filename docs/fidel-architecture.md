# ፊደል Tools — Language-Agnostic Architecture Design

> How English NLP solved this problem, what we can learn from it, and how to build
> ፊደል Tools so it works for Amharic today and any language tomorrow.

---

## The Core Problem

Right now ፊደል Tools has Amharic knowledge **baked into its code**. The stopword
list lives in `stopword_remover.ts`. The affix tables live in `stemmer.ts`. The
transliteration map lives in `transliterator.ts`. To support Tigrinya tomorrow,
you would have to fork the code or add `if (lang === 'ti')` branches everywhere.

That is not how the best NLP systems are built. The insight that changed NLP
tooling — spaCy's breakthrough, essentially — is this:

> **Separate the pipeline mechanics from the language data.**
> The engine knows *how* to stem. The language pack knows *what* to strip.
> Swap the pack, same engine, different language.

---

## How English (and spaCy) Solved This

spaCy's architecture has three distinct layers:

### Layer 1 — The Pipeline Engine
A chain of composable components. Each one receives a `Doc` object, annotates it,
and passes it on. The engine itself is language-blind.

```
raw text
  → Tokenizer
  → Normalizer
  → Stopword Filter
  → Stemmer / Lemmatizer
  → POS Tagger
  → NER
  → Doc (annotated output)
```

### Layer 2 — The Language Class
A thin configuration object that supplies language-specific *data* to the engine:

```python
class English(Language):
    lang = "en"
    Defaults:
        stop_words   = {"the", "a", "an", ...}   # ~300 words
        prefixes     = [r"un", r"re", r"pre", ...]
        suffixes     = [r"ing", r"ed", r"ly", ...]
        punct_chars  = [".", ",", "!", "?", ...]
        tokenizer_exceptions = {"don't": ["do", "n't"], "U.K.": ["U.K."]}
        lex_attr_getters = {...}   # functions: is_alpha, is_digit, etc.
```

The engine asks: "what are the stopwords?" The language class answers.
The engine never has a list baked in.

### Layer 3 — Trained Models (optional)
ML models for POS, NER, parsing — trained separately per language, loaded on
demand. The engine knows the interface (`predict(doc) → annotations`). The model
knows the language.

**The result:** To add Latin to spaCy, someone wrote a `Latin(Language)` class
with Latin stopwords, prefix/suffix rules, and a tag map. The entire pipeline
worked immediately, before any ML model existed, for rule-based tasks.

---

## What ፊደል Tools Should Copy — And Do Better

spaCy's design is excellent but has two limitations we should not replicate:

1. **It conflates script with language.** Japanese, Chinese, and Korean required
   custom tokenizer rewrites because they don't use spaces. The Ethiopic script
   has its own quirks (labialized clusters, the fidel syllabary, punctuation
   marks `።` and `፡`) that a generic tokenizer won't handle. We should treat
   **script** as a first-class concept separate from language.

2. **Its "language pack" is just a Python class.** This means adding a language
   requires writing code. We can do better: make the language pack a **pure data
   format** (JSON/YAML). No code required to add a new language — just a data
   file.

---

## The ፊደል Tools Architecture

### The Three "Things" You Were Looking For

The "right things to plug in" are:

```
┌─────────────────────────────────────────────────────────────┐
│                    LANGUAGE PACK (.json)                     │
│                                                             │
│  • script: "ethiopic" | "latin" | "arabic" | ...           │
│  • stopwords: [...]                                         │
│  • prefixes: [...]                                          │
│  • suffixes: [...]                                          │
│  • normalization_map: { "ሀ": "ሃ", "ሐ": "ሃ", ... }         │
│  • transliteration_map: { "ሀ": "ha", "ለ": "le", ... }     │
│  • abbreviations: { "አ.አ": "አዲስ አበባ", ... }               │
│  • sentence_boundaries: ["።", "፡", "?", "!"]              │
│  • number_map: { "፩": "1", "፪": "2", ... }                │
│  • tokenizer_exceptions: { ... }                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SCRIPT ADAPTER (code)                     │
│                                                             │
│  Knows how the script works at a physical level:            │
│  • How to split tokens (spaces? character boundaries?)      │
│  • Unicode normalization (NFC/NFD/NFKC)                    │
│  • Character property detection (is_letter, is_punct, ...)  │
│  • Syllabary vs alphabet vs abjad logic                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ML MODEL PACK (optional)                  │
│                                                             │
│  Trained weights for:                                       │
│  • Sentiment classifier                                     │
│  • NER model                                               │
│  • POS tagger                                              │
│  Loaded on demand, versioned independently                  │
└─────────────────────────────────────────────────────────────┘
```

The **pipeline engine** is language-blind TypeScript/Python code. It knows:
"take text, run it through normalizer → tokenizer → stopword filter → stemmer."
It does not know anything about Amharic specifically.

The **language pack** is a JSON file that answers every language-specific question
the engine asks. Adding Tigrinya means writing `ti.json`. No code changes.

The **script adapter** is a small piece of code (one per script family, not per
language) that handles script-level operations. Ethiopic script has one adapter
that both Amharic and Tigrinya use.

---

## Concrete Data Structures

### Language Pack Format

```json
{
  "meta": {
    "code": "am",
    "name": "Amharic",
    "native_name": "አማርኛ",
    "script": "ethiopic",
    "version": "1.0.0",
    "authors": ["fidel-tools"]
  },

  "normalization": {
    "char_map": {
      "ሀ": "ሃ",
      "ሐ": "ሃ",
      "ኀ": "ሃ",
      "ሠ": "ሰ",
      "ዐ": "አ",
      "ጸ": "ፀ"
    },
    "labialized_map": {
      "ሗ": "ሁዋ",
      "ኋ": "ሁዋ"
    },
    "gemination_threshold": 2
  },

  "tokenization": {
    "split_on_spaces": true,
    "sentence_boundaries": ["።", "፡", "?", "!", "."],
    "punctuation": ["፣", "፤", "፥", "፦", ",", "(", ")", "\""],
    "exceptions": {
      "አ.አ": ["አዲስ", "አበባ"],
      "ዶ.ር": ["ዶክተር"]
    }
  },

  "stopwords": [
    "እና", "ወይም", "ነው", "ናት", "ናቸው", "የ", "ባ", "ስለ", "..."
  ],

  "stemmer": {
    "prefixes": ["ይ", "ት", "አ", "እ", "ስ", "ስለ", "ስለማይ", "..."],
    "suffixes": ["ዎች", "ኛ", "ኛው", "ነት", "ዊ", "..."],
    "protected_words": ["ኢትዮጵያ", "አፍሪካ"]
  },

  "transliteration": {
    "scheme": "fidel",
    "map": {
      "ሀ": "ha", "ሁ": "hu", "ሂ": "hi",
      "ለ": "le", "ሉ": "lu", "ሊ": "li",
      "..."
    }
  },

  "numbers": {
    "ethiopic_to_arabic": {
      "፩": "1", "፪": "2", "፫": "3",
      "፬": "4", "፭": "5", "፮": "6",
      "፯": "7", "፰": "8", "፱": "9", "፲": "10"
    }
  },

  "sentiment": {
    "model": "am-sentiment-v1",
    "lexicon": "am-sentiment-lexicon-v1"
  },

  "ner": {
    "model": "am-ner-v1",
    "name_lists": ["am-person-names-v1", "am-place-names-v1"]
  }
}
```

### The Pipeline Engine Interface (TypeScript)

```typescript
// Core types — language-agnostic

interface LanguagePack {
  meta: LanguageMeta
  normalization: NormalizationConfig
  tokenization: TokenizationConfig
  stopwords: string[]
  stemmer: StemmerConfig
  transliteration: TransliterationConfig
  numbers: NumberConfig
  sentiment?: SentimentConfig
  ner?: NERConfig
}

interface ScriptAdapter {
  // Knows how to work with the physical script
  isLetter(char: string): boolean
  isPunctuation(char: string): boolean
  unicodeNormalize(text: string): string
  splitIntoCharacters(text: string): string[]
}

interface PipelineComponent {
  name: string
  process(doc: Doc, pack: LanguagePack): Doc
}

// The Doc object — travels through the pipeline accumulating annotations
interface Doc {
  text: string             // original
  tokens: Token[]
  sentences: Sentence[]
  entities: Entity[]
  meta: Record<string, unknown>
}

// The Pipeline — knows nothing about any language
class Pipeline {
  constructor(
    private pack: LanguagePack,
    private adapter: ScriptAdapter,
    private components: PipelineComponent[]
  ) {}

  process(text: string): Doc {
    let doc: Doc = { text, tokens: [], sentences: [], entities: [], meta: {} }
    for (const component of this.components) {
      doc = component.process(doc, this.pack)
    }
    return doc
  }
}
```

### Creating a Language Instance

```typescript
import { Pipeline, EthiopicScriptAdapter } from '@fidel-tools/core'
import amPack from '@fidel-tools/lang-am'      // Amharic pack
import tiPack from '@fidel-tools/lang-ti'      // Tigrinya pack

// Amharic pipeline
const amNLP = new Pipeline(amPack, new EthiopicScriptAdapter(), [
  new Normalizer(),
  new Tokenizer(),
  new StopwordFilter(),
  new Stemmer(),
])

// Tigrinya pipeline — same engine, different pack
const tiNLP = new Pipeline(tiPack, new EthiopicScriptAdapter(), [
  new Normalizer(),
  new Tokenizer(),
  new StopwordFilter(),
  new Stemmer(),
])

// Arabic pipeline — different engine AND different script adapter
const arNLP = new Pipeline(arPack, new ArabicScriptAdapter(), [
  new Normalizer(),
  new Tokenizer(),
  new StopwordFilter(),
  new Stemmer(),
])

// Process text — identical API regardless of language
const doc = amNLP.process("ልጆቻቸውን ወደ ትምህርት ቤት ላኩ")
```

---

## The npm Package Structure This Creates

```
@fidel-tools/core          ← pipeline engine, Doc type, component interfaces
@fidel-tools/script-ethiopic  ← EthiopicScriptAdapter
@fidel-tools/script-arabic    ← ArabicScriptAdapter (future)
@fidel-tools/lang-am       ← Amharic language pack (JSON + thin loader)
@fidel-tools/lang-ti       ← Tigrinya language pack
@fidel-tools/lang-om       ← Oromo language pack (future)
@fidel-tools/models-am     ← Amharic ML models: sentiment, NER (large, optional)
```

A developer who only needs Amharic installs:
```
pnpm add @fidel-tools/core @fidel-tools/script-ethiopic @fidel-tools/lang-am
```

A researcher who wants everything:
```
pnpm add @fidel-tools/core @fidel-tools/script-ethiopic @fidel-tools/lang-am @fidel-tools/models-am
```

---

## What This Means Practically

### Adding Tigrinya (ትግርኛ)

1. Write `packages/lang-ti/ti.json` — stopwords, affixes, char normalization map
2. Test with `packages/lang-ti/tests/`
3. `pnpm publish` → `@fidel-tools/lang-ti` is live on npm
4. The REST API automatically exposes `/pipeline?lang=ti` with zero code changes
5. The Python port automatically supports it

Zero engine changes. One JSON file.

### Adding Oromo (Afaan Oromoo)

Oromo uses the Latin script, not Ethiopic. This needs a different script adapter
(`LatinScriptAdapter`, which already exists implicitly — it's the default for
English, French, etc.). But the engine doesn't change. Just:

1. Write `packages/lang-om/om.json`
2. Use `LatinScriptAdapter`
3. Done

### Adding Arabic or Somali

Arabic is right-to-left and uses an abjad (consonant-heavy) script. It needs its
own `ArabicScriptAdapter`. But once that adapter exists, every Arabic-script
language (Somali written in Arabic script, Uyghur, Urdu) gets it for free.

---

## The Extensibility Contract (What Users Can Plug In)

This is the "mechanism" you were looking for. There are three extension points:

### 1. Community Language Packs
Anyone can publish `@their-org/fidel-tools-lang-xyz` to npm following the
language pack JSON schema. The engine loads it. This is how spaCy's community
publishes models — the same pattern, but with data files instead of trained
weights.

Publish a schema validator so community packs can be tested:
```bash
npx @fidel-tools/validate-pack ./my-lang-pack.json
```

### 2. Custom Pipeline Components
Developers can write their own components implementing `PipelineComponent`:
```typescript
class MyCustomDomainNormalizer implements PipelineComponent {
  name = 'custom-legal-normalizer'
  process(doc: Doc, pack: LanguagePack): Doc {
    // custom logic for legal Amharic documents
    return doc
  }
}

const nlp = new Pipeline(amPack, adapter, [
  new Normalizer(),
  new MyCustomDomainNormalizer(),  // inject at any position
  new Tokenizer(),
  new StopwordFilter(),
])
```

### 3. ML Model Plugins
The sentiment and NER slots in the language pack reference model IDs. Anyone
can publish a model pack that the engine loads:
```typescript
// Load community model instead of official one
const customPack = { ...amPack, sentiment: { model: 'my-better-am-sentiment-v2' } }
```

---

## Migration Path from Current Code

The current `felig-toolkit` code does not need to be thrown away. The migration
is a refactor, not a rewrite:

**Step 1:** Extract all Amharic data out of the source files into `am.json`.
The char map in `transliterator.ts`, the stopword array in `stopword_remover.ts`,
the affix arrays in `stemmer.ts` — all become data.

**Step 2:** Refactor each source file into a `PipelineComponent` class that reads
its configuration from a passed-in `LanguagePack`. The algorithms stay the same.

**Step 3:** Write the `EthiopicScriptAdapter` — mostly already implemented across
the existing files, just needs to be formalized into one class.

**Step 4:** Package the Amharic data as `@fidel-tools/lang-am`. The current
behavior is exactly preserved. No behavioral regression.

**Step 5:** Write `ti.json` (Tigrinya). Prove the architecture works.

---

## The Big Picture

You asked: "how is this solved for English?" The answer is that English benefited
from 30 years of researchers and companies (NLTK from 2001, spaCy from 2015)
layering abstractions until the current clean architecture emerged. They made
mistakes — NLTK baked in English assumptions everywhere, which is why adding new
languages to NLTK is painful. spaCy learned from that and separated engine from
data.

ፊደል Tools has the rare opportunity to start with the right architecture from the
beginning — and to build it specifically for Ethiopic scripts, which have
properties (the syllabary structure, labialization, the fidel normalization
problem, the lack of capitalization as a named entity signal) that no existing
framework handles well.

The goal is for someone to be able to say:

> "I have text in Sidama (ሲዳምኛ). I will write `sidama.json` with Sidama stopwords
> and affix rules. I install `@fidel-tools/core` and `@fidel-tools/lang-sidama`.
> My text preprocessing works."

That is the full vision. It starts with Amharic, proves the engine, opens to
the rest of the 80+ languages spoken in Ethiopia and Eritrea.
