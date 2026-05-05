'use client'

import Link from 'next/link'
import { SavedPlaylist } from '@/store/playerStore'
import PlaylistCover from '@/components/PlaylistCover'

interface PlaylistCardProps {
  playlist: SavedPlaylist
  isActive?: boolean
}

export default function PlaylistCard({ playlist, isActive = false }: PlaylistCardProps) {
  return (
    <Link href={`/playlist/${playlist.id}`} className="group block">
      <div className={`
        relative mb-2 overflow-hidden rounded-sm
        ${isActive ? 'ring-1 ring-nc-accent' : ''}
      `}>
        <PlaylistCover tracks={playlist.tracks} />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
          <div className="h-9 w-9 rounded-full bg-nc-accent text-black flex items-center justify-center text-sm">
            ▶
          </div>
        </div>
      </div>
      <p className={`
        truncate text-xs transition-colors
        ${isActive ? 'text-nc-accent' : 'text-nc-text group-hover:text-nc-accent'}
      `}>
        {playlist.name}
      </p>
      <p className="mt-0.5 font-mono text-[9px] text-nc-text-muted">
        {playlist.tracks.length} tracks
      </p>
    </Link>
  )
}
