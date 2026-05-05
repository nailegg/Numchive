'use client'

import { Track } from '@/types'

interface PlaylistCoverProps {
  tracks: Track[]
  size?: 'sm' | 'lg'
}

export default function PlaylistCover({ tracks, size = 'sm' }: PlaylistCoverProps) {
  const artworkUrls = tracks
    .map(track => track.show_artwork_url)
    .filter((url): url is string => Boolean(url))
    .filter((url, index, urls) => urls.indexOf(url) === index)
    .slice(0, 4)

  const sizeClass = size === 'lg' ? 'h-64 w-64' : 'aspect-square w-full'

  if (!artworkUrls.length) {
    return (
      <div className={`${sizeClass} overflow-hidden rounded-sm bg-nc-surface2 flex items-center justify-center border border-white/10`}>
        <span className={size === 'lg' ? 'text-6xl text-nc-text-muted' : 'text-3xl text-nc-text-muted'}>
          ♪
        </span>
      </div>
    )
  }

  if (artworkUrls.length === 1) {
    return (
      <div className={`${sizeClass} overflow-hidden rounded-sm bg-nc-surface2 border border-white/10`}>
        <img src={artworkUrls[0]} alt="" className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div className={`${sizeClass} grid grid-cols-2 overflow-hidden rounded-sm bg-nc-surface2 border border-white/10`}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="min-h-0 min-w-0">
          {artworkUrls[index] ? (
            <img src={artworkUrls[index]} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-nc-surface2" />
          )}
        </div>
      ))}
    </div>
  )
}
