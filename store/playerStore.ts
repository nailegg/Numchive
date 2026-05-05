import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Track } from '@/types'

export type RepeatMode = 'off' | 'all' | 'one'
export type PlaybackSource = 'single' | 'album' | 'playlist'

export interface PlaybackQueue {
  source: PlaybackSource
  sourceId: string | null
  sourceTitle: string
  tracks: Track[]
}

export interface SavedPlaylist {
  id: string
  name: string
  tracks: Track[]
  createdAt: number
  updatedAt: number
}

interface PlayerStore {
  currentTrack: Track | null
  isPlaying: boolean
  playbackQueue: PlaybackQueue
  isQueueOpen: boolean
  repeatMode: RepeatMode
  selectedPlaylistId: string | null
  savedPlaylists: SavedPlaylist[]

  setTrack: (track: Track) => void
  togglePlay: () => void
  nextTrack: () => void
  prevTrack: () => void
  advanceTrack: () => void
  toggleRepeatMode: () => void
  toggleQueue: () => void
  playSingle: (track: Track) => void
  playQueue: (queue: PlaybackQueue, startTrackId?: string) => void
  playQueueTrack: (track: Track) => void
  playAll: (tracks: Track[]) => void
  playShuffle: (tracks: Track[]) => void
  playPlaylistShuffle: (playlistId: string) => void
  createPlaylist: (name: string) => string
  deletePlaylist: (playlistId: string) => void
  renamePlaylist: (playlistId: string, name: string) => void
  selectPlaylist: (playlistId: string) => void
  addTrackToPlaylist: (playlistId: string, track: Track) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  reorderPlaylistTracks: (playlistId: string, tracks: Track[]) => void
  playPlaylist: (playlistId: string) => void
}

