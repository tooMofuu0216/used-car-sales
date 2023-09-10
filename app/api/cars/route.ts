import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { Database, Tables } from '@/types/supabase'

export const dynamic = 'force-dynamic'

// export async function POST(request: Request) {
//   const { title } = await request.json()
//   const supabase = createRouteHandlerClient<Database>({ cookies })
//   const { data } = await supabase.from('todos').insert({ title }).select()
//   return NextResponse.json(data)
// }

export async function GET(request: Request){
//   const { count } = await request.json()
  const supabase = createRouteHandlerClient<Database>({ cookies })
  const { data } = await supabase.from('carlisting')
    .select()
    .order("create_dt")
    .limit(10)
  return NextResponse.json(data)
}