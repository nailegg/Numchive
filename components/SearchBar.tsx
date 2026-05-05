// components/SearchBar.tsx
'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon } from '@hugeicons/core-free-icons'

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
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nc-text-muted text-sm pointer-events-none">
          <HugeiconsIcon icon={Search01Icon} size={14} color="currentColor" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="넘버, 공연 검색..."
          className="
            w-full h-9 pl-8 pr-4
            bg-white/10 border border-white/15
            rounded-sm text-sm text-nc-text
            placeholder:text-nc-text-muted
            focus:outline-none focus:border-nc-accent/50 focus:bg-white/10
            transition-all font-sans
          "
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-nc-text-muted">
            ...
          </span>
        )}
      </div>
    </form>
  )
}
