# spaCy Architecture — How It Works & How ፊደል Tools Improves On It

---

## Part 1 — How spaCy Works

### The Core Mental Model

spaCy's fundamental insight is deceptively simple:

> Text flows through a pipeline of components. Each component receives a single
> object (the `Doc`), annotates it in place, and passes it on. The pipeline is
> just a list. The Doc is the single source of truth.

Everything in spaCy — tokenization, POS tagging, NER, dependency parsing — is
an expression of this one idea.

---

### Layer 1 — The Doc Object

The `Doc` is the central data structure. It is created once from raw text and
travels through the entire pipeline, accumulating annotations at each step.

```
raw string: "Ethiopia is in Africa"
     │
     ▼
Doc object:
  ├── tokens:   [Token("Ethiopia"), Token("is"), Token("in"), Token("Africa")]
  ├── sents:    [Span("Ethiopia is in Africa")]
  ├── ents:     [Span("Ethiopia", label=GPE), Span("Africa", label=GPE)]
  └── vocab:    shared vocabulary (all strings, vectors)

Each Token carries:
  ├── text:       "Ethiopia"
  ├── lemma_:     "ethiopia"
  ├── pos_:       "PROPN"
  ├── dep_:       "nsubj"
  ├── ent_type_:  "GPE"
  ├── is_stop:    False
  └── vector:     [0.21, -0.04, ...] (300-dim float array)
```

The Doc is a memory-efficient C array under the hood (Cython). Tokens are not
Python objects with attributes — they are integer IDs into the shared `Vocab`.
The string "Ethiopia" is stored once; the token holds a hash that points to it.
This is why spaCy is fast.

---

### Layer 2 — The Tokenizer (Special, Not a Pipeline Component)

The tokenizer is the only component that runs outside the pipeline. It runs
first, always, and creates the Doc. It cannot be swapped out the same way other
components can.

**How it works:**

```
"don't go to New York."
        │
        ▼
Step 1: Split on whitespace
  ["don't", "go", "to", "New", "York."]

        │
        ▼
Step 2: Check exception dictionary
  "don't" → ["do", "n't"]   ← hardcoded exception
  ["do", "n't", "go", "to", "New", "York."]

        │
        ▼
Step 3: Apply prefix rules (strip from left)
  No prefixes match here.

        │
        ▼
Step 4: Apply suffix rules (strip from right)
  "York." → "York" + "."
  ["do", "n't", "go", "to", "New", "York", "."]

        │
        ▼
Step 5: Apply infix rules (split in the middle)
  Hyphens, slashes, etc.
```

All of these rules — the exception dict, prefix patterns, suffix patterns,
infix patterns — come from the **Language class** (the language pack). The
tokenizer engine is language-agnostic. The rules are language-specific data.

---

### Layer 3 — The Pipeline

After tokenization, the Doc passes through a sequential list of components.
Each one is a Python callable: `component(doc) → doc`.

```
Doc
 │
 ├──▶ tok2vec        (shared token embeddings — feeds downstream components)
 │
 ├──▶ tagger         (assigns POS tags to each token)
 │         uses: tok2vec vectors + trained weights
 │
 ├──▶ parser         (dependency parse — syntactic structure)
 │         uses: tok2vec vectors + trained weights
 │         also sets: sentence boundaries (Doc.sents)
 │
 ├──▶ ner            (named entity recognizer)
 │         uses: tok2vec vectors + trained weights
 │         sets: Doc.ents
 │
 ├──▶ lemmatizer     (base form of each token)
 │         rule-based for many languages (lookup table + morphological rules)
 │         OR neural (uses POS tag from tagger)
 │
 └──▶ attribute_ruler  (custom rule overrides — highest priority)

 ▼
Final annotated Doc
```

Components are registered by name in a string registry. You add, remove, or
replace them:

```python
nlp = spacy.load("en_core_web_sm")
nlp.add_pipe("my_custom_component", after="ner")
nlp.remove_pipe("parser")
nlp.replace_pipe("ner", "my_ner")
```

---

### Layer 4 — The Language Class

