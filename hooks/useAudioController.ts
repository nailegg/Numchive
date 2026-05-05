'use client'

import { useEffect, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'
import { usePlayerStore } from '@/store/playerStore'

export function useAudioController() {
  const { currentTrack, isPlaying, repeatMode, advanceTrack } = usePlayerStore()
  const trackId = currentTrack?.id
  const trackUrl = currentTrack?.file_url
  const howlRef = useRef<Howl | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (!trackUrl) {
      howlRef.current?.unload()
      howlRef.current = null
      return
    }

    howlRef.current?.unload()

    const howl = new Howl({
      src: [trackUrl],
      html5: true,
      format: ['mp3'],
      loop: usePlayerStore.getState().repeatMode === 'one',
      onload: () => setDuration(howl.duration() || 0),
      onend: advanceTrack,
      onloaderror: (_id, error) => {
        console.error('오디오 로드 실패:', error)
      },
      onplayerror: (_id, error) => {
        console.error('오디오 재생 실패:', error)
      },
    })

    howlRef.current = howl
    howl.play()

    return () => {
      howl.off()
      howl.stop()
      howl.unload()
      if (howlRef.current === howl) howlRef.current = null
    }
  }, [trackId, trackUrl, advanceTrack])

  useEffect(() => {
    howlRef.current?.loop(repeatMode === 'one')
  }, [repeatMode])

  useEffect(() => {
    const howl = howlRef.current
    if (!howl) return

    if (isPlaying) howl.play()
    else howl.pause()
  }, [isPlaying])

  useEffect(() => {
    const id = window.setInterval(() => {
      const seek = howlRef.current?.seek()
      const nextTime = typeof seek === 'number' ? seek : 0
      const nextDuration = howlRef.current?.duration() || 0

      setCurrentTime(nextTime)
      setDuration(nextDuration)
    }, 500)

    return () => window.clearInterval(id)
  }, [])

  return {
    currentTime: trackUrl ? currentTime : 0,
    duration: trackUrl ? duration : 0,
    seek: (seconds: number) => howlRef.current?.seek(seconds),
    setVolume: (volume: number) => Howler.volume(volume),
  }
}
