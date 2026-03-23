// components/Player.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { VolumeHighIcon, VolumeLowIcon, VolumeOffIcon } from '@hugeicons/core-free-icons'
import { usePlayerStore } from '@/store/playerStore'
import {
  playAudio, pauseAudio, resumeAudio,
  getCurrentTime, getDuration, seekAudio, setVolume,
} from '@/lib/audio'

export default function Player() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, isQueueOpen, toggleQueue } = usePlayerStore()
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const isDragging = useRef(false)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!currentTrack) return
    playAudio(currentTrack.file_url, {
      onEnd: () => nextTrack(),
      onLoad: () => setDuration(getDuration()),
    })
    if (progressInterval.current) clearInterval(progressInterval.current)
    progressInterval.current = setInterval(() => {
      if (isDragging.current) return
      const current = getCurrentTime()
      const total = getDuration()
      setCurrentTime(current)
      setDuration(total)
      if (total > 0) setProgress(current / total)
    }, 500)
    return () => { if (progressInterval.current) clearInterval(progressInterval.current) }
  }, [currentTrack])

  useEffect(() => {
    if (!currentTrack) return
    if (isPlaying) resumeAudio()
    else pauseAudio()
  }, [isPlaying])

  useEffect(() => { setVolume(volume) }, [volume])

  function getRatioFromEvent(e: MouseEvent | React.MouseEvent) {
    if (!progressBarRef.current) return 0
    const rect = progressBarRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const ratio = getRatioFromEvent(e)
    seekAudio(ratio * getDuration())
    setProgress(ratio)
    setCurrentTime(ratio * getDuration())
  }

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    isDragging.current = true
    const ratio = getRatioFromEvent(e)
    setProgress(ratio)
    setCurrentTime(ratio * getDuration())
    function handleMouseMove(e: MouseEvent) {
      const ratio = getRatioFromEvent(e)
      setProgress(ratio)
      setCurrentTime(ratio * getDuration())
    }
    function handleMouseUp(e: MouseEvent) {
      const ratio = getRatioFromEvent(e)
      seekAudio(ratio * getDuration())
      setProgress(ratio)
      isDragging.current = false
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">

      {/* 진행 바 */}
      <div
        ref={progressBarRef}
        className="relative h-1 bg-white/10 cursor-pointer group overflow-visible"
        onClick={handleProgressClick}
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute left-0 top-0 h-full bg-nc-accent transition-none"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className="absolute top-1/2 w-3 h-3 rounded-full bg-nc-accent opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress * 100}%`, transform: 'translate(-50%, -50%)', zIndex: 60 }}
        />
      </div>

      {/* 플레이어 바 — 3열 그리드 */}
      <div className="h-20 bg-nc-surface/95 backdrop-blur-md border-t border-white/10 grid grid-cols-3 items-center px-8 gap-6">

        {/* ── 좌측 — 컨트롤 + 시간 ── */}
        <div className="flex items-center gap-5">
          {/* 재생 컨트롤 */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevTrack}
              className="text-nc-text-muted hover:text-nc-text transition-colors text-sm"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-nc-accent text-black flex items-center justify-center hover:bg-nc-accent2 transition-colors text-sm"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={nextTrack}
              className="text-nc-text-muted hover:text-nc-text transition-colors text-sm"
            >
              ⏭
            </button>
          </div>

          {/* 시간 */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-nc-text-muted w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <span className="font-mono text-[10px] text-nc-text-muted">/</span>
            <span className="font-mono text-[10px] text-nc-text-muted w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* ── 센터 — 아트워크 + 트랙 정보 ── */}
        <div className="flex items-center gap-4">
          {/* 아트워크 */}
          <div className="w-10 h-10 rounded-sm flex-shrink-0 overflow-hidden bg-nc-surface2">
            {currentTrack.show_artwork_url ? (
              <img
                src={currentTrack.show_artwork_url}
                alt={currentTrack.show_title ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-nc-text-muted text-sm">
                ♪
              </div>
            )}
          </div>

          {/* 텍스트 */}
          <div className="min-w-0">
            <p className="text-sm text-nc-text truncate max-w-xs">
              {currentTrack.title}
            </p>
            {currentTrack.show_title && (
              <p className="font-mono text-[10px] text-nc-text-muted mt-0.5 truncate max-w-xs">
                {currentTrack.show_title}
              </p>
            )}
          </div>
        </div>

        {/* ── 우측 — 볼륨 + 큐 토글 ── */}
        <div className="flex items-center justify-end gap-4">
          {/* 볼륨 */}
          <div className="flex items-center gap-2 w-28">
            <span className="text-nc-text-muted flex-shrink-0">
              {volume === 0
                ? <HugeiconsIcon icon={VolumeOffIcon} size={14} color="currentColor" />
                : volume < 0.5
                ? <HugeiconsIcon icon={VolumeLowIcon} size={14} color="currentColor" />
                : <HugeiconsIcon icon={VolumeHighIcon} size={14} color="currentColor" />
              }
            </span>
            <div
              className="flex-1 h-1 bg-white/10 rounded-full relative cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const ratio = (e.clientX - rect.left) / rect.width
                setVolumeState(Math.max(0, Math.min(1, ratio)))
              }}
            >
              <div
                className="absolute left-0 top-0 h-full bg-nc-accent/60 rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          {/* 큐 토글 버튼 */}
          <button
            onClick={toggleQueue}
            className={`
              w-7 h-7 flex items-center justify-center
              rounded-sm border border-white/10
              font-mono text-[10px] transition-all
              ${isQueueOpen
                ? 'bg-nc-accent/20 border-nc-accent/40 text-nc-accent'
                : 'bg-white/5 text-nc-text-muted hover:text-nc-text hover:bg-white/10'
              }
            `}
          >
            {isQueueOpen ? '▼' : '▲'}
          </button>
        </div>

      </div>
    </div>
  )
}
