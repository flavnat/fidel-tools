export type PreviewTabId =
    | "pipeline"
    | "transliterator"
    | "stemmer"
    | "stopword"
    | "lexical";

export type TransLang = "am" | "en";

export interface PipelineLike {
    lexAnalyze(inputText: string): string;
    removeStopwords(inputText: string): string;
    stem(word: string): string;
    feligTransliterate(inputText: string, language: TransLang): string;
}

export interface LanguagePackLike {
    stopwords: string[];
    tokenization?: {
        exceptions: Record<string, string[]>;
    };
}
