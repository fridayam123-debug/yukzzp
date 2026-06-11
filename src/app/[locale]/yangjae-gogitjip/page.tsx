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
  title: '양재역 고깃집 · 고기집 — 육즙관리소 프리미엄 K-BBQ',
  description: '양재역 고깃집 추천. 산청 흑돼지·거창 백돼지 특화 프리미엄 고기집. 양재역 1번 출구 도보 3분. 특허 파동숙성, 대나무 숯 직화, 전담 그릴링 서비스.',
  alternates: { canonical: '/yangjae-gogitjip' },
}

export default async function YangjaeGogitjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'YANGJAE · PREMIUM PORK BBQ',
        h1: '양재역 고깃집\n육즙관리소 프리미엄 K-BBQ',
        description: '양재역 최고의 고깃집. 지리산 산청 흑돼지와 거창 백돼지를 특허 파동숙성·100% 대나무 숯 직화로 구워내는 서울 프리미엄 고기 전문점. 양재역 1번 출구 도보 3분, 전담 서버 그릴링 서비스.',
        body: [
          '양재역 인근에서 흑돼지 고깃집을 찾는다면 육즙관리소가 정답입니다. 단순히 고기를 파는 식당이 아니라, 한 끼의 고기 다이닝을 하나의 완성된 경험으로 설계한 프리미엄 고기 전문점입니다.',
          '지리산 산청에서 야생쑥을 먹고 자란 흑돼지와 거창 백돼지는 각각의 특성이 뚜렷합니다. 흑돼지는 깊은 감칠맛과 쫄깃한 육질, 백돼지는 섬세한 마블링과 부드러운 식감이 특징입니다. 특허 파동숙성과 100% 대나무 숯 직화로 두 품종의 매력을 최대한 끌어냅니다.',
          '전담 서버가 처음부터 끝까지 고기를 직접 구워드립니다. 가장 맛있는 타이밍에 최적의 상태로 제공하는 그릴링 서비스가 육즙관리소를 단순한 고깃집이 아닌 다이닝으로 만드는 이유입니다.',
        ],
        locationSlug: 'yangjae',
        phone: '0507-1335-6363',
        telHref: 'tel:0507-1335-6363',
        ctaLabel: '양재역점 예약',
      }}
    />
  )
}
