'use client'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { usePlayerStore } from '@/store/playerStore'

export default function Playlist() {
  const { playlist, removeFromPlaylist } = usePlayerStore()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = playlist.findIndex(t => t.id === active.id)
      const newIndex = playlist.findIndex(t => t.id === over?.id)
      usePlayerStore.setState({
        playlist: arrayMove(playlist, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={playlist} strategy={verticalListSortingStrategy}>
        {playlist.map(track => (
          <div key={track.id}>
            <span>{track.title}</span>
            <button onClick={() => removeFromPlaylist(track.id)}>✕</button>
          </div>
        ))}
      </SortableContext>
    </DndContext>
  )
}
