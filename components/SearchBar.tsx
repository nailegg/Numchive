// components/SearchBar.tsx
'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nc-text-muted text-xs pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="넘버, 공연 검색..."
          className="
            w-full h-9 pl-8 pr-4
            bg-white/5 border border-white/10
            rounded-sm text-sm text-nc-text
            placeholder:text-nc-text-muted
            focus:outline-none focus:border-nc-accent/50
            transition-all font-sans
          "
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-nc-text-muted">
            ...
          </span>
        )}
      </div>
    </form>
  )
}