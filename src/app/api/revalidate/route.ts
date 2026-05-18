import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  revalidateTag('menu')
  return NextResponse.json({ ok: true })
}
