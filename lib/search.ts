import { supabase } from '@/lib/supabase'
import type { NumberWithShow, SearchResults, Show } from '@/types'

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? ''
}

function scoreText(value: string | null | undefined, query: string) {
  const normalized = normalize(value)
  if (!normalized || !query) return 0
  if (normalized === query) return 100
  if (normalized.startsWith(query)) return 80
  if (normalized.includes(query)) return 60

  return 0
}

function scoreNumber(number: NumberWithShow, query: string) {
  return Math.max(
    scoreText(number.title, query),
    scoreText(number.shows?.title, query)
  )
}

function scoreShow(show: Show, query: string) {
  return scoreText(show.title, query)
}

export async function searchArchive(rawQuery: string): Promise<SearchResults> {
  const q = rawQuery.trim()
  if (!q) return { numbers: [], shows: [] }

  const normalizedQuery = normalize(q)
  const escapedQuery = q.replaceAll('%', '\\%').replaceAll('_', '\\_')
  const pattern = `%${escapedQuery}%`

  const { data: shows, error: showsError } = await supabase
    .from('shows')
    .select('*')
    .ilike('title', pattern)
    .limit(20)

  if (showsError) throw new Error(showsError.message)

  const matchedShows = (shows ?? []) as Show[]
  const matchedShowIds = matchedShows.map(show => show.id)

  const { data: titleMatchedNumbers, error: titleMatchedNumbersError } = await supabase
    .from('numbers')
    .select(`
      *,
      shows (
        id,
        title,
        artwork_url,
        year,
        season
      )
    `)
    .ilike('title', pattern)
    .limit(50)

  if (titleMatchedNumbersError) throw new Error(titleMatchedNumbersError.message)

  const showMatchedNumberRequest = matchedShowIds.length
    ? supabase
        .from('numbers')
        .select(`
          *,
          shows (
            id,
            title,
            artwork_url,
            year,
            season
          )
        `)
        .in('show_id', matchedShowIds)
        .limit(50)
    : null

  const { data: showMatchedNumbers, error: showMatchedNumbersError } = showMatchedNumberRequest
    ? await showMatchedNumberRequest
    : { data: [], error: null }

  if (showMatchedNumbersError) throw new Error(showMatchedNumbersError.message)

  const numberMap = new Map<string, NumberWithShow>()
  ;[...(titleMatchedNumbers ?? []), ...(showMatchedNumbers ?? [])].forEach(number => {
    numberMap.set(number.id, number as NumberWithShow)
  })

  return {
    numbers: [...numberMap.values()]
      .sort((a, b) => {
        const scoreDelta = scoreNumber(b, normalizedQuery) - scoreNumber(a, normalizedQuery)
        if (scoreDelta !== 0) return scoreDelta

        return (a.numbering ?? 0) - (b.numbering ?? 0)
      }),
    shows: matchedShows
      .sort((a, b) => {
        const scoreDelta = scoreShow(b, normalizedQuery) - scoreShow(a, normalizedQuery)
        if (scoreDelta !== 0) return scoreDelta

        return (b.year ?? 0) - (a.year ?? 0)
      }),
  }
}
