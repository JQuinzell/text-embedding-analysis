import { db } from '@/app/db'
import { Highlight } from './Highlight'
import { HighlightsProvider } from './HighlightsContext'

export const Highlights = async () => {
  const highlights = await db.highlights.get()
  return (
    <HighlightsProvider highlights={highlights}>
      <ul>
        {highlights.map((highlight) => (
          <li key={highlight.id}>
            <Highlight highlight={highlight} />
          </li>
        ))}
      </ul>
    </HighlightsProvider>
  )
}
