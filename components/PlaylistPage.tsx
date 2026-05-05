'use client'

import { useRouter } from 'next/navigation'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import PlaylistCover from '@/components/PlaylistCover'
import { Track } from '@/types'
import { usePlayerStore } from '@/store/playerStore'

interface PlaylistPageProps {
  playlistId: string
}

interface PlaylistTrackRowProps {
  playlistId: string
  playlistName: string
  tracks: Track[]
  track: Track
  index: number
}

function formatDuration(seconds: number | null) {
  if (!seconds) return null

  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function PlaylistTrackRow({ playlistId, playlistName, tracks, track, index }: PlaylistTrackRowProps) {
  const { currentTrack, playQueue, removeTrackFromPlaylist } = usePlayerStore()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id })
  const duration = formatDuration(track.duration)
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`
      : undefined,
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      onClick={() => playQueue({
        source: 'playlist',
        sourceId: playlistId,
        sourceTitle: playlistName,
        tracks,
      }, track.id)}
      className={`
        grid grid-cols-[32px_28px_44px_1fr_auto_auto] items-center gap-4
        rounded-sm border border-transparent px-4 py-3 cursor-pointer
        transition-all hover:bg-white/5 hover:border-white/10
        ${currentTrack?.id === track.id ? 'bg-nc-accent/5 border-nc-accent/15' : ''}
        ${isDragging ? 'opacity-80 bg-white/10' : ''}
      `}
    >
      <span className={`font-mono text-xs text-center ${currentTrack?.id === track.id ? 'text-nc-accent' : 'text-nc-text-muted'}`}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab text-nc-text-muted active:cursor-grabbing"
        aria-label="트랙 순서 변경"
      >
        ⋮⋮
      </button>
      <div className="h-11 w-11 overflow-hidden rounded-sm bg-nc-surface2">
        {track.show_artwork_url ? (
          <img src={track.show_artwork_url} alt={track.show_title ?? ''} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-nc-text-muted">♪</div>
        )}
      </div>
      <div className="min-w-0">
        <p className={`truncate text-sm ${currentTrack?.id === track.id ? 'text-nc-accent' : 'text-nc-text'}`}>
          {track.title}
        </p>
        <p className="mt-0.5 truncate font-mono text-[10px] text-nc-text-muted">
          {track.show_title}
        </p>
      </div>
      {duration && (
        <span className="font-mono text-[11px] text-nc-text-muted">
          {duration}
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          removeTrackFromPlaylist(playlistId, track.id)
        }}
        className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-nc-text-muted transition-colors hover:bg-white/10 hover:text-nc-text"
        aria-label={`${track.title} 제거`}
      >
        제거
      </button>
    </li>
  )
}

export default function PlaylistPage({ playlistId }: PlaylistPageProps) {
  const {
    savedPlaylists,
    renamePlaylist,
    deletePlaylist,
    playPlaylist,
    playPlaylistShuffle,
    reorderPlaylistTracks,
  } = usePlayerStore()
  const router = useRouter()
  const playlist = savedPlaylists.find(item => item.id === playlistId)

  if (!playlist) {
    return (
      <div className="flex h-full items-center justify-center text-center text-sm text-nc-text-muted">
        플레이리스트를 찾을 수 없습니다
      </div>
    )
  }

  const activePlaylist = playlist

  function handleRenamePlaylist(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)

    renamePlaylist(playlistId, String(formData.get('playlistName') ?? ''))
  }

  function handleDeletePlaylist() {
    const shouldDelete = window.confirm(`'${activePlaylist.name}' 플레이리스트를 삭제할까요?`)
    if (!shouldDelete) return

    deletePlaylist(activePlaylist.id)
    router.push('/')
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) return

    const oldIndex = activePlaylist.tracks.findIndex(track => track.id === event.active.id)
    const newIndex = activePlaylist.tracks.findIndex(track => track.id === event.over?.id)
    if (oldIndex < 0 || newIndex < 0) return

    reorderPlaylistTracks(activePlaylist.id, arrayMove(activePlaylist.tracks, oldIndex, newIndex))
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="relative flex-shrink-0 overflow-hidden px-10 pb-8 pt-12">
        {playlist.tracks[0]?.show_artwork_url && (
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center"
            style={{
              backgroundImage: `url(${playlist.tracks[0].show_artwork_url})`,
              filter: 'blur(24px)',
              opacity: 0.24,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-nc-bg via-nc-bg/70 to-nc-bg/40" />
        <div className="relative flex items-end gap-8">
          <PlaylistCover tracks={playlist.tracks} size="lg" />

          <div className="min-w-0 flex-1 pb-2">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-nc-accent">
              Playlist
            </p>
            <form onSubmit={handleRenamePlaylist} className="mb-4 flex max-w-xl gap-3">
              <input
                key={playlist.id}
                name="playlistName"
                defaultValue={playlist.name}
                className="
                  min-w-0 flex-1 bg-transparent font-display text-5xl font-light leading-none
                  text-nc-text focus:outline-none
                "
              />
              <button
                type="submit"
                className="self-end rounded-sm border border-white/10 bg-white/5 px-3 py-2 font-mono text-[10px] text-nc-text-muted transition-colors hover:bg-white/10 hover:text-nc-text"
              >
                저장
              </button>
            </form>
            <p className="mb-6 text-sm text-nc-text-dim">
              로컬 플레이리스트 · {playlist.tracks.length} tracks
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => playPlaylist(playlist.id)}
                disabled={!playlist.tracks.length}
                className="h-12 w-12 rounded-full bg-nc-accent text-xl text-black transition-colors hover:bg-nc-accent2 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="플레이리스트 재생"
              >
                ▶
              </button>
              <button
                onClick={() => playPlaylistShuffle(playlist.id)}
                disabled={!playlist.tracks.length}
                className="rounded-sm border border-white/10 bg-white/5 px-4 py-3 font-mono text-[10px] text-nc-text-dim transition-colors hover:bg-white/10 hover:text-nc-text disabled:cursor-not-allowed disabled:opacity-40"
              >
                셔플
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="rounded-sm border border-white/10 bg-white/5 px-4 py-3 font-mono text-[10px] text-nc-text-muted transition-colors hover:bg-white/10 hover:text-nc-text"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-10 py-4">
        <div className="mb-1 flex flex-shrink-0 items-center justify-between border-b border-white/10 pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-nc-text-muted">
            트랙 목록
          </span>
          <span className="font-mono text-[9px] text-nc-text-muted">
            {playlist.tracks.length} tracks
          </span>
        </div>

        {playlist.tracks.length ? (
          <div className="flex-1 overflow-y-auto">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={playlist.tracks.map(track => track.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="flex flex-col">
                  {playlist.tracks.map((track, index) => (
                    <PlaylistTrackRow
                      key={track.id}
                      playlistId={playlist.id}
                      playlistName={playlist.name}
                      tracks={playlist.tracks}
                      track={track}
                      index={index}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center text-sm text-nc-text-muted">
            트랙 목록이나 플레이어의 + 버튼으로 곡을 추가하세요
          </div>
        )}
      </div>
    </div>
  )
}
