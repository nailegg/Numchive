// components/SearchResultNumbers.tsx
'use client'
import { HugeiconsIcon } from '@hugeicons/react'
import { TheaterIcon } from '@hugeicons/core-free-icons'
import { usePlayerStore } from '@/store/playerStore'
import { NumberWithShow, Track } from '@/types'
import AddToPlaylistMenu from '@/components/AddToPlaylistMenu'

interface SearchResultNumbersProps {
  numbers: NumberWithShow[]
}

export default function SearchResultNumbers({ numbers }: SearchResultNumbersProps) {
  const { playSingle } = usePlayerStore()

  function handleClick(number: NumberWithShow) {
    const trackWithShow: Track = {
      ...number,
      show_title: number.shows?.title,
      show_artwork_url: number.shows?.artwork_url ?? undefined,
    }
    playSingle(trackWithShow)
  }

  return (
    <ul className="flex flex-col">
      {numbers.map((number, i) => {
        const trackWithShow: Track = {
          ...number,
          show_title: number.shows?.title,
          show_artwork_url: number.shows?.artwork_url ?? undefined,
        }

        return (
        <li
          key={number.id}
          onClick={() => handleClick(number)}
          className="
            grid grid-cols-[40px_auto_1fr_auto_auto] items-center
            gap-4 px-4 py-3 rounded-sm cursor-pointer
            border border-transparent transition-all duration-150
            hover:bg-white/15 hover:border-white/15
          "
        >
          {/* 번호 */}
          <span className="font-mono text-sm text-nc-text-muted text-center">
            {String(i + 1).padStart(2, '0')}
          </span>

          {/* 아트워크 */}
          <div className="w-10 h-10 rounded-sm overflow-hidden bg-nc-surface2 flex-shrink-0">
            {number.shows?.artwork_url ? (
              <img
                src={number.shows.artwork_url}
                alt={number.shows.title ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-nc-text-muted text-sm">
                <HugeiconsIcon icon={TheaterIcon} size={16} color="currentColor" />
              </div>
            )}
          </div>

          {/* 트랙 정보 */}
          <div className="min-w-0">
            <p className="text-sm text-nc-text truncate">{number.title}</p>
            {number.shows?.title && (
              <p className="font-mono text-[11px] text-nc-text-muted mt-0.5">
                {number.shows.title}
              </p>
            )}
          </div>

          {/* 재생 시간 */}
          {number.duration && (
            <span className="font-mono text-[11px] text-nc-text-muted flex-shrink-0">
              {Math.floor(number.duration / 60)}:{String(number.duration % 60).padStart(2, '0')}
            </span>
          )}
          <AddToPlaylistMenu track={trackWithShow} />
        </li>
      )})}
    </ul>
  )
}
