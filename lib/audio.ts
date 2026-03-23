// lib/audio.ts
import { Howl, Howler } from 'howler'

let currentHowl: Howl | null = null

interface AudioOptions {
  onEnd?: () => void
  onLoad?: () => void
}

export function playAudio(url: string, options: AudioOptions = {}) {
  // 기존 재생 중인 오디오 정지 및 해제
  if (currentHowl) {
    currentHowl.stop()
    currentHowl.unload()
    currentHowl = null
  }

  currentHowl = new Howl({
    src: [url],
    html5: true,        // 스트리밍 재생 (큰 파일 필수)
    format: ['mp3'],
    onend: options.onEnd,
    onload: options.onLoad,
    onloaderror: (id, error) => {
      console.error('오디오 로드 실패:', error)
    },
    onplayerror: (id, error) => {
      console.error('오디오 재생 실패:', error)
    },
  })

  currentHowl.play()
  return currentHowl
}

export function pauseAudio() {
  currentHowl?.pause()
}

export function resumeAudio() {
  currentHowl?.play()
}

export function stopAudio() {
  currentHowl?.stop()
  currentHowl?.unload()
  currentHowl = null
}

export function seekAudio(seconds: number) {
  currentHowl?.seek(seconds)
}

export function getCurrentTime(): number {
  if (!currentHowl) return 0
  const seek = currentHowl.seek()
  return typeof seek === 'number' ? seek : 0
}

export function getDuration(): number {
  if (!currentHowl) return 0
  return currentHowl.duration() ?? 0
}

export function setVolume(volume: number) {
  // volume: 0 ~ 1
  Howler.volume(volume)
}

export function getHowl(): Howl | null {
  return currentHowl
}