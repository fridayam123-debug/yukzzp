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
  title: '동대문 맛집 — 육즙관리소 을지로입구역 프리미엄 K-BBQ',
  description: '동대문 근처 프리미엄 흑돼지 맛집. 을지로입구역 2번 출구 도보 2분. 산청 흑돼지·거창 백돼지, 특허 파동숙성. 외국인 관광객 환영, 영어 메뉴 완비.',
  alternates: { canonical: '/dongdaemun-matjip' },
}

export default async function DongdaemunMatjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'EULJIRO · DONGDAEMUN · PREMIUM K-BBQ',
        h1: '동대문 맛집\n육즙관리소 을지로입구점',
        description: '을지로입구역 2번 출구에서 도보 2분. 동대문·을지로 일대에서 가장 격 있는 프리미엄 K-BBQ 다이닝. 외국인 관광객을 위한 영어 메뉴와 다국어 서비스, 지리산 산청 흑돼지와 100% 대나무 숯 직화 그릴링.',
        body: [
          '육즙관리소 을지로입구점은 동대문·을지로 일대에서 가장 완성도 높은 프리미엄 K-BBQ 다이닝입니다. 도심 속에서도 품격 있는 다이닝 경험을 원하는 분들을 위한 공간입니다.',
          '외국인 관광객을 위한 영어·일어·중국어 메뉴를 완비하고 있으며, 전담 서버의 그릴링 서비스로 언어 장벽 없이 최고의 K-BBQ를 경험하실 수 있습니다. 명동·동대문·을지로를 방문하는 외국인 고객들에게 진정한 한국 프리미엄 흑돼지의 맛을 소개합니다.',
          '지리산 산청 흑돼지와 거창 백돼지의 깊은 풍미를 특허 파동숙성과 100% 대나무 숯 직화로 완성합니다. 한국을 대표하는 K-BBQ 다이닝 경험을 을지로에서 만나보세요.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '을지로입구점 예약',
      }}
    />
  )
}
