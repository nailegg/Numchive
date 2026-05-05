// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import Player from '@/components/Player'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import QueuePanel from '@/components/QueuePanel'
import SearchBar from '@/components/SearchBar'
import MainContentFrame from '@/components/MainContentFrame'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Numchive',
  description: 'KAIST 창작뮤지컬 동아리 Number MR 아카이브 서비스',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="bg-nc-bg text-nc-text font-sans antialiased">
        <Providers>

          {/* 상단 네비게이션 바 */}
          <header className="fixed top-0 left-0 right-0 h-21 bg-nc-surface/95 backdrop-blur-md border-b border-white/15 flex items-center px-8 gap-6 z-[200]">
            {/* 로고 */}
            <Link href="/" className="flex flex-col flex-shrink-0">
              <span className="font-mono text-[8px] tracking-[0.2em] text-nc-accent leading-snug mb-0.5">
                KAIST Number<br/>Original Soundtrack Archive
              </span>
              <span className="font-display text-xl font-light text-nc-text hover:text-nc-accent transition-colors">
                Numchive
              </span>
            </Link>

            {/* 네비바 중앙 */}
            <div className="flex-1 flex justify-center">
              <SearchBar />
            </div>
            <div className="w-24 flex-shrink-0" />
          </header>

          {/* 메인 콘텐츠 */}
          <MainContentFrame>
            {children}
          </MainContentFrame>

          <QueuePanel />
          <KeyboardShortcuts />
          <Player />

        </Providers>
      </body>
    </html>
  )
}
