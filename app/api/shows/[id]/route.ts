// app/api/shows/[id]/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise 추가
) {
  const { id } = await params  // ← await 추가

  const { data, error } = await supabase
    .from('shows')
    .select(`
      *,
      numbers (*)
    `)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}