// app/page.tsx
import { supabase } from '@/lib/supabase'
import ShowCard from '@/components/ShowCard'

export default async function Home() {
  const { data: shows, error } = await supabase
    .from('shows')
    .select('*')
    .order('year', { ascending: false })

  if (error) return (
    <div className="flex items-center justify-center h-screen text-nc-text-muted">
      에러가 발생했습니다: {error.message}
    </div>
  )

  if (!shows?.length) return (
    <div className="flex items-center justify-center h-screen text-nc-text-muted">
      공연 정보가 없습니다
    </div>
  )

  return (
    <div className="px-8 py-10">
      {/* 헤더 */}
      <div className="mb-8 pb-6 border-b border-white/10">
        <p className="font-mono text-[9px] tracking-[0.2em] text-nc-accent uppercase mb-2">
          Archive
        </p>
        <h1 className="font-display text-3xl font-light text-nc-text">
          공연 목록
        </h1>
      </div>

      {/* 공연 그리드 */}
      <div className="grid grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
        {shows.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  )
}