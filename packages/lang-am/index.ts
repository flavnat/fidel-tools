import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import type { LanguagePack } from '@fidel-tools/core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pack: LanguagePack = JSON.parse(
  readFileSync(join(__dirname, '../am.json'), 'utf8')
)

export default pack
export type { LanguagePack }
