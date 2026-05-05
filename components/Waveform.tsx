// components/Waveform.tsx
'use client'
import { useEffect, useRef } from 'react'
import { Howler } from 'howler'
import { usePlayerStore } from '@/store/playerStore'

export default function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const { isPlaying } = usePlayerStore()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const canvasEl = canvas
    const canvasCtx = ctx

    // 재생 중이 아니면 캔버스 비우고 종료
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height)
      return
    }

    // Howler 내부 Web Audio API 노드에 접근
    const audioCtx = Howler.ctx
    const masterGain = Howler.masterGain

    if (!audioCtx || !masterGain) return

    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 128
    masterGain.connect(analyser)

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    function draw() {
      animRef.current = requestAnimationFrame(draw)

      canvasEl.width = canvasEl.offsetWidth
      canvasEl.height = canvasEl.offsetHeight

      analyser.getByteFrequencyData(dataArray)
      canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height)

      const barWidth = canvasEl.width / bufferLength
      dataArray.forEach((value, i) => {
        const barHeight = (value / 255) * canvasEl.height * 0.8
        const alpha = 0.3 + (value / 255) * 0.7
        canvasCtx.fillStyle = `rgba(200, 169, 110, ${alpha})`
        canvasCtx.beginPath()
        canvasCtx.roundRect(
          i * barWidth + 1,
          canvasEl.height - barHeight,
          barWidth - 2,
          barHeight,
          1
        )
        canvasCtx.fill()
      })
    }

    draw()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      masterGain.disconnect(analyser)
      analyser.disconnect()
      animRef.current = null
    }
  }, [isPlaying])

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-20 left-60 right-0 h-16 pointer-events-none opacity-40"
    />
  )
}
