// components/ShowNav.tsx
import { supabase } from '@/lib/supabase'
import ShowCard from './ShowCard'

interface ShowNavProps {
  currentShowId?: string
}

export default async function ShowNav({ currentShowId }: ShowNavProps) {
  const { data: shows } = await supabase
    .from('shows')
    .select('*')
    .order('year', { ascending: false })

  if (!shows?.length) return null

  return (
    <div className="grid grid-cols-2 gap-2 px-3">
      {shows.map(show => (
        <ShowCard
          key={show.id}
          show={show}
          isActive={currentShowId === show.id}
        />
      ))}
    </div>
  )
}
