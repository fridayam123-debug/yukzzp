import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/fetchers/posts'
import { getLocations } from '@/lib/fetchers/locations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale, slug: 'placeholder' }))
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale as AppLocale)

  const [post, locations] = await Promise.all([
    getPostBySlug(slug),
    getLocations(),
  ])
  if (!post) notFound()

  return (
    <>
      <Header transparent={false} />
      <main className="min-h-screen bg-[var(--color-canvas)]">
        {/* 브레드크럼 */}
        <div className="border-b border-[var(--color-hairline)] px-6 md:px-24 py-5">
          <div className="max-w-[1440px] mx-auto flex items-center gap-2 text-[11px] tracking-[0.15em] text-[var(--color-body)] opacity-60">
            <Link href="/notice" className="hover:opacity-100 transition-opacity">NOTICE</Link>
            <span>›</span>
            <span>{post.category}</span>
          </div>
        </div>

        {/* 본문 */}
        <article className="px-6 md:px-24 py-12 md:py-20">
          <div className="max-w-[720px] mx-auto">
            {/* 메타 */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] tracking-[0.25em] text-[var(--color-espresso)] font-semibold">
                {post.category}
              </span>
              <span className="text-[var(--color-hairline)]">·</span>
              <span className="text-[11px] tracking-[0.05em] text-[var(--color-body)] opacity-60">
                {formatDate(post.published_at ?? post.created_at)}
              </span>
            </div>

            {/* 제목 */}
            <h1
              className="text-[28px] md:text-[42px] font-normal leading-[1.25] tracking-[-0.02em] text-[var(--color-ink)] mb-8 [word-break:keep-all]"
              style={{ fontFamily: "'Cafe24Classictype', serif" }}
            >
              {post.title}
            </h1>

            {/* 썸네일 */}
            {post.thumbnail_url && (
              <div className="aspect-video overflow-hidden mb-10">
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 구분선 */}
            <div className="border-t border-[var(--color-hairline)] mb-10" />

            {/* 본문 */}
            <div className="prose-notice text-[15px] leading-[1.9] text-[var(--color-body)] tracking-[0.01em] whitespace-pre-wrap [word-break:keep-all]">
              {post.content}
            </div>

            {/* 하단 */}
            <div className="border-t border-[var(--color-hairline)] mt-16 pt-8">
              <Link
                href="/notice"
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-[var(--color-body)] hover:text-[var(--color-espresso)] transition-colors"
              >
                ← 목록으로
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer locations={locations} />
    </>
  )
}
