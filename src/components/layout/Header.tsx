import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { BRAND } from '@/lib/constants/brand'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export function Header() {
  const t = useTranslations('nav')
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-canvas)]">
      {/* Top accent bar — LV 스타일 브랜드 강조 라인 */}
      <div className="h-[3px] bg-[var(--color-espresso)]" />

      <div className="border-b border-[var(--color-hairline)]">
        <nav
          aria-label="주 내비게이션"
          className="relative mx-auto max-w-[1440px] h-[68px] px-6 lg:px-16 flex items-center justify-between"
        >
          {/* Left */}
          <div className="flex items-center gap-7">
            <Link
              href="/menu"
              className="flex items-center gap-2 text-[11px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
                <rect width="18" height="1.5" rx="0.75" />
                <rect y="5.25" width="18" height="1.5" rx="0.75" />
                <rect y="10.5" width="18" height="1.5" rx="0.75" />
              </svg>
              <span>{t('menu')}</span>
            </Link>
            <Link
              href="/#locations"
              className="hidden md:block text-[11px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
            >
              {t('locationsShort')}
            </Link>
          </div>

          {/* Center — 브랜드명 절대 중앙 */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap hover:opacity-60 transition-opacity"
          >
            <span className="text-[23px] md:text-[26px] tracking-[5px] font-medium text-[var(--color-espresso)]">
              {BRAND.nameKo}
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-5 md:gap-7">
            <Link
              href="/#group"
              className="hidden md:block text-[11px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
            >
              {t('group')}
            </Link>
            <Link
              href="/#reserve"
              className="text-[11px] tracking-[1.5px] text-[var(--color-ink)] hover:opacity-50 transition-opacity"
            >
              {t('reserve')}
            </Link>
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  )
}
