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
  title: '을지로 고깃집 · 고기집 — 육즙관리소 프리미엄 K-BBQ',
  description: '을지로 고깃집 추천. 산청 흑돼지·거창 백돼지 프리미엄 고기집. 을지로입구역 2번 출구 도보 2분. 특허 파동숙성, 대나무 숯 직화, 전담 그릴링 서비스.',
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
        eyebrow: 'EULJIRO · PREMIUM PORK BBQ',
        h1: '을지로 고깃집\n육즙관리소 프리미엄 K-BBQ',
        description: '을지로 최고의 고깃집. 지리산 산청 흑돼지와 거창 백돼지 특화 프리미엄 고기 전문점. 을지로입구역 2번 출구 도보 2분. 특허 파동숙성, 100% 대나무 숯 직화, 전담 그릴링 서비스.',
        body: [
          '을지로에서 제대로 된 고깃집을 찾는다면 육즙관리소 을지로입구점을 선택하세요. 일반적인 삼겹살집과는 다른, 프리미엄 원육 선별부터 숙성·직화·서비스까지 모든 과정을 설계한 고기 다이닝 공간입니다.',
          '지리산 산청 흑돼지는 야생쑥을 먹고 자라 쑥의 항산화 성분이 잡내를 없애고 깊은 감칠맛을 만들어냅니다. 거창 백돼지는 섬세한 마블링과 부드러운 식감으로 다른 매력을 선사합니다. 두 품종을 모두 특허 파동숙성·대나무 숯 직화로 완성합니다.',
          '하향식 덕트 시스템으로 연기와 냄새를 차단하여 을지로 비즈니스 거리에서 식사 후에도 깔끔하게 자리를 마칠 수 있습니다. 전담 서버의 그릴링 서비스로 최고의 타이밍에 고기를 드실 수 있습니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '을지로입구점 예약',
      }}
    />
  )
}
