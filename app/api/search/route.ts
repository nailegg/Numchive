import { NextResponse } from 'next/server'
import { searchArchive } from '@/lib/search'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''

  try {
    return NextResponse.json(await searchArchive(q))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    )
  }
}
