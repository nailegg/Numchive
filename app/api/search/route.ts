import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) return NextResponse.json([])

  // 트랙 제목 검색
  const { data: trackResults } = await supabase
    .from('tracks')
    .select('*, shows(title)')
    .ilike('title', `%${q}%`)  // 대소문자 구분 없는 부분 일치

  // 배우/작곡가 이름으로 검색 → 해당 트랙까지
  const { data: peopleResults } = await supabase
    .from('people')
    .select(`
      *,
      number_cast (
        tracks (*, shows(title))
      )
    `)
    .ilike('name', `%${q}%`)

  return NextResponse.json({
    tracks: trackResults,
    people: peopleResults
  })
}