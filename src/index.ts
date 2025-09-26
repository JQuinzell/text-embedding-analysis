import { writeFile, readFile } from 'node:fs/promises'
import { highlights, type Highlight } from './readwise.js'
import { existsSync } from 'node:fs'
import { embedText } from './embeddings.js'

async function saveHighlights() {
  const res = await highlights.get()
  await writeFile('data/highlights.json', JSON.stringify(res.results, null, 2))
  return res.results
}

async function loadHighlights() {
  if (!existsSync('data/highlights.json')) {
    return saveHighlights()
  }
  return JSON.parse(
    await readFile('data/highlights.json', 'utf-8')
  ) as Highlight[]
}

const main = async () => {
  const highlights = await loadHighlights()
  const vectors = await Promise.all(
    highlights.map(async (highlight) => {
      const [vector] = await embedText(highlight.text)
      return {
        highlightId: highlight.id,
        vector,
      }
    })
  )
  await writeFile('data/vectors.json', JSON.stringify(vectors, null, 2))
}

main()
