// components/ShowCard.tsx
import Link from 'next/link'
import { Show } from '@/types'

export default function ShowCard({ show }: { show: Show }) {
  return (
    <Link href={`/${show.id}`}>
      <div className="group cursor-pointer">
        {/* 아트워크 */}
        <div className="relative aspect-square overflow-hidden rounded-sm mb-3">
          {show.artwork_url ? (
            <img
              src={show.artwork_url}
              alt={show.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-nc-surface2 flex items-center justify-center">
              <span className="text-nc-text-muted text-4xl">🎭</span>
            </div>
          )}
          {/* 호버시 오버레이 */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-nc-accent flex items-center justify-center">
              <span className="text-black text-lg">▶</span>
            </div>
          </div>
        </div>

        {/* 텍스트 */}
        <div>
          <h2 className="text-sm font-medium text-nc-text group-hover:text-nc-accent transition-colors truncate">
            {show.title}
          </h2>
          <p className="font-mono text-[10px] text-nc-text-muted mt-1">
            {show.year} {show.season == 'F' ? 'Fall' : 'Spring'}
          </p>
        </div>
      </div>
    </Link>
  )
}
