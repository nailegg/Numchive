// components/KeyboardShortcuts.tsx
'use client'
import { useEffect } from 'react'
import { usePlayerStore } from '@/store/playerStore'

export default function KeyboardShortcuts() {
  const { togglePlay, currentTrack } = usePlayerStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // 입력 중일 때는 단축키 무시
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return

      if (e.code === 'Space') {
        e.preventDefault()  // 페이지 스크롤 방지
        if (currentTrack) togglePlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentTrack, togglePlay])

  return null  // UI 없음
}