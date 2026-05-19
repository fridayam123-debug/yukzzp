import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function GET() {
  revalidateTag('menu', 'max')
  return NextResponse.json({ ok: true })
}
