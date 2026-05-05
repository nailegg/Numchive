// components/ShowCard.tsx
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlayIcon, TheaterIcon } from '@hugeicons/core-free-icons'
import { Show } from '@/types'

interface ShowCardProps {
  show: Show
  isActive?: boolean  // ← 추가
}

export default function ShowCard({ show, isActive = false }: ShowCardProps) {
  return (
    <Link href={`/${show.id}`}>
      <div className="group cursor-pointer">
        {/* 아트워크 */}
        <div className={`
          relative aspect-square overflow-hidden rounded-sm mb-3 border border-white/15 bg-nc-surface2
          ${isActive ? 'ring-1 ring-nc-accent' : ''}
        `}>
          {show.artwork_url ? (
            <img
              src={show.artwork_url}
              alt={show.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-nc-surface2 flex items-center justify-center">
              <HugeiconsIcon icon={TheaterIcon} size={34} color="currentColor" className="text-nc-text-muted" />
            </div>
          )}
          {/* 호버시 오버레이 */}
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-nc-accent text-black flex items-center justify-center shadow-[0_12px_35px_rgba(0,0,0,0.35)]">
              <HugeiconsIcon icon={PlayIcon} size={18} color="currentColor" />
            </div>
          </div>
        </div>

        {/* 텍스트 */}
        <div>
          <h2 className={`
            text-sm font-medium truncate transition-colors
            ${isActive ? 'text-nc-accent' : 'text-nc-text group-hover:text-nc-accent'}
          `}>
            {show.title}
          </h2>
          <p className="font-mono text-[11px] text-nc-text-muted mt-1">
            {show.year}{show.season ? ` · ${show.season}` : ''}
          </p>
        </div>
      </div>
    </Link>
  )
}
