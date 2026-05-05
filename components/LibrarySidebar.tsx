'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import PlaylistCard from '@/components/PlaylistCard'
import { usePlayerStore } from '@/store/playerStore'

export default function LibrarySidebar() {
  const { savedPlaylists, createPlaylist, selectPlaylist } = usePlayerStore()
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  function handleCreatePlaylist(e: React.FormEvent) {
    e.preventDefault()
    const playlistId = createPlaylist(newPlaylistName || `새 플레이리스트 ${savedPlaylists.length + 1}`)

    selectPlaylist(playlistId)
    setNewPlaylistName('')
    setIsCreateOpen(false)
    router.push(`/playlist/${playlistId}`)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-shrink-0 border-b border-white/15 px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-nc-text-muted">
            플레이리스트
          </p>
          <span className="font-mono text-[11px] text-nc-text-muted">
            {savedPlaylists.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="group block text-left"
          >
            <div
              className="
                mb-2 flex aspect-square w-full items-center justify-center rounded-sm
                border border-dashed border-white/15 bg-white/10
                transition-colors group-hover:border-nc-accent/40 group-hover:bg-nc-accent/10
              "
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-nc-text-muted transition-colors group-hover:bg-nc-accent group-hover:text-black">
                <HugeiconsIcon icon={PlusSignIcon} size={18} color="currentColor" />
              </span>
            </div>
            <p className="truncate text-sm text-nc-text transition-colors group-hover:text-nc-accent">
              새 플레이리스트
            </p>
            <p aria-hidden="true" className="mt-0.5 font-mono text-[11px] text-transparent">
              0
            </p>
          </button>

          {savedPlaylists.map(playlist => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              isActive={pathname === `/playlist/${playlist.id}`}
            />
          ))}
        </div>
      </div>

      {isCreateOpen && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onMouseDown={() => setIsCreateOpen(false)}
        >
          <form
            onSubmit={handleCreatePlaylist}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-80 rounded-sm border border-white/15 bg-nc-surface p-5 shadow-2xl"
          >
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-nc-text-muted">
              새 플레이리스트
            </p>
            <input
              autoFocus
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder={`새 플레이리스트 ${savedPlaylists.length + 1}`}
              className="
                mb-4 h-9 w-full rounded-sm border border-white/15 bg-white/10 px-3
                text-sm text-nc-text placeholder:text-nc-text-muted
                focus:border-nc-accent/50 focus:outline-none
              "
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewPlaylistName('')
                  setIsCreateOpen(false)
                }}
                className="h-8 rounded-sm border border-white/15 bg-white/10 px-3 font-mono text-[11px] text-nc-text-muted transition-colors hover:bg-white/15 hover:text-nc-text"
              >
                취소
              </button>
              <button
                type="submit"
                className="h-8 rounded-sm bg-nc-accent px-3 font-mono text-[11px] text-black transition-colors hover:bg-nc-accent2"
              >
                생성
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
