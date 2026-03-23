// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nc-bg': 'var(--nc-bg)',
        'nc-surface': 'var(--nc-surface)',
        'nc-surface2': 'var(--nc-surface2)',
        'nc-accent': 'var(--nc-accent)',
        'nc-accent2': 'var(--nc-accent2)',
        'nc-text': 'var(--nc-text)',
        'nc-text-muted': 'var(--nc-text-muted)',
        'nc-text-dim': 'var(--nc-text-dim)',
        'nc-border': 'rgb(var(--nc-border) / 0.07)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Noto Sans KR', 'sans-serif'],
        display: ['var(--font-display)', 'Cormorant Garamond', 'serif'],
        mono: ['var(--font-mono)', 'DM Mono', 'monospace'],
      },
    },
  },
}

export default config