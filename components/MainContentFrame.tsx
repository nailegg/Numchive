'use client'

import type { CSSProperties } from 'react'
import { usePlayerStore } from '@/store/playerStore'

export default function MainContentFrame({ children }: { children: React.ReactNode }) {
  const { currentTrack, isQueueOpen } = usePlayerStore()
  const style = {
    '--nc-player-height': currentTrack ? '84px' : '0px',
  } as CSSProperties

  return (
    <main
      style={style}
      className={`
        min-h-screen pt-21 transition-[margin,transform] duration-300 ease-in-out
        origin-left
        ${isQueueOpen ? 'mr-96 scale-[0.985]' : 'mr-0 scale-100'}
      `}
    >
      {children}
    </main>
  )
}
