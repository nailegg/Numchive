import ShowNav from '@/components/ShowNav'
import LibrarySidebar from '@/components/LibrarySidebar'
import PlaylistPage from '@/components/PlaylistPage'

interface PageProps {
  params: Promise<{ playlistId: string }>
}

export default async function PlaylistRoute({ params }: PageProps) {
  const { playlistId } = await params

  return (
    <div className="flex h-[calc(100vh-84px-var(--nc-player-height))]">
      <aside className="w-72 flex-shrink-0 border-r border-white/15 flex flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col border-b border-white/15">
          <div className="px-4 py-4 border-b border-white/15 flex-shrink-0">
            <p className="font-mono text-[11px] tracking-[0.18em] text-nc-text-muted uppercase">
              공연 목록
            </p>
          </div>
          <div className="flex-1 overflow-y-auto py-3">
            <ShowNav />
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <LibrarySidebar />
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-hidden">
        <PlaylistPage playlistId={playlistId} />
      </main>
    </div>
  )
}
