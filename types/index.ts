import { Database } from './database'

export type Show = Database['public']['Tables']['shows']['Row']
export type Track = Database['public']['Tables']['numbers']['Row'] & {
  show_title?: string   // JOIN 했을 때만 존재하는 필드라 선택적(?)으로
  show_artwork_url?: string
}
export type Person = Database['public']['Tables']['people']['Row']

export type NumberWithShow = Database['public']['Tables']['numbers']['Row'] & {
  shows: {
    id: string
    title: string
    artwork_url: string | null
    year: number | null
    season: string | null
  } | null
}

export type SearchResults = {
  numbers: NumberWithShow[]
  shows: Show[]
}