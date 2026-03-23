'use client'
import { useState, useRef, useEffect } from 'react'

const ACCENT_COLORS = [
  { name: 'Gold',    value: '#c8a96e', preview: 'bg-[#c8a96e]' },
  { name: 'Rose',    value: '#c87e8a', preview: 'bg-[#c87e8a]' },
  { name: 'Sage',    value: '#7ea882', preview: 'bg-[#7ea882]' },
  { name: 'Sky',     value: '#7ea8c8', preview: 'bg-[#7ea8c8]' },
  { name: 'Lavender',value: '#9e8ac8', preview: 'bg-[#9e8ac8]' },
  { name: 'Peach',   value: '#c8997e', preview: 'bg-[#c8997e]' },
]

export default function AccentColorPicker() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentColor, setCurrentColor] = useState(ACCENT_COLORS[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleColorSelect(color: typeof ACCENT_COLORS[0]) {
    setCurrentColor(color)
    setIsOpen(false)

    // CSS 변수 동적 변경
    document.documentElement.style.setProperty('--nc-accent', color.value)

    // accent2 도 함께 변경 (살짝 어둡게)
    document.documentElement.style.setProperty('--nc-accent2', darkenColor(color.value))
  }

  // 색상을 살짝 어둡게 만들기
  function darkenColor(hex: string): string {
    const num = parseInt(hex.slice(1), 16)
    const r = Math.max(0, (num >> 16) - 30)
    const g = Math.max(0, ((num >> 8) & 0xff) - 30)
    const b = Math.max(0, (num & 0xff) - 30)
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  return (
    <div ref={dropdownRef} className="relative">

      {/* 트리거 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors"
      >
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: currentColor.value }}
        />
        <span className="font-mono text-[10px] text-nc-text-muted">
          {currentColor.name}
        </span>
        <span className="text-nc-text-muted text-[10px]">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* 드롭다운 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-nc-surface border border-white/10 rounded-sm shadow-xl z-[1000] overflow-hidden">
          <div className="px-3 py-2 border-b border-white/10">
            <p className="font-mono text-[9px] tracking-[0.15em] text-nc-text-muted uppercase">
              Accent Color
            </p>
          </div>
          <div className="py-1">
            {ACCENT_COLORS.map(color => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color)}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/5 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.value }}
                />
                <span className={`
                  font-mono text-[11px] transition-colors
                  ${currentColor.value === color.value ? 'text-nc-accent' : 'text-nc-text-dim'}
                `}>
                  {color.name}
                </span>
                {currentColor.value === color.value && (
                  <span className="ml-auto text-nc-accent text-[10px]">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}