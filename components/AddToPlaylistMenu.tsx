'use client'

import { useEffect, useRef, useState } from 'react'
import { Track } from '@/types'
import { usePlayerStore } from '@/store/playerStore'

interface AddToPlaylistMenuProps {
  track: Track
  side?: 'top' | 'bottom'
}

export default function AddToPlaylistMenu({ track, side = 'bottom' }: AddToPlaylistMenuProps) {
  const { savedPlaylists, createPlaylist, addTrackToPlaylist, selectPlaylist } = usePlayerStore()
  const [isOpen, setIsOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function handleCreatePlaylist(e: React.FormEvent) {
    e.preventDefault()
    const playlistId = createPlaylist(newPlaylistName || `새 플레이리스트 ${savedPlaylists.length + 1}`)
    addTrackToPlaylist(playlistId, track)
    selectPlaylist(playlistId)
    setNewPlaylistName('')
    setIsOpen(false)
  }

  function handleAdd(playlistId: string) {
    addTrackToPlaylist(playlistId, track)
    selectPlaylist(playlistId)
    setIsOpen(false)
  }

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(open => !open)
        }}
        className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-nc-text-muted transition-colors hover:bg-white/10 hover:text-nc-text"
        aria-label={`${track.title} 플레이리스트에 추가`}
      >
        +
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            absolute right-0 z-[300] w-56 overflow-hidden rounded-sm
            border border-white/10 bg-nc-surface shadow-2xl
            ${side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
          `}
        >
          <div className="border-b border-white/10 px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-nc-text-muted">
              플레이리스트에 추가
            </p>
          </div>

          <div className="max-h-48 overflow-y-auto py-1">
            {savedPlaylists.length ? (
              savedPlaylists.map(playlist => {
                const isAdded = playlist.tracks.some(item => item.id === track.id)

                return (
                  <button
                    key={playlist.id}
                    onClick={() => handleAdd(playlist.id)}
                    disabled={isAdded}
                    className="
                      flex w-full items-center justify-between gap-3 px-3 py-2
                      text-left transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs text-nc-text">{playlist.name}</span>
                      <span className="font-mono text-[9px] text-nc-text-muted">
                        {playlist.tracks.length} tracks
                      </span>
                    </span>
                    {isAdded && (
                      <span className="font-mono text-[9px] text-nc-accent">추가됨</span>
                    )}
                  </button>
                )
              })
            ) : (
              <p className="px-3 py-3 text-xs text-nc-text-muted">
                아직 플레이리스트가 없습니다
              </p>
            )}
          </div>

          <form onSubmit={handleCreatePlaylist} className="flex gap-2 border-t border-white/10 p-2">
            <input
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="새 플레이리스트"
              className="
                h-7 min-w-0 flex-1 rounded-sm border border-white/10 bg-white/5 px-2
                text-xs text-nc-text placeholder:text-nc-text-muted
                focus:border-nc-accent/50 focus:outline-none
              "
            />
            <button
              type="submit"
              className="h-7 rounded-sm bg-nc-accent px-2 font-mono text-[10px] text-black transition-colors hover:bg-nc-accent2"
            >
              생성
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
