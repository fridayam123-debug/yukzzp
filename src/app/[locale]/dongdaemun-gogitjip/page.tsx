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
  title: '동대문 고깃집 · 고기집 — 육즙관리소 프리미엄 K-BBQ',
  description: '동대문 고깃집 추천. 산청 흑돼지·거창 백돼지 특화 프리미엄 고기집. 을지로입구역 2번 출구 도보 2분. 외국인 영어 메뉴 완비, 전담 그릴링 서비스.',
  alternates: { canonical: '/dongdaemun-gogitjip' },
}

export default async function DongdaemunGogitjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'DONGDAEMUN · EULJIRO · PREMIUM PORK BBQ',
        h1: '동대문 고깃집\n육즙관리소 프리미엄 K-BBQ',
        description: '동대문 근처 최고의 고깃집. 을지로입구역 2번 출구 도보 2분. 지리산 산청 흑돼지와 거창 백돼지 프리미엄 고기 전문점. 외국인 관광객 영어 메뉴 완비, 전담 그릴링 서비스.',
        body: [
          '동대문·을지로 인근에서 제대로 된 고깃집을 찾는다면 육즙관리소 을지로입구점을 추천합니다. 동대문시장·DDP·을지로 골목에서 도보로 접근 가능한 위치에 자리한 프리미엄 고기 다이닝입니다.',
          '지리산 산청 흑돼지와 거창 백돼지는 일반 고깃집에서 접하기 어려운 프리미엄 원육입니다. 특허 파동숙성으로 각 부위의 육즙과 풍미를 극대화하고, 100% 대나무 숯 직화와 전담 그릴링 서비스로 최고의 타이밍에 제공합니다.',
          '외국인 관광객과 바이어를 위한 영어·일어·중국어 다국어 메뉴를 완비하고 있어, 한국을 방문한 외국인 지인과 함께 진정한 한국 프리미엄 K-BBQ를 경험할 수 있습니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '을지로입구점 예약',
      }}
    />
  )
}