function createPlaylistId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `playlist-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function createSingleQueue(track: Track): PlaybackQueue {
  return {
    source: 'single',
    sourceId: track.id,
    sourceTitle: track.show_title ?? '단일 곡',
    tracks: [track],
  }
}

function createEmptyQueue(): PlaybackQueue {
  return {
    source: 'single',
    sourceId: null,
    sourceTitle: '재생 목록',
    tracks: [],
  }
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      playbackQueue: createEmptyQueue(),
      isQueueOpen: false,
      repeatMode: 'off',
      selectedPlaylistId: null,
      savedPlaylists: [],

      setTrack: (track) => get().playSingle(track),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      nextTrack: () => {
        const { playbackQueue, currentTrack } = get()
        const idx = playbackQueue.tracks.findIndex(t => t.id === currentTrack?.id)
        if (idx < 0 || !playbackQueue.tracks.length) return

        const nextIndex = idx < playbackQueue.tracks.length - 1 ? idx + 1 : 0
        set({ currentTrack: playbackQueue.tracks[nextIndex], isPlaying: true })
      },
      prevTrack: () => {
        const { playbackQueue, currentTrack } = get()
        const idx = playbackQueue.tracks.findIndex(t => t.id === currentTrack?.id)
        if (idx > 0) {
          set({ currentTrack: playbackQueue.tracks[idx - 1], isPlaying: true })
        }
      },
      advanceTrack: () => {
        const { playbackQueue, currentTrack, repeatMode } = get()
        const idx = playbackQueue.tracks.findIndex(t => t.id === currentTrack?.id)

        if (repeatMode === 'one' && currentTrack) {
          set({ currentTrack: { ...currentTrack }, isPlaying: true })
          return
        }

        if (idx >= 0 && idx < playbackQueue.tracks.length - 1) {
          set({ currentTrack: playbackQueue.tracks[idx + 1], isPlaying: true })
          return
        }

        if (repeatMode === 'all' && playbackQueue.tracks.length) {
          set({ currentTrack: playbackQueue.tracks[0], isPlaying: true })
          return
        }

        set({ isPlaying: false })
      },
      toggleRepeatMode: () => set((state) => ({
        repeatMode: state.repeatMode === 'off'
          ? 'all'
          : state.repeatMode === 'all'
          ? 'one'
          : 'off',
      })),
      toggleQueue: () => set((state) => ({
        isQueueOpen: !state.isQueueOpen,
      })),
      playSingle: (track) => set({
        playbackQueue: createSingleQueue(track),
        currentTrack: track,
        isPlaying: true,
      }),
      playQueue: (queue, startTrackId) => {
        const startTrack = queue.tracks.find(track => track.id === startTrackId) ?? queue.tracks[0]
        if (!startTrack) return

        set({
          playbackQueue: queue,
          currentTrack: startTrack,
          isPlaying: true,
        })
      },
      playQueueTrack: (track) => {
        const { playbackQueue } = get()
        if (playbackQueue.tracks.some(item => item.id === track.id)) {
          set({ currentTrack: track, isPlaying: true })
          return
        }

        get().playSingle(track)
      },
      playAll: (tracks) => {
        if (!tracks.length) return
        get().playQueue({
          source: 'album',
          sourceId: tracks[0]?.show_id ?? null,
          sourceTitle: tracks[0]?.show_title ?? '앨범',
          tracks,
        })
      },

      playShuffle: (tracks) => {
        if (!tracks.length) return
        const shuffled = [...tracks]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        const currentPlaylist = get().savedPlaylists.find(playlist =>
          playlist.tracks.length === tracks.length &&
          playlist.tracks.every(track => tracks.some(item => item.id === track.id))
        )

        get().playQueue({
          source: currentPlaylist ? 'playlist' : 'album',
          sourceId: currentPlaylist?.id ?? shuffled[0]?.show_id ?? null,
          sourceTitle: currentPlaylist?.name ?? shuffled[0]?.show_title ?? '셔플 재생',
          tracks: shuffled,
        })
      },
      createPlaylist: (name) => {
        const now = Date.now()
        const playlistId = createPlaylistId()
        const trimmedName = name.trim() || '새 플레이리스트'

        set((state) => ({
          selectedPlaylistId: playlistId,
          savedPlaylists: [
            ...state.savedPlaylists,
            {
              id: playlistId,
              name: trimmedName,
              tracks: [],
              createdAt: now,
              updatedAt: now,
            },
          ],
        }))

        return playlistId
      },
      deletePlaylist: (playlistId) => set((state) => ({
        savedPlaylists: state.savedPlaylists.filter(playlist => playlist.id !== playlistId),
        selectedPlaylistId: state.selectedPlaylistId === playlistId
          ? state.savedPlaylists.find(playlist => playlist.id !== playlistId)?.id ?? null
          : state.selectedPlaylistId,
      })),
      renamePlaylist: (playlistId, name) => {
        const trimmedName = name.trim()
        if (!trimmedName) return

        set((state) => ({
          savedPlaylists: state.savedPlaylists.map(playlist =>
            playlist.id === playlistId
              ? { ...playlist, name: trimmedName, updatedAt: Date.now() }
              : playlist
          ),
        }))
      },
      selectPlaylist: (playlistId) => set((state) => ({
        selectedPlaylistId: state.savedPlaylists.some(playlist => playlist.id === playlistId)
          ? playlistId
          : state.selectedPlaylistId,
      })),
      addTrackToPlaylist: (playlistId, track) => set((state) => ({
        savedPlaylists: state.savedPlaylists.map(playlist => {
          if (playlist.id !== playlistId) return playlist
          if (playlist.tracks.some(item => item.id === track.id)) return playlist

          return {
            ...playlist,
            tracks: [...playlist.tracks, track],
            updatedAt: Date.now(),
          }
        }),
        playbackQueue: state.playbackQueue.source === 'playlist' && state.playbackQueue.sourceId === playlistId
          ? {
              ...state.playbackQueue,
              tracks: state.playbackQueue.tracks.some(item => item.id === track.id)
                ? state.playbackQueue.tracks
                : [...state.playbackQueue.tracks, track],
            }
          : state.playbackQueue,
      })),
      removeTrackFromPlaylist: (playlistId, trackId) => set((state) => ({
        savedPlaylists: state.savedPlaylists.map(playlist =>
          playlist.id === playlistId
            ? {
                ...playlist,
                tracks: playlist.tracks.filter(track => track.id !== trackId),
                updatedAt: Date.now(),
              }
            : playlist
        ),
        playbackQueue: state.playbackQueue.source === 'playlist' && state.playbackQueue.sourceId === playlistId
          ? {
              ...state.playbackQueue,
              tracks: state.playbackQueue.tracks.filter(track => track.id !== trackId),
            }
          : state.playbackQueue,
        currentTrack: state.playbackQueue.source === 'playlist' &&
          state.playbackQueue.sourceId === playlistId &&
          state.currentTrack?.id === trackId
          ? null
          : state.currentTrack,
        isPlaying: state.playbackQueue.source === 'playlist' &&
          state.playbackQueue.sourceId === playlistId &&
          state.currentTrack?.id === trackId
          ? false
          : state.isPlaying,
      })),
      reorderPlaylistTracks: (playlistId, tracks) => set((state) => ({
        savedPlaylists: state.savedPlaylists.map(playlist =>
          playlist.id === playlistId
            ? { ...playlist, tracks, updatedAt: Date.now() }
            : playlist
        ),
        playbackQueue: state.playbackQueue.source === 'playlist' && state.playbackQueue.sourceId === playlistId
          ? { ...state.playbackQueue, tracks }
          : state.playbackQueue,
      })),
      playPlaylist: (playlistId) => {
        const playlist = get().savedPlaylists.find(item => item.id === playlistId)
        if (!playlist?.tracks.length) return

        set({
          playbackQueue: {
            source: 'playlist',
            sourceId: playlist.id,
            sourceTitle: playlist.name,
            tracks: playlist.tracks,
          },
          currentTrack: playlist.tracks[0],
          isPlaying: true,
        })
      },
      playPlaylistShuffle: (playlistId) => {
        const playlist = get().savedPlaylists.find(item => item.id === playlistId)
        if (!playlist?.tracks.length) return

        const shuffled = [...playlist.tracks]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }

        get().playQueue({
          source: 'playlist',
          sourceId: playlist.id,
          sourceTitle: playlist.name,
          tracks: shuffled,
        })
      },
    }),
    {
      name: 'numchive-library-v1',
      partialize: (state) => ({
        savedPlaylists: state.savedPlaylists,
        selectedPlaylistId: state.selectedPlaylistId,
        repeatMode: state.repeatMode,
      }),
    }
  )
)
