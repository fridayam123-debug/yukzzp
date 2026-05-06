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
