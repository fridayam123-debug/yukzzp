import Link from 'next/link'

const NAV = [
  { href: '/admin/copy', label: '문구 관리' },
  { href: '/admin/menu', label: '메뉴 사진' },
  { href: '/admin/menu/develop', label: 'AI 메뉴 개발' },
  { href: '/admin/media', label: '미디어' },
  { href: '/admin/reviews', label: '리뷰 관리' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      <header className="border-b border-[var(--color-hairline)] bg-white px-8 py-4 flex items-center gap-8">
        <span className="text-[13px] font-semibold text-[var(--color-ink)] tracking-[0.05em]">ADMIN</span>
        <nav className="flex gap-6">
          {NAV.map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[13px] text-[var(--color-body)] hover:text-[var(--color-ink)] transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
