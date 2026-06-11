import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FaqAccordion } from '@/components/ui/FaqAccordion'
import type { Faq } from '@/lib/fetchers/faqs'
import type { Location } from '@/lib/fetchers/locations'
import { BRAND, LOCATION_CTA } from '@/lib/constants/brand'

function getFaqText(faq: Faq, locale: string): { q: string; a: string } {
  if (locale === 'en')
    return { q: faq.question_en ?? faq.question_ko, a: faq.answer_en ?? faq.answer_ko }
  if (locale === 'ja')
    return { q: faq.question_ja ?? faq.question_ko, a: faq.answer_ja ?? faq.answer_ko }
  if (locale === 'vi')
    return { q: faq.question_vi ?? faq.question_ko, a: faq.answer_vi ?? faq.answer_ko }
  if (locale === 'zh')
    return { q: faq.question_zh_hans ?? faq.question_ko, a: faq.answer_zh_hans ?? faq.answer_ko }
  return { q: faq.question_ko, a: faq.answer_ko }
}

interface SeoPageProps {
  locale: string
  locations: Location[]
  faqs: Faq[]
  meta: {
    h1: string
    eyebrow: string
    description: string
    body: string[]
    locationSlug: 'yangjae' | 'euljiro'
    phone: string
    telHref: string
    ctaLabel: string
  }
}

export function SeoLandingPage({ locale, locations, faqs, meta }: SeoPageProps) {
  const cta = meta.locationSlug === 'yangjae' ? LOCATION_CTA.yangjae : LOCATION_CTA.euljiro

  const faqSchema = faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => {
          const { q, a } = getFaqText(faq, locale)
          return {
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          }
        }),
      }
    : null

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Header transparent={false} />
      <main className="min-h-screen bg-[var(--color-canvas)]">

        {/* 히어로 */}
        <section className="px-6 md:px-24 py-20 md:py-32 border-b border-[var(--color-hairline)]">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-[10px] tracking-[0.35em] uppercase text-[var(--color-espresso)] opacity-70 mb-5">
              {meta.eyebrow}
            </div>
            <h1
              className="text-[32px] md:text-[60px] font-normal tracking-[-0.02em] text-[var(--color-ink)] leading-[1.15] mb-8 max-w-[800px] [word-break:keep-all]"
              style={{ fontFamily: "'Cafe24Classictype', serif" }}
            >
              {meta.h1}
            </h1>
            <p className="text-[16px] leading-[1.85] text-[var(--color-body)] max-w-[640px] [word-break:keep-all] mb-10">
              {meta.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`/locations/${meta.locationSlug}`}
                className="inline-flex items-center px-7 py-3.5 bg-[var(--color-espresso)] text-[var(--color-canvas)] text-[12px] tracking-[0.15em] hover:opacity-80 transition-opacity"
              >
                지점 안내 보기
              </a>
              <a
                href={meta.telHref}
                className="inline-flex items-center px-7 py-3.5 border border-[var(--color-espresso)] text-[var(--color-espresso)] text-[12px] tracking-[0.15em] hover:opacity-70 transition-opacity"
              >
                {meta.phone} 전화 예약
              </a>
            </div>
          </div>
        </section>

        {/* 본문 */}
        <section className="px-6 md:px-24 py-16 md:py-24 border-b border-[var(--color-hairline)]">
          <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20">
            <div>
              <div className="text-[10px] tracking-[0.35em] uppercase text-[var(--color-espresso)] opacity-70 mb-5">
                WHY 육즙관리소
              </div>
              <div className="space-y-5">
                {meta.body.map((para, i) => (
                  <p key={i} className="text-[15px] leading-[1.9] text-[var(--color-body)] [word-break:keep-all]">
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: '식재료', value: '산청 흑돼지 · 거창 백돼지 · 지리산 청정 원육' },
                { label: '숙성', value: '특허 파동숙성 — 육즙·풍미 극대화' },
                { label: '직화', value: '100% 대나무 숯 직화 · 하향식 덕트' },
                { label: '서비스', value: '전담 서버 그릴링 · 7가지 시그니처 소스' },
                { label: '공간', value: meta.locationSlug === 'yangjae' ? '8·10인 룸 · 20·40인 단체석' : '4·8·10·16·20·35인 개별룸' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-6 pb-5 border-b border-[var(--color-hairline)]">
                  <span className="text-[11px] tracking-[0.2em] text-[var(--color-espresso)] font-semibold w-[56px] flex-shrink-0 pt-0.5">
                    {label}
                  </span>
                  <span className="text-[14px] leading-[1.7] text-[var(--color-body)]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="px-6 md:px-24 py-16 md:py-24 border-b border-[var(--color-hairline)]">
            <div className="max-w-[800px] mx-auto">
              <div className="text-[10px] tracking-[0.35em] uppercase text-[var(--color-espresso)] opacity-70 mb-8">
                FAQ
              </div>
              <FaqAccordion faqs={faqs} locale={locale} />
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-6 md:px-24 py-16 md:py-20 text-center">
          <div className="max-w-[600px] mx-auto">
            <p className="text-[13px] tracking-[0.2em] text-[var(--color-espresso)] mb-3 uppercase">RESERVATION</p>
            <h2
              className="text-[28px] md:text-[40px] font-normal text-[var(--color-ink)] mb-8 [word-break:keep-all]"
              style={{ fontFamily: "'Cafe24Classictype', serif" }}
            >
              지금 예약하기
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://app.catchtable.co.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[var(--color-espresso)] text-[var(--color-canvas)] text-[12px] tracking-[0.15em] hover:opacity-80 transition-opacity"
              >
                캐치테이블 예약
              </a>
              <a
                href={meta.telHref}
                className="inline-flex items-center px-8 py-4 border border-[var(--color-espresso)] text-[var(--color-espresso)] text-[12px] tracking-[0.15em] hover:opacity-70 transition-opacity"
              >
                {meta.phone}
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer locations={locations} />
    </>
  )
}
