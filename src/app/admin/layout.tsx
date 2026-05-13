import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin/menu', label: '메뉴 사진 관리' },
  { href: '/admin/menu/develop', label: 'AI 메뉴 개발' },
  { href: '/admin/media', label: '미디어' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-[200px] shrink-0 border-r border-[var(--color-hairline)] bg-white px-4 py-8">
        <p className="text-[11px] font-semibold text-[var(--color-body)] uppercase tracking-widest mb-6">
          관리자
        </p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-[6px] text-[13px] text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
