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
  title: '동대문 회식 — 육즙관리소 단체석·프라이빗룸',
  description: '동대문 회식 장소 추천. 을지로입구역 2번 출구 도보 2분. 4~16인 프라이빗 룸, 단체석 운영. 하향식 덕트 연기 없는 쾌적한 환경. 외국인 다국어 서비스.',
  alternates: { canonical: '/dongdaemun-hoesik' },
}

export default async function DongdaemunHoesikPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'GROUP DINING · DONGDAEMUN · EULJIRO',
        h1: '동대문 회식\n프라이빗 룸 단체 다이닝',
        description: '동대문·을지로 인근 최고의 회식 장소. 을지로입구역 2번 출구 도보 2분. 4~16인 프라이빗 룸과 단체석 운영. 하향식 덕트로 연기 없는 쾌적한 환경, 전담 그릴링 서비스.',
        body: [
          '육즙관리소 을지로입구점은 동대문·을지로·명동 일대에서 가장 완성도 높은 회식 공간입니다. 부서 회식, 패션위크 업계 모임, 외국인 바이어 접대, 비즈니스 디너까지 모든 규모의 단체 모임을 위한 공간을 운영합니다.',
          '하향식 덕트 시스템으로 연기와 냄새를 완벽히 차단합니다. 동대문·을지로 비즈니스 거리에서 식사 후 중요한 미팅이나 행사가 있어도, 옷에 냄새가 배지 않아 걱정 없습니다. 전담 서버가 처음부터 끝까지 고기를 구워드려 자리에 앉은 모든 분들이 비즈니스와 대화에 집중할 수 있습니다.',
          '외국인 바이어나 관광객이 포함된 단체 모임을 위해 영어·일어·중국어 다국어 메뉴와 서비스를 완비하고 있습니다. 동대문 회식은 육즙관리소에서 해결하세요.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '단체 예약 문의',
      }}
    />
  )
}
