'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { MusicNoteSquare01Icon } from '@hugeicons/core-free-icons'
import { Track } from '@/types'

interface PlaylistCoverProps {
  tracks: Track[]
  size?: 'sm' | 'md' | 'lg'
}

export default function PlaylistCover({ tracks, size = 'sm' }: PlaylistCoverProps) {
  const artworkUrls = tracks
    .map(track => track.show_artwork_url)
    .filter((url): url is string => Boolean(url))
    .filter((url, index, urls) => urls.indexOf(url) === index)
    .slice(0, 4)

  const sizeClass = size === 'lg'
    ? 'h-64 w-64'
    : size === 'md'
    ? 'h-24 w-24'
    : 'aspect-square w-full'

  if (!artworkUrls.length) {
    return (
      <div className={`${sizeClass} overflow-hidden rounded-sm bg-nc-surface2 flex items-center justify-center border border-white/15`}>
        <HugeiconsIcon
          icon={MusicNoteSquare01Icon}
          size={size === 'lg' ? 58 : size === 'md' ? 28 : 30}
          color="currentColor"
          className="text-nc-text-muted"
        />
      </div>
    )
  }

  if (artworkUrls.length === 1) {
    return (
      <div className={`${sizeClass} overflow-hidden rounded-sm bg-nc-surface2 border border-white/15`}>
        <img src={artworkUrls[0]} alt="" className="h-full w-full object-cover" />
      </div>
    )
  }

  if (artworkUrls.length === 2) {
    return (
      <div className={`${sizeClass} grid grid-cols-2 overflow-hidden rounded-sm bg-nc-surface2 border border-white/15`}>
        {artworkUrls.map(url => (
          <div key={url} className="min-h-0 min-w-0">
            <img src={url} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    )
  }

  if (artworkUrls.length === 3) {
    return (
      <div className={`${sizeClass} grid grid-cols-2 grid-rows-2 overflow-hidden rounded-sm bg-nc-surface2 border border-white/15`}>
        <div className="row-span-2 min-h-0 min-w-0">
          <img src={artworkUrls[0]} alt="" className="h-full w-full object-cover" />
        </div>
        {artworkUrls.slice(1).map(url => (
          <div key={url} className="min-h-0 min-w-0">
            <img src={url} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`${sizeClass} grid grid-cols-2 grid-rows-2 overflow-hidden rounded-sm bg-nc-surface2 border border-white/15`}>
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