This is where language-specific data lives. Every supported language in spaCy
is a subclass of `Language`:

```python
class Amharic(Language):
    lang = "am"

    class Defaults(Language.Defaults):
        # Data the tokenizer reads
        stop_words = {"እና", "ወይም", "ነው", ...}
        prefixes = [r"un", r"re", ...]       # regex patterns
        suffixes = [r"ing$", r"ed$", ...]    # regex patterns
        infixes  = [r"(?<=[0-9])-(?=[0-9])"] # regex patterns
        tokenizer_exceptions = {
            "don't": [{"ORTH": "do"}, {"ORTH": "n't"}],
        }
        # Tag mapping for POS
        morph_rules = {...}
        # Lemmatization lookup
        lemma_lookup = {"running": "run", ...}
```

**The critical point:** `Language.Defaults` is Python code. To add a new
language to spaCy, you write a Python class, not a data file. This means:
- You need to know Python
- You need to understand spaCy internals
- You submit a PR to the spaCy repo (or publish a package)
- The barrier is engineering, not linguistics

---

### Layer 5 — Trained Models

spaCy's most powerful features (POS, NER, dependency parsing) require trained
ML models. These are distributed as separate pip packages:

```bash
python -m spacy download en_core_web_sm   # 12MB — small CNN model
python -m spacy download en_core_web_trf  # 438MB — transformer model
```

A model package contains:
- The trained weights (`.bin` files)
- The config that describes the pipeline
- The vocab and string store
- Meta: accuracy scores, training data info

Models are trained offline using spaCy's training CLI against annotated corpora
(CoNLL, OntoNotes, UD treebanks). Training a new language model from scratch
requires thousands of annotated sentences — this is the real cost of adding a
new language.

---

### The Full Flow — End to End

```
Developer writes:
  nlp = spacy.load("en_core_web_sm")
  doc = nlp("Apple is looking at buying U.K. startup for $1 billion")

Internal flow:

1. spacy.load()
   ├── Reads model config
   ├── Instantiates English() Language class
   ├── Loads trained weights for tok2vec, tagger, parser, ner
   └── Returns nlp Pipeline object

2. nlp("Apple is...")
   ├── Tokenizer.tokenize(text)
   │     ├── whitespace split
   │     ├── exception lookup: "U.K." is in exceptions dict → kept as one token
   │     ├── suffix strip: "$1" → "$" + "1"
   │     └── returns Doc with 10 tokens
   │
   ├── tok2vec(doc)
   │     └── each token → 96-dim context vector
   │
   ├── tagger(doc)
   │     └── PROPN, AUX, VERB, ADP, VERB, PROPN, NOUN, ADP, SYM, NUM, NOUN
   │
   ├── parser(doc)
   │     ├── assigns dep labels: nsubj, aux, ROOT, prep, pcomp...
   │     └── sets doc.sents boundary
   │
   └── ner(doc)
         └── doc.ents: [Apple/ORG, U.K./GPE, $1 billion/MONEY]

3. Developer accesses:
   doc[0].text       → "Apple"
   doc[0].ent_type_  → "ORG"
   doc[5].pos_       → "PROPN"
   list(doc.sents)   → [<Span "Apple is looking...">]
```

---

### What spaCy Gets Right

1. **The Doc pattern** — one object, one pass, immutable text, accumulated
   annotations. Clean and efficient.

2. **Component registry** — string-based registration means components are
   composable and replaceable without subclassing.

3. **Speed** — Cython, C arrays, hash-based string interning. Processes
   millions of tokens per second.

4. **Separation of pipeline from models** — you can run the tokenizer and
   rule-based components without any ML model loaded.

5. **`nlp.pipe()` for batch processing** — streams documents through the
   pipeline efficiently using generators, not loading everything into memory.

---

### What spaCy Gets Wrong (or Doesn't Handle Well)

This is where ፊደል Tools diverges.

**Problem 1: Language pack = Python code**
To add a language to spaCy you write a Python class. This gates contribution
behind engineering knowledge. A linguist who knows Sidama but not Python cannot
contribute a Sidama language pack. The pack format is tightly coupled to spaCy
internals.

