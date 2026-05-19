'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mounted) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/admin/menu` },
      })
      if (!error) setSent(true)
    } catch (error) {
      console.error('Login error:', error)
    }
    setLoading(false)
  }

  if (!mounted) {
    return null
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <p className="text-[15px] font-medium text-[var(--color-ink)]">
            이메일을 확인해주세요
          </p>
          <p className="text-[13px] text-[var(--color-body)]">
            {email} 로 로그인 링크를 전송했습니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6 space-y-6">
        <h1 className="text-[20px] font-semibold text-[var(--color-ink)] tracking-tight">
          육즙관리소 어드민
        </h1>
        {searchParams.get('error') === 'unauthorized' && (
          <p className="text-[13px] text-red-500">등록된 관리자 계정이 아닙니다.</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--color-hairline)] rounded-[8px] text-[14px] outline-none focus:border-[var(--color-espresso)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-espresso)] text-white text-[14px] font-medium rounded-[8px] disabled:opacity-50"
          >
            {loading ? '전송 중...' : '로그인 링크 받기'}
          </button>
        </form>
      </div>
    </div>
  )
}