// components/TrackList.tsx
'use client'
import { usePlayerStore } from '@/store/playerStore'
import { Track } from '@/types'

interface ShowInfo {
  title: string
  artwork_url: string | null
}

interface TrackListProps {
  tracks: Track[]
  show: ShowInfo    // ← Show 타입 대신 필요한 것만
}

export default function TrackList({ tracks, show }: TrackListProps) {
  const { setTrack, currentTrack } = usePlayerStore()

  const sortedTracks = [...tracks].sort((a, b) =>
    (a.numbering ?? 0) - (b.numbering ?? 0)
  )

  function handleTrackClick(track: Track) {
    const tracksWithShow = sortedTracks.map(t => ({
      ...t,
      show_title: show.title,
      show_artwork_url: show.artwork_url ?? undefined,
    }))
    usePlayerStore.setState({ queue: tracksWithShow })
    setTrack({
      ...track,
      show_title: show.title,
      show_artwork_url: show.artwork_url ?? undefined,
    })
  }

  return (
    <ul className="flex flex-col">
      {sortedTracks.map((track, i) => (
        <li
          key={track.id}
          onClick={() => handleTrackClick(track)}
          className={`
            grid grid-cols-[40px_1fr_auto] items-center
            gap-4 px-4 py-3 rounded-sm cursor-pointer
            border border-transparent transition-all duration-150
            hover:bg-white/5 hover:border-white/10
            ${currentTrack?.id === track.id ? 'bg-nc-accent/5 border-nc-accent/15' : ''}
          `}
        >
          <span className={`font-mono text-xs text-center ${currentTrack?.id === track.id ? 'text-nc-accent' : 'text-nc-text-muted'}`}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p className={`text-sm truncate ${currentTrack?.id === track.id ? 'text-nc-accent' : 'text-nc-text'}`}>
              {track.title}
            </p>
          </div>
          {track.duration && (
            <span className="font-mono text-[11px] text-nc-text-muted">
              {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}