'use client'

import { useRouter } from 'next/navigation'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Delete01Icon,
  DragDropVerticalIcon,
  MusicNoteSquare01Icon,
  PlayIcon,
  ShuffleIcon,
} from '@hugeicons/core-free-icons'
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
        transition-all hover:bg-white/15 hover:border-white/15
        ${currentTrack?.id === track.id ? 'bg-nc-accent/5 border-nc-accent/15' : ''}
        ${isDragging ? 'opacity-80 bg-white/10' : ''}
      `}
    >
      <span className={`font-mono text-sm text-center ${currentTrack?.id === track.id ? 'text-nc-accent' : 'text-nc-text-muted'}`}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="flex h-7 w-7 cursor-grab items-center justify-center rounded-sm text-nc-text-muted transition-colors hover:bg-white/15 hover:text-nc-text active:cursor-grabbing"
        aria-label="트랙 순서 변경"
      >
        <HugeiconsIcon icon={DragDropVerticalIcon} size={14} color="currentColor" />
      </button>
      <div className="h-11 w-11 overflow-hidden rounded-sm bg-nc-surface2">
        {track.show_artwork_url ? (
          <img src={track.show_artwork_url} alt={track.show_title ?? ''} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-nc-text-muted">
            <HugeiconsIcon icon={MusicNoteSquare01Icon} size={17} color="currentColor" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className={`truncate text-sm ${currentTrack?.id === track.id ? 'text-nc-accent' : 'text-nc-text'}`}>
          {track.title}
        </p>
        <p className="mt-0.5 truncate font-mono text-[11px] text-nc-text-muted">
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
        className="flex h-7 w-7 items-center justify-center rounded-sm border border-white/15 bg-white/10 text-nc-text-muted transition-colors hover:bg-white/15 hover:text-nc-text"
        aria-label={`${track.title} 제거`}
      >
        <HugeiconsIcon icon={Delete01Icon} size={13} color="currentColor" />
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

  function renameFromInput(input: HTMLInputElement) {
    renamePlaylist(playlistId, input.value)
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
      <div className="relative h-54 flex-shrink-0 overflow-hidden">
        {playlist.tracks[0]?.show_artwork_url && (
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center"
            style={{
              backgroundImage: `url(${playlist.tracks[0].show_artwork_url})`,
              filter: 'blur(20px)',
              opacity: 0.26,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-nc-bg via-nc-bg/65 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-6 px-10 pb-6">
          <PlaylistCover tracks={playlist.tracks} size="md" />

          <div className="min-w-0 flex-1">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-nc-accent">
              Playlist
            </p>
            <input
              key={playlist.id}
              defaultValue={playlist.name}
              onBlur={(e) => renameFromInput(e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur()
                }
              }}
              aria-label="플레이리스트 이름"
              className="
                mb-3 w-full max-w-3xl bg-transparent font-display text-4xl font-light leading-none
                text-nc-text focus:outline-none
              "
            />

            <div className="flex gap-3">
              <button
                onClick={() => playPlaylist(playlist.id)}
                disabled={!playlist.tracks.length}
                className="flex items-center gap-2 px-4 py-2 bg-nc-accent text-black text-sm font-mono tracking-wide rounded-sm hover:bg-nc-accent2 transition-colors"
                aria-label="플레이리스트 재생"
              >
                <HugeiconsIcon icon={PlayIcon} size={13} color="currentColor" />
                전체 재생
              </button>
              <button
                onClick={() => playPlaylistShuffle(playlist.id)}
                disabled={!playlist.tracks.length}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 text-nc-text-dim text-sm font-mono tracking-wide rounded-sm hover:bg-white/15 transition-colors"
              >
                <HugeiconsIcon icon={ShuffleIcon} size={13} color="currentColor" />
                셔플 재생
                
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="rounded-sm border border-white/15 bg-white/10 px-4 py-2 font-mono text-[11px] text-nc-text-muted transition-colors hover:bg-white/15 hover:text-nc-text"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-10 py-4">
        <div className="mb-1 flex flex-shrink-0 items-center justify-between border-b border-white/15 pb-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-nc-text-muted">
            트랙 목록
          </span>
          <span className="font-mono text-[11px] text-nc-text-muted">
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
            트랙 목록의 + 버튼으로 곡을 추가하세요
          </div>
        )}
      </div>
    </div>
  )
}
