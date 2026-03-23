// app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_KR, Cormorant_Garamond, DM_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Providers from './providers'
import Player from '@/components/Player'
import AccentColorPicker from '@/components/AccentColorPicker'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import QueuePanel from '@/components/QueuePanel'
import Link from 'next/link'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Numchaive',
  description: 'KAIST 창작뮤지컬 동아리 Number MR 아카이브 서비스',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={cn(
        notoSansKR.variable,
        cormorant.variable,
        dmMono.variable,
      )}
    >
      <body className="bg-nc-bg text-nc-text font-sans antialiased">
        <Providers>

          {/* 상단 네비게이션 바 */}
          <header className="fixed top-0 left-0 right-0 h-21 bg-nc-surface/95 backdrop-blur-md border-b border-white/10 flex items-center px-8 gap-6 z-200">
            {/* 로고 */}
            <Link href="/" className="flex flex-col flex-shrink-0">
              <span className="font-mono text-[8px] tracking-[0.2em] text-nc-accent leading-snug mb-0.5">
                KAIST Number<br/>Origianl Soundtrack Archive
              </span>
              <span className="font-display text-xl font-light text-nc-text hover:text-nc-accent transition-colors">
                Numchive
              </span>
            </Link>

            {/* 검색창 자리 */}
            <div className="flex-1" />

            {/* 우측 아이콘 자리 */}
            <div className="flex items-center gap-3">
              <AccentColorPicker />
            </div>
          </header>

          {/* 메인 콘텐츠 */}
          <main className="pt-21">
            {children}
          </main>

          <QueuePanel />
          <KeyboardShortcuts />
          <Player />

        </Providers>
      </body>
    </html>
  )
}
