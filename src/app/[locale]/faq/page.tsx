import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getLocations } from '@/lib/fetchers/locations'
import { getAllFaqs } from '@/lib/fetchers/faqs'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { AppLocale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { FaqAccordion } from '@/components/ui/FaqAccordion'

export const metadata: Metadata = {
  title: '육즙관리소 FAQ | 양재역·을지로동대문 프리미엄 K-BBQ 자주 묻는 질문',
  description:
    '이원일 셰프가 소개한 육즙관리소의 산청 흑돼지, 전담 그릴링 서비스, 하향식 덕트, 회식·접대·데이트·외국인 방문 관련 자주 묻는 질문을 확인하세요.',
  alternates: {
    canonical: '/faq',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale as AppLocale)

  const [locations, faqs] = await Promise.all([getLocations(), getAllFaqs()])

  const generalFaqs = faqs.filter((f) => f.category === 'general')
  const storeGroups = locations
    .map((loc) => ({
      key: loc.slug,
      label: loc.name_ko.replace('육즙관리소 ', ''),
      faqs: faqs.filter((f) => f.category === loc.slug),
    }))
    .filter((g) => g.faqs.length > 0)

  const allFaqsForSchema = [...storeGroups.flatMap((g) => g.faqs), ...generalFaqs]
  const faqSchema = allFaqsForSchema.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: allFaqsForSchema.map((f) => ({
          '@type': 'Question',
          name: f.question_ko,
          acceptedAnswer: { '@type': 'Answer', text: f.answer_ko },
        })),
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
      <main className="min-h-screen bg-[#C8BDB0]">
        {/* 헤더 */}
        <div className="border-b border-[var(--color-hairline)] px-6 md:px-24 py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-espresso)] mb-4">
              FAQ
            </p>
            <h1
              className="text-[36px] md:text-[64px] font-normal tracking-[-0.02em] text-[var(--color-ink)]"
              style={{ fontFamily: "'Cafe24Classictype', serif" }}
            >
              자주 묻는 질문
            </h1>
          </div>
        </div>

        {/* FAQ 콘텐츠 */}
        <div className="px-6 md:px-24 py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto">
            <div className="max-w-[800px]">
              {storeGroups.map((g) => (
                <div key={g.key} className="mb-12">
                  <h2 className="text-[13px] tracking-[0.25em] text-[var(--color-espresso)] font-semibold mb-6 uppercase">
                    {g.label} FAQ
                  </h2>
                  <FaqAccordion faqs={g.faqs} locale={locale} />
                </div>
              ))}
              {generalFaqs.length > 0 && (
                <div>
                  <h2 className="text-[13px] tracking-[0.25em] text-[var(--color-espresso)] font-semibold mb-6 uppercase">
                    공통 FAQ
                  </h2>
                  <FaqAccordion faqs={generalFaqs} locale={locale} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer locations={locations} />
    </>
  )
}
