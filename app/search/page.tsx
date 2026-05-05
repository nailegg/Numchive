import ShowCard from '@/components/ShowCard'
import SearchResultNumbers from '@/components/SearchResultNumbers'
import { searchArchive } from '@/lib/search'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams

  if (!q.trim()) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <p className="font-mono text-[9px] tracking-[0.2em] text-nc-accent uppercase mb-3">Search</p>
        <p className="text-nc-text-muted text-sm">검색어를 입력해주세요</p>
      </div>
    </div>
  )

  const { numbers: finalNumbers, shows: finalShows } = await searchArchive(q)

  const hasResults = finalNumbers.length + finalShows.length > 0

  return (
    <div className="px-12 py-10">

      {/* 헤더 — 검색어만 간단하게 */}
      <div className="mb-8 pb-6 border-b border-white/10">
        <p className="font-mono text-[9px] tracking-[0.2em] text-nc-accent uppercase mb-2">
          Search Results
        </p>
        {!hasResults && (
          <p className="text-nc-text-muted text-sm mt-3">검색 결과가 없습니다</p>
        )}
      </div>

      {!!finalShows.length && (
        <section className="mb-12">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-6">
            <span className="font-mono text-[9px] tracking-[0.18em] text-nc-text-muted uppercase">공연</span>
            <span className="font-mono text-[9px] text-nc-text-muted">{finalShows.length}건</span>
          </div>
          <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {finalShows.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </section>
      )}

      {!!finalNumbers.length && (
        <section>
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
            <span className="font-mono text-[9px] tracking-[0.18em] text-nc-text-muted uppercase">넘버</span>
            <span className="font-mono text-[9px] text-nc-text-muted">{finalNumbers.length}건</span>
          </div>
          <SearchResultNumbers numbers={finalNumbers} />
        </section>
      )}
    </div>
  )
}
