import type { LanguagePack } from './types.js'

/**
 * Normalizes Amharic text by applying character mapping,
 * labialized sequence normalization, and gemination collapse.
 *
 * @param text The input string to normalize.
 * @param pack The language pack containing normalization configuration.
 * @returns The normalized string.
 */
export function normalize(text: string, pack: LanguagePack): string {
  if (!pack.normalization) {
    return text
  }

  let normalized = text

  // 1. Apply char_map
  const charMap = pack.normalization.char_map || {}
  let chars = normalized.split("")
  for (let i = 0; i < chars.length; i++) {
    if (charMap[chars[i]] !== undefined) {
      chars[i] = charMap[chars[i]]
    }
  }
  normalized = chars.join("")

  // 2. Apply labialized_map
  const labializedMap = pack.normalization.labialized_map || {}
  let chars2 = normalized.split("")
  for (let i = 0; i < chars2.length; i++) {
    if (labializedMap[chars2[i]] !== undefined) {
      chars2[i] = labializedMap[chars2[i]]
    }
  }
  normalized = chars2.join("")

  // 3. Collapse gemination
  const threshold = pack.normalization.gemination_threshold
  if (threshold !== undefined && threshold > 0) {
    const regex = new RegExp(`([^\\s])\\1{${threshold},}`, 'g')
    normalized = normalized.replace(regex, (match, p1) => p1.repeat(threshold))
  }

  return normalized
}

export default normalize
