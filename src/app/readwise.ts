import z from 'zod'

const DOMAIN = 'https://readwise.io/api/v2'

const authToken = process.env.READWISE_ACCESS_TOKEN

const headers = {
  Authorization: `Token ${authToken}`,
}

export const highlightsSchema = z.object({
  id: z.number(),
  text: z.string(),
  book_id: z.number(),
})

const resultsSchema = z.object({
  count: z.number(),
  next: z.string().nullish(),
  previous: z.string().nullish(),
  results: z.array(highlightsSchema),
})

export type Highlight = z.infer<typeof highlightsSchema>

export const highlights = {
  get: async () => {
    const response = await fetch(`${DOMAIN}/highlights`, { headers })
    return resultsSchema.parse(await response.json())
  },
}
