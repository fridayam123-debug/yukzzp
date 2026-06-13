import { setRequestLocale } from 'next-intl/server'
import { getPosts, type PostCategory } from '@/lib/fetchers/posts'
import { getLocations } from '@/lib/fetchers/locations'
import { getAllFaqs, type Faq } from '@/lib/fetchers/faqs'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { FaqAccordion } from '@/components/ui/FaqAccordion'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const rawCat = category?.toUpperCase()
  const isFaqTab = !rawCat || rawCat === 'FAQ'
  if (isFaqTab) {
    return {
      title: '육즙관리소 FAQ | 양재역·을지로동대문 프리미엄 K-BBQ 자주 묻는 질문',
      description: '이원일 셰프가 소개한 육즙관리소의 산청 흑돼지, 전담 그릴링 서비스, 하향식 덕트, 회식·접대·데이트·외국인 방문 관련 자주 묻는 질문을 확인하세요.',
      alternates: { canonical: '/faq' },
    }
  }
  return {
    title: 'NOTICE — 육즙관리소',
    alternates: { canonical: '/notice' },
  }
}

const TABS = [
  { key: 'FAQ',     label: 'FAQ' },
  { key: 'NOTICE',  label: '새소식' },
  { key: 'STORY',   label: 'STORY' },
] as const

type TabKey = typeof TABS[number]['key']

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

  const rawCat = category?.toUpperCase()
  const activeTab = (rawCat && TABS.some((t) => t.key === rawCat))
    ? (rawCat as TabKey)
    : 'FAQ' as TabKey
  const isFaq = activeTab === 'FAQ'

  const activePostCategory = (activeTab && !isFaq)
    ? (activeTab as PostCategory)
    : undefined

  const [posts, locations, faqs] = await Promise.all([
    isFaq ? Promise.resolve([]) : getPosts(activePostCategory),
    getLocations(),
    isFaq ? getAllFaqs() : Promise.resolve([]),
  ])

  // 매장별 FAQ 그룹 (동적) — locations 테이블 기반. 직영점 추가 시 자동 반영
  const generalFaqs = faqs.filter((f) => f.category === 'general')
  const storeGroups = locations
    .map((loc) => ({
      key: loc.slug,
      label: loc.name_ko.replace('육즙관리소 ', ''),
      faqs: faqs.filter((f) => f.category === loc.slug),
    }))
    .filter((g) => g.faqs.length > 0)

  // FAQPage JSON-LD — FAQ 탭일 때만 삽입. 매장별(매장 FAQ + 공통 FAQ)로 생성
  const faqSchemas = isFaq
    ? storeGroups.map((g) => ({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [...g.faqs, ...generalFaqs].map((f) => ({
          '@type': 'Question',
          name: f.question_ko,
          acceptedAnswer: { '@type': 'Answer', text: f.answer_ko },
        })),
      }))
    : []

  return (
    <>
      {faqSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Header transparent={false} />
      <main className="min-h-screen bg-[#C8BDB0]">
        {/* 헤더 */}
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
            {TABS.map(({ key, label }) => {
              const isActive = activeTab === key
              const href = `/notice?category=${key.toLowerCase()}`
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

        {/* 콘텐츠 */}
        <div className="px-6 md:px-24 py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto">

            {/* FAQ 탭 */}
            {isFaq ? (
              <div className="max-w-[800px]">
                {/* 매장별 FAQ — locations 기반 동적 렌더링 (직영점 추가 시 자동 노출) */}
                {storeGroups.map((g) => (
                  <div key={g.key} className="mb-12">
                    <h2 className="text-[13px] tracking-[0.25em] text-[var(--color-espresso)] font-semibold mb-6 uppercase">
                      {g.label} FAQ
                    </h2>
                    <FaqAccordion faqs={g.faqs} locale={locale} />
                  </div>
                ))}
                {/* 공통 */}
                {generalFaqs.length > 0 && (
                  <div>
                    <h2 className="text-[13px] tracking-[0.25em] text-[var(--color-espresso)] font-semibold mb-6 uppercase">
                      공통 FAQ
                    </h2>
                    <FaqAccordion faqs={generalFaqs} locale={locale} />
                  </div>
                )}
              </div>
            ) : (
              /* 포스트 그리드 */
              posts.length === 0 ? (
                <div className="py-24 text-center text-[13px] text-[var(--color-body)] tracking-[0.1em] opacity-60">
                  아직 게시된 글이 없습니다
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/notice/${post.slug}`} className="group block">
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
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] tracking-[0.25em] text-[var(--color-espresso)] font-semibold">
                          {post.category}
                        </span>
                        <span className="text-[var(--color-hairline)]">·</span>
                        <span className="text-[11px] tracking-[0.05em] text-[var(--color-body)] opacity-60">
                          {formatDate(post.published_at ?? post.created_at)}
                        </span>
                      </div>
                      <h2 className="text-[17px] font-normal leading-[1.4] tracking-[-0.01em] text-[var(--color-ink)] group-hover:opacity-70 transition-opacity [word-break:keep-all]">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 text-[13px] leading-[1.7] text-[var(--color-body)] opacity-75 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </main>
      <Footer locations={locations} />
    </>
  )
}
