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
  title: 'DDP 맛집 — 육즙관리소 을지로입구역 K-BBQ',
  description: 'DDP(동대문디자인플라자) 근처 프리미엄 K-BBQ 맛집. 을지로입구역 2번 출구 도보 2분. 산청 흑돼지, 파동숙성, 대나무 숯 직화. 외국인 영어 서비스.',
  alternates: { canonical: '/ddp-matjip' },
}

export default async function DdpMatjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'DDP · EULJIRO · PREMIUM K-BBQ',
        h1: 'DDP 맛집\n육즙관리소 을지로입구점',
        description: 'DDP(동대문디자인플라자) 방문 후 즐기는 프리미엄 K-BBQ. 을지로입구역 2번 출구에서 도보 2분. 패션·디자인·문화의 거리 을지로에서 만나는 산청 흑돼지 프리미엄 다이닝.',
        body: [
          'DDP(동대문디자인플라자)와 을지로의 패션·문화 거리를 찾는 분들을 위한 프리미엄 K-BBQ 다이닝. 세계적인 건축물 DDP에서 도보로 가까운 거리에 위치한 육즙관리소 을지로입구점은, 크리에이티브한 공간과 함께 품격 있는 식사를 원하는 분들에게 최고의 선택입니다.',
          '패션 위크, 각종 전시, DDP 방문 일정에 맞춰 비즈니스 디너나 개인 식사 자리를 잡아보세요. 외국인 바이어·관광객을 위한 영어·일어·중국어 메뉴와 전담 그릴링 서비스로 언어 장벽 없는 최고의 K-BBQ를 경험하실 수 있습니다.',
          '특허 파동숙성과 100% 대나무 숯 직화로 완성한 산청 흑돼지의 깊은 맛. DDP 방문 후 꼭 들러야 할 을지로 필수 코스 맛집입니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '을지로입구점 예약',
      }}
    />
  )
}
