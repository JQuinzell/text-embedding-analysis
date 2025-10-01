'use client'

import type { HighlightData } from './db'
import { useHighlights } from './HighlightsContext'

type Props = {
  highlight: HighlightData
}

export const Highlight = ({ highlight }: Props) => {
  const highlightMap = useHighlights()
  return (
    <div className='border border-gray-200 rounded-lg p-4 mb-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800'>
          Book: {highlight.book_id}
        </h3>
        <button
          onClick={() => {
            console.log('Highlight text:', highlight.text)

            const relationshipsData = highlight.relationships
              .slice(0, 5)
              .map((relationship) => {
                const relatedHighlight = highlightMap.get(
                  relationship.highlightId
                )
                return {
                  similarity: relationship.similarity,
                  text: relatedHighlight?.text || 'Highlight not found',
                }
              })

            console.table(relationshipsData)
          }}
          className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          Show Text
        </button>
      </div>
      <p>{highlight.text}</p>
    </div>
  )
}
