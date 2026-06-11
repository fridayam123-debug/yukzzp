import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { getPosts, type PostCategory } from '@/lib/fetchers/posts'
import { getLocations } from '@/lib/fetchers/locations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const CATEGORIES: { key: PostCategory | 'ALL'; label: string }[] = [
  { key: 'ALL',     label: 'ALL' },
  { key: 'NOTICE',  label: 'NOTICE' },
  { key: 'JOURNAL', label: 'JOURNAL' },
  { key: 'STORY',   label: 'STORY' },
]

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default async function NoticePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale as AppLocale)

  const activeCategory = (category?.toUpperCase() as PostCategory) || undefined
  const [posts, locations] = await Promise.all([
    getPosts(activeCategory),
    getLocations(),
  ])

  return (
    <>
      <Header transparent={false} />
      <main className="min-h-screen bg-[#C8BDB0]">
        {/* 헤더 영역 */}
        <div className="border-b border-[var(--color-hairline)] px-6 md:px-24 py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto">
            <h1
              className="text-[36px] md:text-[64px] font-normal tracking-[-0.02em] text-[var(--color-ink)]"
              style={{ fontFamily: "'Cafe24Classictype', serif" }}
            >
              NOTICE
            </h1>
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="border-b border-[var(--color-hairline)] px-6 md:px-24">
          <div className="max-w-[1440px] mx-auto flex gap-8 overflow-x-auto">
            {CATEGORIES.map(({ key, label }) => {
              const isActive = key === 'ALL' ? !activeCategory : activeCategory === key
              const href = key === 'ALL' ? '/notice' : `/notice?category=${key.toLowerCase()}`
              return (
                <Link
                  key={key}
                  href={href}
                  className={`py-4 text-[11px] tracking-[0.25em] whitespace-nowrap border-b-[1.5px] transition-all ${
                    isActive
                      ? 'border-[var(--color-espresso)] text-[var(--color-espresso)] font-semibold'
                      : 'border-transparent text-[var(--color-body)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* 포스트 그리드 */}
        <div className="px-6 md:px-24 py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto">
            {posts.length === 0 ? (
              <div className="py-24 text-center text-[13px] text-[var(--color-body)] tracking-[0.1em] opacity-60">
                아직 게시된 글이 없습니다
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {posts.map((post) => (
                  <Link key={post.id} href={`/notice/${post.slug}`} className="group block">
                    {/* 썸네일 */}
                    <div className="aspect-[4/3] bg-[var(--color-stone)] overflow-hidden mb-5">
                      {post.thumbnail_url ? (
                        <img
                          src={post.thumbnail_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[11px] tracking-[0.25em] text-[var(--color-body)] opacity-40">
                            {post.category}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* 메타 */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] tracking-[0.25em] text-[var(--color-espresso)] font-semibold">
                        {post.category}
                      </span>
                      <span className="text-[var(--color-hairline)]">·</span>
                      <span className="text-[11px] tracking-[0.05em] text-[var(--color-body)] opacity-60">
                        {formatDate(post.published_at ?? post.created_at)}
                      </span>
                    </div>
                    {/* 제목 */}
                    <h2 className="text-[17px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-ink)] group-hover:opacity-70 transition-opacity [word-break:keep-all]">
                      {post.title}
                    </h2>
                    {/* 요약 */}
                    {post.excerpt && (
                      <p className="mt-2 text-[13px] leading-[1.7] text-[var(--color-body)] opacity-75 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer locations={locations} />
    </>
  )
}
