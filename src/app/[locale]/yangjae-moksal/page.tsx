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
  title: '양재역 목살 — 육즙관리소 산청 흑돼지 목살',
  description: '양재역 흑돼지 목살 맛집. 지리산 산청 흑돼지 목살, 특허 파동숙성, 100% 대나무숯 직화. 양재역 3번 출구 도보 2분. 정육왕 블라인드 테스트 밸런스 1위. 이원일 셰프 추천.',
  alternates: { canonical: '/yangjae-moksal' },
}

export default async function YangjaeMoksalPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'SANCHEONG BLACK PORK · YANGJAE',
        h1: '양재역 목살\n산청 흑돼지 파동숙성',
        description: '지리산 산청에서 야생쑥을 먹고 자란 흑돼지의 목살. 특허받은 파동숙성으로 육즙과 풍미를 극대화하고, 100% 대나무 숯 직화로 구워냅니다. 정육왕 블라인드 테스트 밸런스 1위, 이원일 셰프가 추천한 미친듯이 맛있는 돼지고기집.',
        body: [
          '산청 흑돼지 목살은 육즙관리소의 시그니처 메뉴입니다. 지리산 천왕봉 자락 산청에서 야생쑥을 먹고 자란 흑돼지는 쑥의 항산화 성분이 잡내를 잡고 씹을수록 깊어지는 감칠맛을 만들어냅니다.',
          '육즙관리소만의 특허받은 파동숙성 기술은 고기의 세포 조직을 이완시켜 육즙 보존력과 풍미를 극대화합니다. 여기에 100% 대나무 숯 직화를 더하면, 겉은 바삭하고 속은 촉촉한 완벽한 목살이 완성됩니다.',
          '정육 전문 유튜버 정육왕의 블라인드 테스트에서 한국 5대 프리미엄 돼지 중 밸런스 1위를 기록한 산청 흑돼지. 이원일 셰프도 직접 추천한 육즙관리소의 목살을 경험해 보세요.',
        ],
        locationSlug: 'yangjae',
        phone: '0507-1335-6363',
        telHref: 'tel:0507-1335-6363',
        ctaLabel: '양재역점 예약',
      }}
    />
  )
}