**Problem 2: Script is assumed, not modeled**
spaCy's tokenizer fundamentally assumes: (a) tokens are separated by spaces or
punctuation, (b) the script reads left-to-right, (c) there is a concept of
"word" that maps to whitespace-delimited units. This works for Indo-European
languages. It breaks for:
- Japanese/Chinese (no spaces between words)
- Arabic (right-to-left, cursive joining, clitics)
- Ethiopic (spaces exist, but the syllabary structure and labialization are
  invisible to a generic tokenizer)

spaCy added special-case tokenizers for Japanese and Chinese. Each was a
significant engineering effort. There is no Ethiopic tokenizer.

**Problem 3: Normalization is an afterthought**
spaCy has a `Normalizer` component but it's basic — mostly Unicode NFC/NFD
normalization. It has no concept of phonetic equivalence classes (like Amharic's
ሀ/ሐ/ኀ all mapping to the same sound) or script-specific redundancy collapsing.
This means two spellings of the same Amharic word can be treated as completely
different tokens.

**Problem 4: Model-first, rules-second culture**
spaCy's community has moved heavily toward transformer-based models. Rule-based
NLP is increasingly treated as a fallback for languages that "don't have models
yet." This is backwards for low-resource languages — rules are often more
reliable than undertrained models, and they're interpretable and correctable
without retraining.

**Problem 5: No concept of script families**
In spaCy, `English` and `French` share nothing. `Arabic` and `Urdu` share
nothing. Yet Arabic-script languages have enormous overlap in tokenization rules,
normalization patterns, and morphological structure. spaCy has no mechanism to
share a "script adapter" across languages. Every Arabic-family language
reimplements the same right-to-left, join-character logic from scratch.

**Problem 6: Distribution is heavy**
The smallest useful English model is 12MB. A full transformer model is 500MB+.
For a developer building a lightweight Amharic text processing tool, this weight
is unreasonable. spaCy is not designed to run at the edge or in the browser.

---

## Part 2 — How ፊደል Tools Improves On It

### Improvement 1: Language Pack = Pure JSON

The single biggest architectural difference. In ፊደል Tools, everything a language
contributes is a `.json` file following a published schema. No Python. No
TypeScript. No understanding of internals required.

```
spaCy:   write English(Language) subclass in Python → submit PR
ፊደል:    write am.json → npm publish @fidel-tools/lang-am
```

A linguist, a student, a community member with no programming background can
open a text editor, write `sidama.json` with Sidama stopwords and affix rules,
run `npx @fidel-tools/validate-pack sidama.json`, and publish. The barrier drops
from engineering to linguistics.

This also means language packs are:
- Diffable (JSON diffs are readable)
- Versionable independently of the engine
- Composable (override just the stopwords without touching the rest)
- Auditable by non-engineers

---

### Improvement 2: Script as a First-Class Layer

ፊደል Tools models three distinct levels that spaCy conflates:

```
Level 1: Script Adapter  (how characters work physically)
  EthiopicScriptAdapter
    ├── knows the syllabary structure
    ├── knows labialized clusters
    ├── knows Ethiopic punctuation (።  ፡  ፣)
    └── knows Unicode block boundaries

Level 2: Language Pack  (what the language says)
  am.json, ti.json, om.json
    ├── stopwords
    ├── affix rules
    └── abbreviations

Level 3: Domain Pack  (optional, what the domain says)
  am-legal.json, am-medical.json
    └── domain-specific abbreviations, terminology
```

Amharic and Tigrinya share the same `EthiopicScriptAdapter`. When Tigrinya
support is added, it reuses all the script-level logic for free. A future
Ge'ez liturgical text pack also reuses it.

This is the equivalent of spaCy needing to write a new tokenizer for every
Arabic-family language, vs. ፊደል writing one `ArabicScriptAdapter` that all
of them share.

---

### Improvement 3: Normalization as a First-Class Pipeline Stage

spaCy treats normalization as minor preprocessing. ፊደል treats it as the most
important stage for Ethiopic text, because without it the same word has multiple
unrecognizable forms.

