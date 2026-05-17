import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

async function adminAuth(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // admin_users 테이블에 등록된 사용자만 허용
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!adminUser) {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
  }

  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1) Admin routes — auth required, no locale prefix
  if (pathname.startsWith('/admin')) {
    return adminAuth(request)
  }

  // 2) Skip i18n for login (auth flow, single language)
  if (pathname === '/login' || pathname.startsWith('/login/')) {
    return NextResponse.next()
  }

  // 3) Everything else — locale routing via next-intl
  return intlMiddleware(request)
}

export const config = {
  // Match admin + everything except _next, static assets, and files with an extension
  matcher: ['/admin/:path*', '/((?!_next|.*\\..*).*)'],
}
