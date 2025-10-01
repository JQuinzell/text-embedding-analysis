'use client'

import { createContext, useContext } from 'react'
import type { HighlightData } from '@/app/db'

const HighlightsContext = createContext<Map<number, HighlightData>>(new Map())

type Props = {
  highlights: HighlightData[]
  children: React.ReactNode
}

export const HighlightsProvider = ({ children, highlights }: Props) => {
  const value = new Map(
    highlights.map((highlight) => [highlight.id, highlight])
  )
  return (
    <HighlightsContext.Provider value={value}>
      {children}
    </HighlightsContext.Provider>
  )
}

export const useHighlights = () => {
  return useContext(HighlightsContext)
}
