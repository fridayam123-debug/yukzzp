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
  title: '양재역 회식 — 육즙관리소 단체석·프라이빗룸',
  description: '양재역 회식 장소 추천. 8인·10인·20인·40인 프라이빗 룸·단체석 운영. 하향식 덕트로 연기 없는 쾌적한 환경. 양재역 3번 출구 도보 2분.',
  alternates: { canonical: '/yangjae-hoesik' },
}

export default async function YangjaeHoesikPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [locations, faqs] = await Promise.all([
    getLocations(),
    getFaqs('yangjae'),
  ])
  return (
    <SeoLandingPage
      locale={locale}
      locations={locations}
      faqs={faqs}
      meta={{
        eyebrow: 'GROUP DINING · YANGJAE',
        h1: '양재역 회식\n프라이빗 룸 단체 다이닝',
        description: '양재역 최고의 회식 장소. 8인·10인·20인·40인 규모의 프라이빗 룸과 단체석을 운영합니다. 하향식 덕트 시스템으로 옷에 냄새와 연기가 배지 않는 쾌적한 환경에서, 전담 서버의 그릴링 서비스와 함께 품격 있는 회식 자리를 만들어 드립니다. 양재역 3번 출구 도보 2분.',
        body: [
          '육즙관리소 양재역점은 양재역 3번 출구에서 도보 2분 거리에 위치한 단체 다이닝 공간입니다. 부서 회식, 송년회·신년회, 임원 만찬, 비즈니스 디너까지 다양한 규모의 단체 모임을 위한 공간을 운영합니다.',
          '8인, 10인, 20인, 40인 규모에 맞는 프라이빗 룸과 단체석을 갖추고 있어 소규모 팀 회식부터 대규모 부서 회식까지 모두 가능합니다. 하향식 덕트 시스템으로 연기와 냄새를 완벽히 차단하여 옷에 냄새가 배지 않는 쾌적한 환경을 제공합니다.',
          '전담 서버가 직접 구워드리는 그릴링 서비스로, 자리에 앉은 모든 분들이 대화에만 집중하실 수 있습니다. 산청 흑돼지와 거창 백돼지의 깊은 맛이 회식 자리를 더욱 특별하게 만들어 드립니다.',
        ],
        locationSlug: 'yangjae',
        phone: '0507-1335-6363',
        telHref: 'tel:0507-1335-6363',
        ctaLabel: '단체 예약 문의',
      }}
    />
  )
}
