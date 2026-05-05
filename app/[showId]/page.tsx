// app/[showId]/page.tsx
import { supabase } from '@/lib/supabase'
import TrackList from '@/components/TrackList'
import ShowNav from '@/components/ShowNav'
import ShowPlayButtons from '@/components/ShowPlayButtons'
import LibrarySidebar from '@/components/LibrarySidebar'

interface PageProps {
  params: Promise<{ showId: string }>
}

export default async function ShowPage({ params }: PageProps) {
  const { showId } = await params

  const { data: show, error } = await supabase
    .from('shows')
    .select(`*, numbers (*)`)
    .eq('id', showId)
    .order('numbering', { referencedTable: 'numbers', ascending: true })
    .single()

  if (error) return (
    <div className="flex items-center justify-center h-screen text-nc-text-muted">
      에러가 발생했습니다: {error.message}
    </div>
  )

  if (!show) return (
    <div className="flex items-center justify-center h-screen text-nc-text-muted">
      공연 정보가 없습니다
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-148px)]">
                  

      {/* 좌측 사이드바 — 공연 목록 + 플레이리스트 */}
      <aside className="w-72 flex-shrink-0 border-r border-white/10 flex flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col border-b border-white/10">
          <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
            <p className="font-mono text-[9px] tracking-[0.18em] text-nc-text-muted uppercase">
              공연 목록
            </p>
          </div>
          <div className="flex-1 overflow-y-auto py-3">
            <ShowNav currentShowId={showId} />
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <LibrarySidebar />
        </div>
      </aside>

      {/* 우측 메인 — 공연 상세 */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* 공연 헤더 */}
        <div className="relative h-54 overflow-hidden flex-shrink-0">
          {show.artwork_url && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{
                backgroundImage: `url(${show.artwork_url})`,
                filter: 'blur(20px)',
                opacity: 0.3,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-nc-bg via-nc-bg/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-10 pb-6 flex items-end gap-6">
            <div className="w-24 h-24 rounded flex-shrink-0 overflow-hidden shadow-2xl border border-white/10">
              {show.artwork_url ? (
                <img src={show.artwork_url} alt={show.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-nc-surface2 flex items-center justify-center text-3xl">🎭</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[9px] tracking-[0.2em] text-nc-accent mb-1">
                {show.year} · {show.season == 'F' ? 'Fall' : 'Spring'}
              </p>
              <h1 className="font-display text-4xl font-light text-nc-text leading-none mb-3 truncate">
                {show.title}
              </h1>
              <div className="flex gap-3">
                <ShowPlayButtons
                  tracks={show.numbers ?? []}
                  show={{ title: show.title, artwork_url: show.artwork_url }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 트랙 목록 */}
        <div className="flex flex-col flex-1 min-h-0 px-10 py-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-1 flex-shrink-0">
            <span className="font-mono text-[9px] tracking-[0.18em] text-nc-text-muted uppercase">
              트랙 목록
            </span>
            <span className="font-mono text-[9px] text-nc-text-muted">
              {show.numbers?.length ?? 0} tracks
            </span>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            <TrackList tracks={show.numbers ?? []} show={{
              title: show.title,
              artwork_url: show.artwork_url,
            }} />
          </div>
        </div>

      </div>
    </div>
  )
}
