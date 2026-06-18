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
  title: '양재역 맛집 — 육즙관리소 양재역점 프리미엄 K-BBQ',
  description: '양재역 근처 프리미엄 흑돼지 맛집. 산청 흑돼지·거창 백돼지, 특허 파동숙성, 전담 그릴링 서비스. 양재역 3번 출구 도보 약 2~3분. 이원일 셰프 추천 K-BBQ 다이닝.',
  alternates: { canonical: '/yangjae-matjip' },
}

export default async function YangjaeMatjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'YANGJAE · PREMIUM K-BBQ',
        h1: '양재역 맛집\n육즙관리소 프리미엄 K-BBQ',
        description: '양재역 3번 출구 도보 약 2~3분. 지리산 산청 흑돼지와 거창 백돼지를 특허 파동숙성과 100% 대나무숯 직화로 제공하는 서울 프리미엄 K-BBQ 다이닝. 이원일 셰프가 직접 추천한 미친듯이 맛있는 돼지고기집.',
        body: [
          '육즙관리소 양재역점은 양재역 3번 출구에서 도보 약 2~3분 거리에 위치한 프리미엄 K-BBQ 다이닝입니다. 패션 디자이너 출신 대표가 직접 설계한 공간과 서비스 동선으로, 한 끼의 식사가 하나의 완성된 경험이 됩니다.',
          '야생쑥을 먹고 자란 지리산 산청 흑돼지는 깊은 감칠맛과 쫄깃한 육질이 특징입니다. 특허받은 파동숙성으로 육즙을 최대한 살려 구워내며, 100% 대나무숯 직화와 전담 서버의 그릴링 서비스로 가장 맛있는 타이밍에 제공합니다.',
          '양재역 맛집을 찾는다면 육즙관리소를 선택하세요. 회식, 데이트, 가족 모임, 비즈니스 접대까지 — 격은 있되 부담 없는 자리를 만들어 드립니다.',
        ],
        locationSlug: 'yangjae',
        phone: '0507-1335-6363',
        telHref: 'tel:0507-1335-6363',
        ctaLabel: '양재역점 예약',
      }}
    />
  )
}
