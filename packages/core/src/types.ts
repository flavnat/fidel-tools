export interface LanguagePackMeta {
  code: string
  name: string
  script: string
}

export interface StemmerConfig {
  suffix_list: string
  prefix_list: string
}

export interface TransliterationConfig {
  sera: Record<string, string>
  felig: Record<string, string>
}

export interface LanguagePack {
  meta: LanguagePackMeta
  stopwords: string[]
  abbreviations: Record<string, string>
  stemmer: StemmerConfig
  transliteration: TransliterationConfig
}
