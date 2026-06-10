import type { LanguagePack } from './types.js'
import { stem } from './stemmer.js'
import { removeStopwords } from './stopword_remover.js'
import { lexAnalyze } from './lexical_analyzer.js'
import { felig_transliterate, sera_transliterate } from './transliterator.js'
import { indexDocuments, indexQuery } from './indexer.js'
import { weighTerms } from './term_weighter.js'
import type { DocIndexData, QueryIndexData } from './indexer.js'

export class Pipeline {
  constructor(private pack: LanguagePack) {}

  stem(word: string): string {
    return stem(word, this.pack)
  }
  removeStopwords(corpus: string): string {
    return removeStopwords(corpus, this.pack)
  }
  lexAnalyze(corpus: string): string {
    return lexAnalyze(corpus, this.pack)
  }
  feligTransliterate(word: string, lang: "am" | "en"): string {
    return felig_transliterate(word, lang, this.pack)
  }
  seraTransliterate(word: string, lang: "am" | "en"): string {
    return sera_transliterate(word, lang, this.pack)
  }
  indexDocuments(docs: Array<{ id: string; content: string }>): DocIndexData {
    return indexDocuments(docs, this.pack)
  }
  indexQuery(query: string): QueryIndexData {
    return indexQuery(query, this.pack)
  }
  weighTerms(index: DocIndexData | QueryIndexData, type: "doc" | "query") {
    return weighTerms(index, type)
  }
}
