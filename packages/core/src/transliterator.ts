// JavaScript implementations of Amharic to ASCII transliterator
import type { LanguagePack } from './types.js'

// Cache for reverse maps to ensure O(1) lookups instead of O(n) linear scans
const reverseMapCache = new WeakMap<Record<string, string>, Record<string, string>>()

function getReverseMap(map: Record<string, string>): Record<string, string> {
  let reverseMap = reverseMapCache.get(map)
  if (!reverseMap) {
    reverseMap = {}
    for (const [key, value] of Object.entries(map)) {
      if (reverseMap[value] === undefined) {
        reverseMap[value] = key
      }
    }
    reverseMapCache.set(map, reverseMap)
  }
  return reverseMap
}

/**
 * @deprecated Internal fallback only. Use {@link felig_transliterate} instead.
 */
export function sera_transliterate(word: string, lang: "am" | "en", pack: LanguagePack) {
  let trans_word = ""
  const sera_transliteration_lookup_table = pack.transliteration.sera.map

  if (lang === "am") {
    let tokens: string[] = word.split("")
    tokens.forEach((letter) => {
      if (sera_transliteration_lookup_table[letter] !== undefined) {
        trans_word += sera_transliteration_lookup_table[letter]
      }
    })
  } else if (lang === "en") {
    let tokens: string[] | null = word.match(/.{1,2}/g)
    if (tokens) {
      const reverseTable = getReverseMap(sera_transliteration_lookup_table)
      tokens.forEach((letter) => {
        const en_letter = reverseTable[letter]
        if (en_letter !== undefined) {
          trans_word += en_letter
        }
      })
    }
  }

  return trans_word
}

/**
 * Transliterates between Amharic and English
 * @param word : English or Amharic word
 * @param lang : language to transliterate form
 * @returns : a transliterated string
 *
 * @example { transliterate Amharic word to English }
 * felig_transliterate("ወንበር","am") // returns "wenber"
 */
export function felig_transliterate(word: string, lang: "am" | "en", pack: LanguagePack) {
  let trans_word = ""
  const felig_transliteration_lookup_table = pack.transliteration.felig.map

  if (lang === "am") {
    let tokens = word.split("")
    tokens.forEach((letter) => {
      if (felig_transliteration_lookup_table[letter] !== undefined) {
        trans_word += felig_transliteration_lookup_table[letter]
      }
    })
  } else if (lang === "en") {
    let tokens = word.match(/.{1,2}/g)

    if (tokens === null) {
      return ""
    }

    const reverseTable = getReverseMap(felig_transliteration_lookup_table)

    tokens.forEach((letter) => {
      if (/[^aeiou][aeiou]/i.test(letter)) {
        let am_letter: string = ""

        if (/[W][a]/g.test(letter)) {
          am_letter = reverseTable[letter.toLowerCase()]!
        } else {
          am_letter = reverseTable[letter]!
        }

        if (am_letter !== undefined) {
          trans_word += am_letter
        }
      } else {
        let ltrs = letter.split("")
        let am_letter = ""
        ltrs.forEach((ltr) => {
          const found = reverseTable[ltr]
          if (found !== undefined) {
            am_letter += found
          }
        })

        if (am_letter !== "" && am_letter !== "ኧ") {
          trans_word += am_letter
        }
      }
    })
  }

  return trans_word
}

const transliterate = {
  sera_transliterate,
  felig_transliterate,
}

export default transliterate
