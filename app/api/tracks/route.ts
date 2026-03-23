import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const show_id = searchParams.get('show_id')

  let query = supabase.from('numbers').select('*')

  if (show_id) query = query.eq('show_id', show_id)

  const { data, error } = await query.order('numbering')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}