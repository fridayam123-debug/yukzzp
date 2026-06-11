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
  title: '동대문 삼겹살 — 육즙관리소 산청 흑돼지 삼겹살',
  description: '동대문 삼겹살 맛집. 지리산 산청 흑돼지 삼겹살, 특허 파동숙성, 100% 대나무 숯 직화. 을지로입구역 도보 2분. 이원일 셰프 추천 K-BBQ 다이닝.',
  alternates: { canonical: '/dongdaemun-samgyeopsal' },
}

export default async function DongdaemunSamgyeopsalPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'DONGDAEMUN · SANCHEONG BLACK PORK',
        h1: '동대문 삼겹살\n산청 흑돼지 파동숙성',
        description: '동대문 근처 프리미엄 흑돼지 삼겹살. 을지로입구역 도보 2분. 지리산 산청 흑돼지 삼겹살을 특허 파동숙성과 100% 대나무 숯 직화로 구워내는 동대문·을지로 최고의 삼겹살.',
        body: [
          '동대문 근처에서 프리미엄 흑돼지 삼겹살을 찾는다면 육즙관리소 을지로입구점이 최선의 선택입니다. 동대문시장·DDP에서 도보로 이동 가능한 을지로입구역 인근에 위치하여 접근이 편리합니다.',
          '야생쑥을 먹고 자란 지리산 산청 흑돼지 삼겹살은 일반 삼겹살과 확연히 다른 깊은 풍미를 자랑합니다. 쑥의 항산화 성분이 잡내를 없애고, 흑돼지 특유의 탄탄한 지방이 구워지면서 고소하고 달콤한 향을 냅니다.',
          '특허 파동숙성과 100% 대나무 숯 직화, 전담 그릴링 서비스의 조합으로 동대문에서 최고의 삼겹살을 경험해 보세요. 이원일 셰프도 직접 추천한 미친듯이 맛있는 삼겹살입니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '을지로입구점 예약',
      }}
    />
  )
}
