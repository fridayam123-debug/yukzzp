'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { BRAND } from '@/lib/constants/brand'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export function Header({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!transparent) return
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [transparent])

  // 드로어 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const bgAlpha = !transparent ? 0.95 : scrolled ? 0.92 : 0.72
  const blur = !transparent ? 0 : 16

  const NAV_LINKS = [
    { href: '/menu',      label: t('menu') },
    { href: '/#locations', label: t('locationsShort') },
    { href: '/#reviews',   label: t('reviews') },
    { href: '/notice',     label: t('notice') },
    { href: '/#group',     label: t('group') },
    { href: '/#reserve',   label: t('reserve') },
  ]

  return (
    <>
      <header
        className={`${transparent ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-40 transition-all duration-500`}
        style={{ backgroundColor: `rgba(232,223,210,${bgAlpha})`, backdropFilter: blur ? `blur(${blur}px)` : undefined }}
      >
        <div className="border-b border-[var(--color-hairline)]">
          <nav
            aria-label="주 내비게이션"
            className="relative mx-auto max-w-[1440px] h-[72px] md:h-[136px] px-6 lg:px-16 flex items-end pb-8 justify-between"
          >
            {/* ── MOBILE 왼쪽: 햄버거 ── */}
            <button
              type="button"
              aria-label="메뉴 열기"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="flex md:hidden flex-col justify-center gap-[5px] w-[44px] h-[44px] -ml-2"
            >
              <span className="block w-[20px] h-[1.5px] bg-[var(--color-ink)] rounded-full" />
              <span className="block w-[20px] h-[1.5px] bg-[var(--color-ink)] rounded-full" />
              <span className="block w-[20px] h-[1.5px] bg-[var(--color-ink)] rounded-full" />
            </button>

            {/* ── DESKTOP 왼쪽: 텍스트 링크 ── */}
            <div className="hidden md:flex flex-1 items-center gap-7 justify-start">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center min-w-[44px] py-3.5 -my-3.5 text-[16.5px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
              >
                {t('menu')}
              </Link>
              <Link
                href="/#locations"
                className="inline-flex items-center justify-center min-w-[44px] py-3.5 -my-3.5 text-[16.5px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
              >
                {t('locationsShort')}
              </Link>
              <Link
                href="/#reviews"
                className="inline-flex items-center justify-center min-w-[44px] py-3.5 -my-3.5 text-[16.5px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
              >
                {t('reviews')}
              </Link>
              <Link
                href="/notice"
                className="inline-flex items-center justify-center min-w-[44px] py-3.5 -my-3.5 text-[16.5px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
              >
                {t('notice')}
              </Link>
            </div>

            {/* ── 센터: 로고 ── */}
            <Link
              href="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="absolute left-1/2 -translate-x-1/2 hover:opacity-70 transition-opacity"
              aria-label={BRAND.nameKo}
            >
              <Image
                src="/logo.png"
                alt={BRAND.nameKo}
                width={1080}
                height={573}
                priority
                unoptimized
                className="h-[50px] md:h-[111px] w-auto object-contain"
              />
            </Link>

            {/* ── DESKTOP 오른쪽 ── */}
            <div className="hidden md:flex flex-1 items-center gap-7 justify-end">
              <Link
                href="/#group"
                className="inline-flex items-center justify-center min-w-[44px] py-3.5 -my-3.5 text-[16.5px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
              >
                {t('group')}
              </Link>
              <Link
                href="/#reserve"
                className="inline-flex items-center justify-center min-w-[44px] py-3.5 -my-3.5 text-[16.5px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
              >
                {t('reserve')}
              </Link>
              <LanguageSwitcher />
            </div>

            {/* ── MOBILE 오른쪽: 언어만 ── */}
            <div className="flex md:hidden">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </header>

      {/* ── MOBILE 드로어 ── */}
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 md:hidden ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* 드로어 패널 */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col bg-[rgba(232,223,210,0.98)] backdrop-blur-md transition-transform duration-300 ease-out md:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="내비게이션 메뉴"
      >
        {/* 드로어 상단 */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-[var(--color-hairline)]">
          <span className="text-[11px] tracking-[2px] text-[var(--color-espresso)] font-semibold">MENU</span>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setDrawerOpen(false)}
            className="w-[44px] h-[44px] flex items-center justify-center -mr-2 hover:opacity-50 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>

        {/* 드로어 링크 */}
        <nav className="flex flex-col px-6 pt-8 gap-0">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className="py-4 text-[13px] tracking-[2px] text-[var(--color-ink)] border-b border-[var(--color-hairline)] hover:opacity-50 transition-opacity"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
