import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { z } from 'zod'
import { embedText, similarity } from './embeddings'
import {
  type Highlight,
  highlights as highlightsClient,
  highlightsSchema,
} from './readwise'

const highlightDataSchema = highlightsSchema.extend({
  relationships: z.array(
    z.object({
      highlightId: z.number(),
      similarity: z.number(),
    })
  ),
})

const highlightsTableSchema = z.array(highlightDataSchema)

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

export type HighlightData = z.infer<typeof highlightDataSchema>

export const db = {
  highlights: {
    fileName: 'data/highlights.json',
    get: async (): Promise<HighlightData[]> => {
      if (!existsSync(db.highlights.fileName)) {
        const res = await highlightsClient.get()
        const embeddings = await db.embeddings.save(res.results)
        const embeddingsMap = new Map(
          embeddings.map((e) => [e.highlightId, e.embedding])
        )
        const highlights = res.results.map((highlight) => ({
          ...highlight,
          relationships: res.results
            .map((h) => ({
              highlightId: h.id,
              similarity: similarity(
                embeddingsMap.get(highlight.id)!,
                embeddingsMap.get(h.id)!
              ),
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(1), // exclude the first relationship (the highlight itself)
        }))
        await db.highlights.save(highlights)
        return highlights
      }

      const highlights = highlightsTableSchema.parse(
        JSON.parse(await readFile(db.highlights.fileName, 'utf-8'))
      )
      return highlights
    },
    save: async (highlights: HighlightData[]) => {
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
        await db.embeddings.save([])
        return []
      }
      return JSON.parse(
        await readFile(db.embeddings.fileName, 'utf-8')
      ) as HighlightEmbedding[]
    },
    save: async (highlights: Highlight[]): Promise<HighlightEmbedding[]> => {
      const embeddings = await Promise.all(
        highlights.map(async (highlight) => {
          const [embedding] = await embedText(highlight.text)
          return {
            highlightId: highlight.id,
            embedding,
          }
        })
      )
      ensureDir(db.embeddings.fileName)
      await writeFile(
        db.embeddings.fileName,
        JSON.stringify(embeddings, null, 2)
      )
      return embeddings
    },
  },
}
