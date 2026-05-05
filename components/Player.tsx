// components/Player.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  Playlist03Icon,
  PreviousIcon,
  RepeatIcon,
  RepeatOffIcon,
  RepeatOne01Icon,
  MusicNoteSquare01Icon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeOffIcon,
} from '@hugeicons/core-free-icons'
import { usePlayerStore } from '@/store/playerStore'
import { useAudioController } from '@/hooks/useAudioController'
import Waveform from '@/components/Waveform'

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    isQueueOpen,
    toggleQueue,
    repeatMode,
    toggleRepeatMode,
  } = usePlayerStore()
  const { currentTime, duration, seek, setVolume } = useAudioController()
  const [progress, setProgress] = useState(0)
  const [previewTime, setPreviewTime] = useState<number | null>(null)
  const [volume, setVolumeState] = useState(0.8)
  const isDragging = useRef(false)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const removeDragListenersRef = useRef<(() => void) | null>(null)

  useEffect(() => { setVolume(volume) }, [setVolume, volume])

  useEffect(() => {
    return () => {
      removeDragListenersRef.current?.()
    }
  }, [])

  function getRatioFromEvent(e: MouseEvent | React.MouseEvent) {
    if (!progressBarRef.current) return 0
    const rect = progressBarRef.current.getBoundingClientRect()
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const ratio = getRatioFromEvent(e)
    const nextTime = ratio * duration
    seek(nextTime)
    setProgress(ratio)
    setPreviewTime(null)
  }

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    removeDragListenersRef.current?.()
    isDragging.current = true
    const ratio = getRatioFromEvent(e)
    const nextTime = ratio * duration
    setProgress(ratio)
    setPreviewTime(nextTime)
    function handleMouseMove(e: MouseEvent) {
      const ratio = getRatioFromEvent(e)
      const nextTime = ratio * duration
      setProgress(ratio)
      setPreviewTime(nextTime)
    }
    function handleMouseUp(e: MouseEvent) {
      const ratio = getRatioFromEvent(e)
      seek(ratio * duration)
      setProgress(ratio)
      setPreviewTime(null)
      isDragging.current = false
      removeDragListenersRef.current?.()
    }

    removeDragListenersRef.current = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      removeDragListenersRef.current = null
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

  const displayTime = previewTime ?? currentTime
  const playbackProgress = duration > 0 ? currentTime / duration : 0
  const displayProgress = previewTime === null ? playbackProgress : progress
  const repeatLabel = repeatMode === 'one' ? '한 곡 반복' : repeatMode === 'all' ? '전체 반복' : '반복 꺼짐'
  const repeatIcon = repeatMode === 'one'
    ? RepeatOne01Icon
    : repeatMode === 'all'
    ? RepeatIcon
    : RepeatOffIcon

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <Waveform />

      {/* 진행 바 */}
      <div
        ref={progressBarRef}
        className="relative h-1 bg-white/10 cursor-pointer group overflow-visible"
        onClick={handleProgressClick}
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute left-0 top-0 h-full bg-nc-accent transition-none"
          style={{ width: `${displayProgress * 100}%` }}
        />
        <div
          className="absolute top-1/2 w-3 h-3 rounded-full bg-nc-accent opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${displayProgress * 100}%`, transform: 'translate(-50%, -50%)', zIndex: 60 }}
        />
      </div>

      {/* 플레이어 바 — 3열 그리드 */}
      <div className="h-20 bg-nc-surface/95 backdrop-blur-md border-t border-white/15 grid grid-cols-3 items-center px-8 gap-6 shadow-[0_-16px_50px_rgba(0,0,0,0.35)]">

        {/* ── 좌측 — 컨트롤 + 시간 ── */}
        <div className="flex items-center gap-5">
          {/* 재생 컨트롤 */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevTrack}
              className="flex h-8 w-8 items-center justify-center rounded-full text-nc-text-muted transition-colors hover:bg-white/15 hover:text-nc-text"
              aria-label="이전 곡"
            >
              <HugeiconsIcon icon={PreviousIcon} size={16} color="currentColor" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-nc-accent text-black transition-colors hover:bg-nc-accent2"
              aria-label={isPlaying ? '일시정지' : '재생'}
            >
              <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} size={18} color="currentColor" />
            </button>
            <button
              onClick={nextTrack}
              className="flex h-8 w-8 items-center justify-center rounded-full text-nc-text-muted transition-colors hover:bg-white/15 hover:text-nc-text"
              aria-label="다음 곡"
            >
              <HugeiconsIcon icon={NextIcon} size={16} color="currentColor" />
            </button>
          </div>

          {/* 시간 */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[11px] text-nc-text-muted w-8 text-right">
              {formatTime(displayTime)}
            </span>
            <span className="font-mono text-[11px] text-nc-text-muted">/</span>
            <span className="font-mono text-[11px] text-nc-text-muted w-8">
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
                <HugeiconsIcon icon={MusicNoteSquare01Icon} size={16} color="currentColor" />
              </div>
            )}
          </div>

          {/* 텍스트 */}
          <div className="min-w-0">
            <p className="text-sm text-nc-text truncate max-w-xs">
              {currentTrack.title}
            </p>
            {currentTrack.show_title && (
              <p className="font-mono text-[11px] text-nc-text-muted mt-0.5 truncate max-w-xs">
                {currentTrack.show_title}
              </p>
            )}
          </div>
        </div>

        {/* ── 우측 — 볼륨 + 큐 토글 ── */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={toggleRepeatMode}
            className={`
              h-7 min-w-7 rounded-sm border px-2
              font-mono text-[11px] transition-all
              ${repeatMode === 'off'
                ? 'border-white/15 bg-white/10 text-nc-text-muted hover:bg-white/15 hover:text-nc-text'
                : 'border-nc-accent/40 bg-nc-accent/20 text-nc-accent'
              }
            `}
            aria-label={repeatLabel}
            title={repeatLabel}
          >
            <HugeiconsIcon icon={repeatIcon} size={14} color="currentColor" />
          </button>

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
              rounded-sm border border-white/15
              font-mono text-[11px] transition-all
              ${isQueueOpen
                ? 'bg-nc-accent/20 border-nc-accent/40 text-nc-accent'
                : 'bg-white/10 text-nc-text-muted hover:text-nc-text hover:bg-white/15'
              }
            `}
            aria-label="재생 목록"
          >
            <HugeiconsIcon icon={Playlist03Icon} size={14} color="currentColor" />
          </button>
        </div>

      </div>
    </div>
  )
}
