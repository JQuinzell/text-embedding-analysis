import { writeFile } from 'node:fs/promises'
import { highlights } from './readwise.js'

const main = async () => {
  const res = await highlights.get()
  await writeFile('data/highlights.json', JSON.stringify(res.results, null, 2))
}

main()
