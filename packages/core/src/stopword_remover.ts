// Removes stop words
import type { LanguagePack } from './types.js'

/**
 * Removes commonly occuring words that have no contribution to the semantics of the corpus.
 * @param corpus : Amharic text
 * @param pack : language pack configuration
 * @returns : the corpus without stopwords listed on {@link LanguagePack.stopwords}
 *
 * @example {remove stopwords}
 * removeStopwords("ይህ ሞባይል እና ኮምፒዩተር", amPack) // returns "ሞባይል ኮምፒዩተር"
 */
export function removeStopwords(corpus: string, pack: LanguagePack): string {
  pack.stopwords.forEach((word) => {
    corpus = corpus.replaceAll(word, "")
  })

  return corpus
}

export default removeStopwords
