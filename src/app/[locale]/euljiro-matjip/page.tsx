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
  title: '을지로 맛집 — 육즙관리소 을지로입구역 프리미엄 K-BBQ',
  description: '을지로 맛집 추천. 을지로입구역 2번 출구 도보 2분. 산청 흑돼지·거창 백돼지 프리미엄 K-BBQ. 이원일 셰프 추천, 특허 파동숙성, 전담 그릴링 서비스.',
  alternates: { canonical: '/euljiro-matjip' },
}

export default async function EuljiroMatjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'EULJIRO · PREMIUM K-BBQ',
        h1: '을지로 맛집\n육즙관리소 프리미엄 K-BBQ',
        description: '을지로입구역 2번 출구 도보 2분. 을지로·명동·광화문 인근 프리미엄 K-BBQ 맛집. 지리산 산청 흑돼지와 거창 백돼지, 특허 파동숙성, 100% 대나무 숯 직화, 전담 그릴링 서비스.',
        body: [
          '육즙관리소 을지로입구점은 을지로 인근에서 가장 격 있는 프리미엄 K-BBQ 다이닝입니다. 을지로의 트렌디한 골목 문화와 광화문·명동의 도심 비즈니스 거리 중간에 위치하여, 다양한 목적의 식사를 위한 공간으로 사랑받고 있습니다.',
          '지리산 산청 흑돼지와 거창 백돼지를 특허 파동숙성으로 풍미를 끌어올리고, 100% 대나무 숯 직화와 전담 그릴링 서비스로 가장 맛있는 타이밍에 제공합니다. 이원일 셰프가 직접 추천한 미친듯이 맛있는 돼지고기를 을지로에서 만나보세요.',
          '을지로 맛집을 찾는다면 육즙관리소를 선택하세요. 개인 식사부터 비즈니스 디너, 단체 회식까지 모든 목적에 맞는 공간과 서비스를 준비하고 있습니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '을지로입구점 예약',
      }}
    />
  )
}
