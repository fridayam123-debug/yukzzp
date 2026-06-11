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
  title: '을지로 회식 — 육즙관리소 단체석·프라이빗룸',
  description: '을지로 회식 장소 추천. 을지로입구역 2번 출구 도보 2분. 4~16인 프라이빗 룸, 단체석 운영. 하향식 덕트 연기 없는 쾌적한 환경. 임원 만찬·비즈니스 접대.',
  alternates: { canonical: '/euljiro-hoesik' },
}

export default async function EuljiroHoesikPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'GROUP DINING · EULJIRO',
        h1: '을지로 회식\n프라이빗 룸 단체 다이닝',
        description: '을지로입구역 도보 2분. 을지로·명동·광화문 인근 최고의 회식 장소. 4~16인 프라이빗 룸과 단체석 운영. 하향식 덕트로 옷에 냄새가 배지 않는 쾌적한 환경에서 전담 그릴링 서비스와 함께 품격 있는 회식 자리를 만들어 드립니다.',
        body: [
          '육즙관리소 을지로입구점은 을지로·명동·광화문 인근에서 가장 완성도 높은 단체 다이닝 공간입니다. 부서 회식, 송년회·신년회, 임원 만찬, 비즈니스 접대, 외국인 바이어 접대까지 다양한 목적의 모임을 위한 공간을 운영합니다.',
          '하향식 덕트 시스템으로 연기와 냄새를 완벽히 차단하여 비즈니스 자리에서도 옷에 냄새가 배지 않는 쾌적한 환경을 제공합니다. 전담 서버가 직접 구워드리는 그릴링 서비스로, 참석자 모두가 대화와 비즈니스에만 집중하실 수 있습니다.',
          '외국인 바이어나 임원급 접대를 위한 영어·일어·중국어 다국어 메뉴와 서비스를 준비하고 있습니다. 산청 흑돼지와 거창 백돼지의 깊은 맛이 중요한 비즈니스 자리를 더욱 특별하게 만들어 드립니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '단체 예약 문의',
      }}
    />
  )
}
