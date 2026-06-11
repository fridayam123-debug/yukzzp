import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Service-role Supabase client — RLS bypass.
 * **서버 액션·route handler에서만 사용**. 절대 브라우저로 노출 X.
 * 일반적으로 어드민 작업이나 백엔드 자동화에만.
 */
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}

/**
 * 쿠키 없이 anon key로만 동작하는 공개 읽기 전용 클라이언트.
 * unstable_cache 내부에서 사용 가능 (cookies() 호출 없음).
 * RLS public read 정책이 적용된 테이블에만 사용.
 * 개방형 WiFi 등 불안정한 네트워크에서 hang 방지를 위해
 * 모든 fetch 요청에 8초 AbortController 타임아웃 적용.
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: (url, options = {}) => {
          const controller = new AbortController()
          const id = setTimeout(() => controller.abort(), 5000)
          return fetch(url, { ...options, signal: controller.signal }).finally(
            () => clearTimeout(id),
          )
        },
      },
    },
  )
}
