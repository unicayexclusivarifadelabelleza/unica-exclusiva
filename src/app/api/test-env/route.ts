import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    databaseUrlExists: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    databaseUrlStart: process.env.DATABASE_URL?.substring(0, 50) || '',
    nodeEnv: process.env.NODE_ENV,
    allEnv: {
      DATABASE_URL: process.env.DATABASE_URL ? 'exists' : 'MISSING',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'exists' : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'exists' : 'MISSING',
    }
  })
}