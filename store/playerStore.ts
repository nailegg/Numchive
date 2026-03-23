import { create } from 'zustand'
import { Track } from '@/types'  // types에서 가져옴
import { Show } from '@/types'

interface PlayerStore {
  currentTrack: Track | null
  isPlaying: boolean
  queue: Track[]
  playlist: Track[]
  isQueueOpen: boolean

  setTrack: (track: Track) => void
  togglePlay: () => void
  nextTrack: () => void
  prevTrack: () => void
  addToPlaylist: (track: Track) => void
  removeFromPlaylist: (id: string) => void
  toggleQueue: () => void
  playAll: (tracks: Track[]) => void    // ← 추가
  playShuffle: (tracks: Track[]) => void // ← 추가
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  playlist: [],
  isQueueOpen: false,

  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  nextTrack: () => {
    const { queue, currentTrack } = get()
    const idx = queue.findIndex(t => t.id === currentTrack?.id)
    if (idx < queue.length - 1) {
      set({ currentTrack: queue[idx + 1], isPlaying: true })  // ← isPlaying: true 추가
    } else {
      set({ isPlaying: false })  // 마지막 트랙이면 재생 정지
    }
  },
  prevTrack: () => {
    const { queue, currentTrack } = get()
    const idx = queue.findIndex(t => t.id === currentTrack?.id)
    if (idx > 0) {
      set({ currentTrack: queue[idx - 1], isPlaying: true })  // ← isPlaying: true 추가
    }
  },
  addToPlaylist: (track) => set((state) => ({
    playlist: [...state.playlist, track]
  })),
  removeFromPlaylist: (id) => set((state) => ({
    playlist: state.playlist.filter(t => t.id !== id)
  })),
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
  playAll: (tracks) => {
    if (!tracks.length) return
    set({
      queue: tracks,
      currentTrack: tracks[0],
      isPlaying: true,
    })
  },

  playShuffle: (tracks) => {
    if (!tracks.length) return
    // Fisher-Yates 셔플 알고리즘
    const shuffled = [...tracks]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    set({
      queue: shuffled,
      currentTrack: shuffled[0],
      isPlaying: true,
    })
  },
}))