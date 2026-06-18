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
  title: '동대문 회식 — 육즙관리소 더룸 을지로 동대문점 단체석',
  description: '동대문 회식 장소 추천. 동대문역사문화공원역 도보 3분. 4·8·10·16·20·35인 개별룸 운영. 하향식 덕트 연기 없는 환경. 외국인 다국어 서비스.',
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
        eyebrow: 'GROUP DINING · DONGDAEMUN',
        h1: '동대문 회식\n프라이빗 룸 단체 다이닝',
        description: '동대문역사문화공원역 도보 3분. 동대문·을지로 최고의 회식 장소. 4인, 8인, 10인, 16인, 20인, 35인 규모 개별룸 운영. 하향식 덕트, 전담 그릴링 서비스. 외국인 바이어 다국어 지원.',
        body: [
          '육즙관리소 더룸 을지로 동대문점은 동대문·을지로 일대에서 가장 다양한 룸 구성을 갖춘 회식 전문 공간입니다. 4인, 8인, 10인, 16인, 20인, 35인 규모의 개별룸을 운영해 소규모 팀 회식부터 대규모 부서 회식·임원 만찬까지 모두 가능합니다.',
          '하향식 덕트 시스템으로 연기와 냄새를 완벽히 차단합니다. 전담 서버가 직접 고기를 구워드려 참석자 모두가 대화와 비즈니스에만 집중할 수 있습니다. 해외 바이어 접대를 위한 영어·일어·중국어 다국어 메뉴와 서비스도 완비하고 있습니다.',
          '오전 11시부터 새벽 5시까지 운영하여 야간 회식도 편안하게 마무리할 수 있습니다. 굿모닝시티 지하주차장에서 1시간 무료 주차권을 제공합니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1461-7228',
        telHref: 'tel:0507-1461-7228',
        ctaLabel: '단체 예약 문의',
      }}
    />
  )
}
