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
  title: '을지로 회식 — 육즙관리소 더룸 을지로 동대문점 단체석',
  description: '을지로 회식 장소 추천. 동대문역사문화공원역 도보 3분. 4·8·10·16·20·35인 개별룸 운영. 하향식 덕트 연기 없는 쾌적한 환경. 전담 그릴링 서비스.',
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
        eyebrow: 'GROUP DINING · EULJIRO · DONGDAEMUN',
        h1: '을지로 회식\n프라이빗 룸 단체 다이닝',
        description: '동대문역사문화공원역 도보 3분. 을지로·동대문 최고의 회식 장소. 4인, 8인, 10인, 16인, 20인, 35인 규모의 개별룸 운영. 하향식 덕트로 연기 냄새 없는 쾌적한 환경, 전담 그릴링 서비스.',
        body: [
          '육즙관리소 더룸 을지로 동대문점은 을지로·동대문 인근에서 가장 다양한 룸 구성을 갖춘 단체 다이닝 공간입니다. 4인, 8인, 10인, 16인, 20인, 35인 규모의 개별룸과 단체석을 운영해 소규모 팀 회식부터 대규모 부서 회식까지 모두 가능합니다.',
          '하향식 덕트 시스템으로 연기와 냄새를 완벽히 차단합니다. 을지로 비즈니스 거리에서 중요한 회식 후에도 옷에 냄새가 배지 않아 자리를 깔끔하게 마칠 수 있습니다. 전담 서버가 처음부터 끝까지 고기를 구워드려 참석자 모두가 대화와 비즈니스에 집중할 수 있습니다.',
          '해외 바이어·임원급 접대를 위한 영어·일어·중국어 다국어 메뉴와 서비스를 완비하고 있습니다. 오전 11시부터 새벽 5시까지 운영하여 늦은 회식도 편안하게 마무리할 수 있습니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1461-7228',
        telHref: 'tel:0507-1461-7228',
        ctaLabel: '단체 예약 문의',
      }}
    />
  )
}
