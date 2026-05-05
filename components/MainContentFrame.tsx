'use client'

import { usePlayerStore } from '@/store/playerStore'

export default function MainContentFrame({ children }: { children: React.ReactNode }) {
  const { isQueueOpen } = usePlayerStore()

  return (
    <main
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
