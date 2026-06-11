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
  title: '양재역 삼겹살 — 육즙관리소 산청 흑돼지 삼겹살',
  description: '양재역 삼겹살 맛집. 지리산 산청 흑돼지 삼겹살, 특허 파동숙성, 100% 대나무 숯 직화. 정육왕 블라인드 테스트 1위. 이원일 셰프 추천. 양재역 1번 출구 도보 3분.',
  alternates: { canonical: '/yangjae-samgyeopsal' },
}

export default async function YangjaeSamgyeopsalPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'SANCHEONG BLACK PORK · SAMGYEOPSAL',
        h1: '양재역 삼겹살\n산청 흑돼지 파동숙성',
        description: '양재역에서 만나는 최고의 흑돼지 삼겹살. 지리산 산청 흑돼지 삼겹살을 특허 파동숙성과 100% 대나무 숯 직화로 구워냅니다. 정육왕 블라인드 테스트 밸런스 1위, 이원일 셰프 추천.',
        body: [
          '삼겹살은 부위 특성상 지방과 살코기의 비율이 중요합니다. 육즙관리소의 산청 흑돼지 삼겹살은 야생쑥을 먹고 자란 흑돼지 특유의 탄탄한 지방과 윤기 있는 살코기가 완벽한 비율로 구성되어 있습니다.',
          '특허받은 파동숙성 기술로 삼겹살의 세포 조직을 이완시켜 육즙 보존력을 극대화합니다. 100% 대나무 숯 직화로 구우면 겉면은 바삭하게 카라멜화되고, 안은 촉촉한 육즙이 살아 있는 완벽한 삼겹살이 완성됩니다.',
          '정육 전문 유튜버 정육왕의 블라인드 테스트에서 한국 5대 프리미엄 돼지 중 밸런스 1위. 이원일 셰프가 미친듯이 맛있다고 직접 추천한 삼겹살을 양재역에서 경험해 보세요.',
        ],
        locationSlug: 'yangjae',
        phone: '0507-1335-6363',
        telHref: 'tel:0507-1335-6363',
        ctaLabel: '양재역점 예약',
      }}
    />
  )
}
