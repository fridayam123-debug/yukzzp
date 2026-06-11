import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { BRAND } from '@/lib/constants/brand'
import type { Database } from '@/lib/supabase/types'

type Loc = Database['public']['Tables']['locations']['Row']

function IconInstagram({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37"/>
      <circle cx="17.5" cy="6.5" r="1.5"/>
    </svg>
  )
}

function IconYoutube({ className = '' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export function Footer({ locations }: { locations: Loc[] }) {
  const t = useTranslations('footer')
  const sorted = [...locations].sort((a, b) => a.slug === 'yangjae' ? -1 : b.slug === 'yangjae' ? 1 : 0)
  return (
    <footer className="bg-[var(--color-forest)] text-[var(--color-canvas)] px-6 lg:px-20 pt-16 pb-8 mt-auto">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="text-[24px] font-normal tracking-[0.04em]">{BRAND.nameKo}</div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[var(--color-cream-gold)] mt-3">{BRAND.tagline}</div>

            <div className="flex gap-1 mt-4 items-center -ml-2.5">
              <a
                href={BRAND.instagramUrl}
                aria-label="Instagram"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center w-11 h-11 hover:opacity-70 transition-opacity"
              >
                <IconInstagram className="w-[18px] h-[18px]" />
              </a>
              <a
                href={BRAND.youtubeShort}
                aria-label="YouTube"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center w-11 h-11 hover:opacity-70 transition-opacity"
              >
                <IconYoutube className="w-[18px] h-[18px]" />
              </a>
              {BRAND.kakaoChannelUrl && (
                <a
                  href={BRAND.kakaoChannelUrl}
                  aria-label="카카오 채널"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center px-3 h-11 text-[12px] tracking-[0.15em] uppercase text-[var(--color-cream-gold)] hover:opacity-70 transition-opacity"
                >
                  {t('kakao')}
                </a>
              )}
            </div>
          </div>
          {sorted.map(loc => (
            <div key={loc.slug}>
              <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-cream-gold)]">{loc.slug.toUpperCase()}</div>
              <div className="mt-3 text-[14px] font-normal">{loc.name_ko}</div>
              <p className="mt-2 text-[12px] text-[var(--color-canvas)]/85 leading-relaxed">{loc.address_road}</p>
              <p className="mt-1 text-[12px] text-[var(--color-canvas)]/85 tracking-[0.05em]">☎ {loc.virtual_phone}</p>
            </div>
          ))}
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-cream-gold)]">{t('navHeading')}</div>
            <ul className="mt-3 space-y-2 text-[12px] text-[var(--color-canvas)]/85">
              <li><Link href="/menu" className="hover:text-[var(--color-canvas)] transition-colors">{t('navMenu')}</Link></li>
              <li><Link href="/#group" className="hover:text-[var(--color-canvas)] transition-colors">{t('navGroup')}</Link></li>
              <li><Link href="/#reserve" className="hover:text-[var(--color-canvas)] transition-colors">{t('navReserve')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--color-canvas)]/10 flex flex-col md:flex-row justify-between text-[11px] text-[var(--color-canvas)]/50 tracking-[0.05em]">
          <span>{t('copyright', { year: new Date().getFullYear() })}</span>
          <span>@{BRAND.instagramHandle}</span>
        </div>
      </div>
    </footer>
  )
}