The `normalization` block in `am.json` defines:

```json
"normalization": {
  "char_map": {
    "ሀ": "ሃ",   ← ሀ, ሐ, ኀ all collapse to ሃ
    "ሐ": "ሃ",
    "ኀ": "ሃ",
    "ሠ": "ሰ",   ← ሠ collapses to ሰ (same sound, redundant character)
    "ዐ": "አ",   ← Ain collapses to Alef
    "ጸ": "ፀ"    ← Tsade variants collapse
  },
  "gemination_threshold": 2
}
```

Before any tokenization, stemming, or matching happens, the normalizer applies
these mappings. The word "ሀገር" and "ሐገር" become the same string. The stemmer,
stopword remover, and indexer never see the ambiguity. This is the correct place
to solve the problem — at the input boundary, once, for everything downstream.

spaCy has no equivalent for Ethiopic. Two spellings of the same word would
produce two different tokens, two different index entries, two mismatched
stemmed forms.

---

### Improvement 4: Rule-First, Model-Optional

ፊደל's pipeline works fully without any ML model. The rule-based components —
normalizer, tokenizer, stopword remover, stemmer, transliterator — are complete
and useful on their own.

ML models (sentiment, NER) are optional plugins that slot into the pipeline when
available. The architecture looks like:

```
Core pipeline (always works, no model needed):
  Normalizer → Tokenizer → StopwordFilter → Stemmer → Transliterator

Optional ML plugins (when model pack is installed):
  → SentimentClassifier
  → NERTagger
  → POSTagger
```

This means a developer can use ፊደል today for text preprocessing without waiting
for trained Amharic models to exist. As models are trained and published, they
drop into the same pipeline without any API change.

For low-resource languages, this is the right philosophy. Most Ethiopic languages
will never have enough annotated data for reliable ML models. Rule-based systems
that are transparent and correctable will serve them better.

---

### Improvement 5: Lightweight and Runtime-Agnostic

spaCy requires Python, CPython specifically (no PyPy, no WebAssembly). The
smallest useful installation is tens of megabytes.

ፊደל Tools targets:

```
@fidel-tools/core      ~50KB     runs in Node.js, edge runtimes, browser
@fidel-tools/lang-am   ~200KB    the JSON data pack
@fidel-tools/models-am ~TBD      optional, loaded separately
```

The core pipeline can run:
- In a serverless function (Vercel Edge, Cloudflare Workers)
- In the browser (WebAssembly target planned)
- In a mobile app (React Native)
- In a CLI tool with zero startup overhead

This matters for the target market. An Ethiopian developer building a mobile app
that processes Amharic text input cannot ship a 50MB Python runtime. They can
ship 250KB of JSON and TypeScript.

---

### Improvement 6: The Validation Schema

spaCy language packs are valid if they compile. There is no schema, no test
harness for "does this language pack behave correctly."

ፊደל publishes a JSON schema for language packs and a validator CLI:

```bash
npx @fidel-tools/validate-pack ./ti.json
```

This runs:
- Schema validation (required fields, correct types)
- Consistency checks (no char_map cycles, no duplicate stopwords)
- Smoke tests (can a Pipeline be instantiated, does it process sample text)

This means any community pack can be mechanically verified before publication,
without needing a maintainer to review it manually.

---

## Part 3 — Side-by-Side Comparison

```
┌─────────────────────┬──────────────────────────┬──────────────────────────┐
│                     │ spaCy                    │ ፊደል Tools               │
├─────────────────────┼──────────────────────────┼──────────────────────────┤
│ Language pack format│ Python class             │ JSON file                │
│ Add a new language  │ Write Python code        │ Write a JSON file        │
│ Script modeling     │ Implicit in tokenizer    │ Explicit ScriptAdapter   │
│ Share script logic  │ Not supported            │ One adapter per script   │
│ Normalization       │ Basic Unicode only       │ First-class pipeline step│
│ Ethiopic support    │ None                     │ Native                   │
│ Without ML models   │ Limited (rules only)     │ Full feature set         │
│ Runtime targets     │ CPython only             │ Node, edge, browser      │
│ Pack validation     │ None                     │ JSON schema + CLI        │
│ Pack distribution   │ PR to spaCy repo         │ npm publish              │
│ Bundle size         │ 12MB+ (smallest model)   │ ~250KB (core + lang-am)  │
│ Low-resource langs  │ Model-dependent          │ Rules work standalone    │
└─────────────────────┴──────────────────────────┴──────────────────────────┘
```

