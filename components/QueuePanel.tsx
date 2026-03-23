// components/QueuePanel.tsx
'use client'
import { usePlayerStore } from '@/store/playerStore'

export default function QueuePanel() {
  const { isQueueOpen, queue, currentTrack, setTrack, toggleQueue } = usePlayerStore()

  return (
    <div className={`
      fixed right-0 z-40
      w-96 bg-nc-surface/98 backdrop-blur-xl
      border-l border-white/10
      transition-all duration-300 ease-in-out
      ${isQueueOpen
        ? 'bottom-[84px] top-[84px] opacity-100'
        : 'bottom-[-100%] top-[84px] opacity-0 pointer-events-none'
      }
    `}>
      <div className="flex flex-col h-full">

        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
          <p className="font-mono text-[9px] tracking-[0.18em] text-nc-text-muted uppercase mb-1">
            재생 목록
          </p>
          <p className="text-xs text-nc-text-dim">
            {queue.length} tracks
          </p>
        </div>

        {/* 트랙 목록 */}
        <div className="flex-1 overflow-y-auto">
          {queue.map((track, i) => (
            <div
              key={track.id}
              onClick={() => setTrack(track)}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer
                transition-all duration-150 hover:bg-white/5
                ${currentTrack?.id === track.id
                  ? 'bg-nc-accent/5 border-l-2 border-nc-accent'
                  : 'border-l-2 border-transparent'
                }
              `}
            >
              {/* 아트워크 썸네일 */}
              <div className="w-10 h-10 rounded-sm flex-shrink-0 overflow-hidden">
                {track.show_artwork_url ? (
                  <img
                    src={track.show_artwork_url}
                    alt={track.show_title ?? ''}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-nc-surface2 flex items-center justify-center text-sm">
                    🎭
                  </div>
                )}
              </div>

              {/* 트랙 정보 */}
              <div className="flex-1 min-w-0">
                <p className={`
                  text-sm truncate
                  ${currentTrack?.id === track.id ? 'text-nc-accent' : 'text-nc-text'}
                `}>
                  {track.title}
                </p>
                <p className="font-mono text-[10px] text-nc-text-muted truncate mt-0.5">
                  {track.show_title}
                </p>
              </div>

              {/* 재생 시간 */}
              {track.duration && (
                <span className="font-mono text-[11px] text-nc-text-muted flex-shrink-0">
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
