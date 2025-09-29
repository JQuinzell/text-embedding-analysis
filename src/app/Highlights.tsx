import { db } from '@/app/db'

export const Highlights = async () => {
  const highlights = await db.highlights.get()
  return (
    <ul>
      {highlights.map((highlight) => (
        <li key={highlight.id}>{highlight.text}</li>
      ))}
    </ul>
  )
}
