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
  return (
    <footer className="bg-[var(--color-forest)] text-white px-6 lg:px-20 pt-16 pb-8 mt-auto">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="text-[24px] font-medium">{BRAND.nameKo}</div>
            <div className="text-[10px] tracking-[2px] font-mono text-[var(--color-cream-gold)] mt-2">{BRAND.tagline}</div>
            <p className="mt-3 text-[13px] text-white/70 leading-relaxed">산청 흑돼지 · 거창 백돼지 · 100% 대나무 숯</p>
            <div className="flex gap-3 mt-4">
              <a href={BRAND.instagramUrl} aria-label="Instagram" target="_blank" rel="noopener"><IconInstagram className="w-[18px] h-[18px]"/></a>
              <a href={BRAND.youtubeShort} aria-label="YouTube" target="_blank" rel="noopener"><IconYoutube className="w-[18px] h-[18px]"/></a>
              {BRAND.kakaoChannelUrl && (
                <a href={BRAND.kakaoChannelUrl} aria-label="카카오 채널" target="_blank" rel="noopener" className="text-[13px] font-mono text-[var(--color-cream-gold)]">카카오</a>
              )}
            </div>
          </div>
          {locations.map(loc => (
            <div key={loc.slug}>
              <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-cream-gold)]">{loc.slug.toUpperCase()}</div>
              <div className="mt-2 text-[14px] font-medium">{loc.name_ko}</div>
              <p className="mt-2 text-[12px] text-white/85 leading-relaxed">{loc.address_road}</p>
              <p className="mt-1 text-[12px] text-white/85 font-mono">☎ {loc.virtual_phone}</p>
            </div>
          ))}
          <div>
            <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-cream-gold)]">NAV</div>
            <ul className="mt-2 space-y-2 text-[12px] text-white/85">
              <li><a href="/menu">메뉴</a></li>
              <li><a href="/#group">단체 회식</a></li>
              <li><a href="/#reserve">예약</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between text-[11px] text-white/50 font-mono">
          <span>© {new Date().getFullYear()} 육즙관리소 · 메뉴/가격은 매장 상황에 따라 다를 수 있습니다</span>
          <span>@{BRAND.instagramHandle}</span>
        </div>
      </div>
    </footer>
  )
}
