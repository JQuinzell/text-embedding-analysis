import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { z } from 'zod'
import { embedText } from './embeddings'
import { type Highlight, highlights, highlightsSchema } from './readwise'

const highlightsTableSchema = z.array(highlightsSchema)

const ensureDir = (filePath: string) => {
  const dir = dirname(filePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

type HighlightEmbedding = {
  highlightId: number
  embedding: number[]
}

export const db = {
  highlights: {
    fileName: 'data/highlights.json',
    get: async () => {
      if (!existsSync(db.highlights.fileName)) {
        const res = await highlights.get()
        await db.highlights.save(res.results)
        return res.results
      }
      return highlightsTableSchema.parse(
        JSON.parse(await readFile(db.highlights.fileName, 'utf-8'))
      )
    },
    save: async (highlights: Highlight[]) => {
      ensureDir(db.highlights.fileName)
      await writeFile(
        db.highlights.fileName,
        JSON.stringify(highlights, null, 2)
      )
    },
  },
  embeddings: {
    fileName: 'data/embeddings.json',
    get: async () => {
      if (!existsSync(db.embeddings.fileName)) {
        return []
      }
      return JSON.parse(
        await readFile(db.embeddings.fileName, 'utf-8')
      ) as HighlightEmbedding[]
    },
    save: async (highlights: Highlight[]) => {
      const embeddings = await Promise.all(
        highlights.map(async (highlight) => {
          return {
            highlightId: highlight.id,
            embedding: await embedText(highlight.text),
          }
        })
      )
      ensureDir(db.embeddings.fileName)
      await writeFile(
        db.embeddings.fileName,
        JSON.stringify(embeddings, null, 2)
      )
    },
  },
}
