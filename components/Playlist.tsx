'use client'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { usePlayerStore } from '@/store/playerStore'

export default function Playlist() {
  const { savedPlaylists, removeTrackFromPlaylist, reorderPlaylistTracks } = usePlayerStore()
  const playlist = savedPlaylists[0]
  const tracks = playlist?.tracks ?? []

  function handleDragEnd(event: DragEndEvent) {
    if (!playlist) return

    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = tracks.findIndex(t => t.id === active.id)
      const newIndex = tracks.findIndex(t => t.id === over?.id)
      reorderPlaylistTracks(playlist.id, arrayMove(tracks, oldIndex, newIndex))
    }
  }

  if (!playlist) return null

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tracks.map(track => track.id)} strategy={verticalListSortingStrategy}>
        {tracks.map(track => (
          <div key={track.id}>
            <span>{track.title}</span>
            <button onClick={() => removeTrackFromPlaylist(playlist.id, track.id)}>✕</button>
          </div>
        ))}
      </SortableContext>
    </DndContext>
  )
}