---

## Part 4 — The Full ፊደල Flow

```
Developer:
  import { Pipeline } from '@fidel-tools/core'
  import amPack from '@fidel-tools/lang-am'

  const nlp = new Pipeline(amPack)
  const doc = nlp.process("ልጆቻቸውን ወደ ትምህርት ቤት ላኩ።")

Internal flow:

1. Pipeline constructor
   ├── validates amPack against LanguagePack interface
   ├── selects EthiopicScriptAdapter (from pack.meta.script)
   └── wires components in order

2. nlp.process(text)
   │
   ├──▶ Normalizer
   │     ├── applies pack.normalization.char_map
   │     │     "ሀ"→"ሃ", "ሐ"→"ሃ", etc. on every character
   │     ├── collapses gemination (threshold: 2)
   │     └── output: normalized string
   │
   ├──▶ Tokenizer
   │     ├── splits on pack.tokenization.sentence_boundaries → sentences
   │     ├── splits sentences on spaces (split_on_spaces: true)
   │     ├── checks pack.tokenization.exceptions → expands abbreviations
   │     ├── strips pack.tokenization.punctuation
   │     └── output: Doc with tokens[] and sentences[]
   │
   ├──▶ StopwordFilter
   │     ├── checks each token against pack.stopwords
   │     ├── marks token.is_stop = true (non-destructive)
   │     └── output: Doc with stop flags set
   │
   ├──▶ Stemmer
   │     ├── for each non-stop token:
   │     │     transliterate (am→en) using pack.transliteration.felig.map
   │     │     try stripping pack.stemmer.suffixes (longest match first)
   │     │     try stripping pack.stemmer.prefixes (longest match first)
   │     │     skip pack.stemmer.protected_words
   │     │     transliterate result back (en→am)
   │     └── output: Doc with token.stem set on each token
   │
   ├──▶ Transliterator  (optional — if requested)
   │     ├── uses pack.transliteration.felig or .sera map
   │     └── output: Doc with token.transliterated set
   │
   └──▶ (future) SentimentClassifier, NERTagger — same Doc, same pattern

3. Developer accesses:
   doc.tokens[0].text          → "ልጆቻቸውን"
   doc.tokens[0].stem          → "ልጅ"
   doc.tokens[0].is_stop       → false
   doc.tokens[0].transliterated→ "lijocacewn"
   doc.sentences[0].text       → "ልጆቻቸውን ወደ ትምህርት ቤት ላኩ"
   doc.sentences[0].tokens     → [Token, Token, Token, Token, Token]
```

---

## Summary

spaCy is the gold standard for production NLP. ፊደል Tools is not trying to
replace it for English or European languages — spaCy does that better than
anyone.

What ፊደል does is take spaCy's core insight (pipeline + Doc + composable
components) and rebuild it with three specific improvements for the Ethiopic
context:

1. **JSON packs instead of Python classes** — community can contribute without
   being engineers
2. **Script adapters as a first-class layer** — Ethiopic script logic is modeled
   explicitly, shared across languages, not reimplemented per language
3. **Normalization-first** — phonetic equivalence collapsing happens before
   anything else, solving the core ambiguity problem of Ethiopic text at the
   source

If ፊደል succeeds, the end state is: anyone working with any Ethiopic language —
Amharic, Tigrinya, Oromo, Sidama, Somali, Afar, Gurage — installs one package,
drops in their language JSON file, and gets a working preprocessing pipeline.
No machine learning required. No PhD required. Just a JSON file and thirty
minutes.

That is what spaCy never solved for this part of the world.
