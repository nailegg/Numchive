// components/ShowPlayButtons.tsx
'use client'
import { usePlayerStore } from '@/store/playerStore'
import { Track } from '@/types'

interface ShowPlayButtonsProps {
  tracks: Track[]
  show: { title: string, artwork_url: string | null }
}

export default function ShowPlayButtons({ tracks, show }: ShowPlayButtonsProps) {
  const { playAll, playShuffle } = usePlayerStore()

  // show 정보를 트랙에 붙이기
  const tracksWithShow = tracks.map(t => ({
    ...t,
    show_title: show.title,
    show_artwork_url: show.artwork_url ?? undefined,
  }))

  return (
    <div className="flex gap-3">
      <button
        onClick={() => playAll(tracksWithShow)}
        className="flex items-center gap-2 px-4 py-2 bg-nc-accent text-black text-xs font-mono tracking-wide rounded-sm hover:bg-nc-accent2 transition-colors"
      >
        ▶ 전체 재생
      </button>
      <button
        onClick={() => playShuffle(tracksWithShow)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-nc-text-dim text-xs font-mono tracking-wide rounded-sm hover:bg-white/10 transition-colors"
      >
        ⇄ 셔플 재생
      </button>
    </div>
  )
}