// Separates words, expands abbreviations, removes numbers, breaks up hyphenated words, and removes punctuation
import type { LanguagePack } from './types.js'

/**
 * Separates words, expands abbreviations, removes numbers, breaks up hyphenated words, and removes punctuation
 * @param corpus : Amharic text
 * @param pack : language pack configuration
 * @returns : Lexically analyzed Amharic text
 */
export function lexAnalyze(corpus: string, pack: LanguagePack): string {
  // Remove abbreviations
  for (const key in pack.abbreviations) {
    let regex = new RegExp(`${key}`)
    corpus = corpus.replace(regex, `${pack.abbreviations[key]}`)
  }

  corpus = corpus
    .replace(/[.\?"',/#!$%^&*;:፤።{}=\-_`~()]/g, " ")
    .replace(/[.፩፪፫፬፭፮፮፰፱፲፳፴፵፵፷፸፹፺፻0123456789]/g, " ")
    .replace(/\s{2,}/g, " ")

  return corpus
}

export default lexAnalyze
