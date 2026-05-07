import Link from 'next/link'
import { BRAND } from '@/lib/constants/brand'

const NAV = [
  { href: '/menu', label: '메뉴' },
  { href: '/#locations', label: '지점' },
  { href: '/#group', label: '단체' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]">
      <nav aria-label="주 내비게이션" className="mx-auto max-w-[1440px] h-16 px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="flex flex-col gap-0.5">
          <span className="text-[20px] font-medium text-[var(--color-ink)]">{BRAND.nameKo}</span>
          <span className="text-[9px] tracking-[2px] text-[var(--color-body)] font-mono">{BRAND.tagline}</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8 text-[14px] text-[var(--color-ink)]">
          {NAV.map(n => <li key={n.href}><Link href={n.href} className="hover:text-[var(--color-forest-mid)]">{n.label}</Link></li>)}
        </ul>
        <Link href="/#reserve" className="bg-[var(--color-forest)] text-white px-6 py-3 rounded-[var(--radius-cta)] text-[14px] font-medium">
          예약하기
        </Link>
      </nav>
    </header>
  )
}
