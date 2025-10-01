import { db } from '@/app/db'
import { Highlight } from './Highlight'

export const Highlights = async () => {
  const highlights = await db.highlights.get()
  return (
    <ul>
      {highlights.map((highlight) => (
        <li key={highlight.id}>
          <Highlight highlight={highlight} />
        </li>
      ))}
    </ul>
  )
}
