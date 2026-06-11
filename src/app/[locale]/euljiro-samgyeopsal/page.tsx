import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getLocations } from '@/lib/fetchers/locations'
import { getFaqs } from '@/lib/fetchers/faqs'
import { SeoLandingPage } from '@/components/seo/SeoLandingPage'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: '을지로 삼겹살 — 육즙관리소 산청 흑돼지 삼겹살',
  description: '을지로 삼겹살 맛집. 지리산 산청 흑돼지 삼겹살, 특허 파동숙성, 100% 대나무 숯 직화. 을지로입구역 2번 출구 도보 2분. 이원일 셰프 추천 K-BBQ.',
  alternates: { canonical: '/euljiro-samgyeopsal' },
}

export default async function EuljiroSamgyeopsalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [locations, faqs] = await Promise.all([
    getLocations(),
    getFaqs('euljiro'),
  ])
  return (
    <SeoLandingPage
      locale={locale}
      locations={locations}
      faqs={faqs}
      meta={{
        eyebrow: 'EULJIRO · SANCHEONG BLACK PORK',
        h1: '을지로 삼겹살\n산청 흑돼지 파동숙성',
        description: '을지로에서 만나는 프리미엄 흑돼지 삼겹살. 지리산 산청 흑돼지 삼겹살을 특허 파동숙성과 100% 대나무 숯 직화로 구워내는 을지로 최고의 삼겹살 전문점. 을지로입구역 도보 2분.',
        body: [
          '을지로에서 흑돼지 삼겹살을 찾는다면 육즙관리소가 정답입니다. 지리산 산청 흑돼지 삼겹살은 일반 삼겹살과 육안으로도 구분되는 탄탄한 지방층과 윤기 있는 살코기 결이 특징입니다.',
          '특허 파동숙성 기술로 삼겹살 조직을 이완시켜 육즙이 구우는 과정에서 빠져나가지 않도록 합니다. 100% 대나무 숯의 높은 열과 은은한 향이 더해지면, 겉면은 바삭하고 속은 촉촉한 완벽한 삼겹살이 완성됩니다.',
          '한입 베어물면 흑돼지 특유의 고소한 지방이 녹아드는 풍미를 느낄 수 있습니다. 7가지 시그니처 소스와 함께, 을지로 삼겹살의 새로운 기준을 경험해 보세요.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '을지로입구점 예약',
      }}
    />
  )
}
