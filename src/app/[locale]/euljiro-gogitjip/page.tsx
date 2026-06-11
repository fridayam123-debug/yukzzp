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
  title: '을지로 고깃집 · 고기집 — 육즙관리소 더룸 을지로 동대문점',
  description: '을지로 고깃집 추천. 산청 흑돼지·거창 백돼지 프리미엄 고기집. 동대문역사문화공원역 도보 3분. 특허 파동숙성, 대나무숯 직화, 전담 그릴링 서비스.',
  alternates: { canonical: '/euljiro-gogitjip' },
}

export default async function EuljiroGogitjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'EULJIRO · DONGDAEMUN · PREMIUM PORK BBQ',
        h1: '을지로 고깃집\n육즙관리소 더룸 을지로 동대문점',
        description: '을지로 최고의 고깃집. 동대문역사문화공원역 도보 3분. 지리산 산청 흑돼지와 거창 백돼지 특화 프리미엄 고기 전문점. 특허 파동숙성, 100% 대나무숯 직화, 전담 그릴링 서비스. 오전 11시~새벽 5시.',
        body: [
          '을지로·동대문에서 제대로 된 고깃집을 찾는다면 육즙관리소 더룸 을지로 동대문점을 선택하세요. 단순히 고기를 파는 식당이 아니라, 프리미엄 원육 선별부터 숙성·직화·서비스까지 모든 과정을 설계한 고기 다이닝 공간입니다.',
          '지리산 산청 흑돼지와 거창 백돼지는 각각의 특성이 뚜렷합니다. 흑돼지는 깊은 감칠맛과 쫄깃한 육질, 백돼지는 섬세한 마블링과 부드러운 식감. 특허 파동숙성과 100% 대나무숯 직화로 두 품종의 매력을 모두 끌어냅니다.',
          '하향식 덕트 시스템으로 연기와 냄새를 차단하며, 오전 11시부터 새벽 5시까지 운영합니다. 굿모닝시티 지하주차장에서 1시간 무료 주차권을 제공하여 자가용 방문도 편리합니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '더룸 을지로 동대문점 예약',
      }}
    />
  )
}
