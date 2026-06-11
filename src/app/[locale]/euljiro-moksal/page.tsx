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
  title: '을지로 목살 — 육즙관리소 산청 흑돼지 목살',
  description: '을지로 흑돼지 목살 맛집. 지리산 산청 흑돼지 목살, 특허 파동숙성, 100% 대나무 숯 직화. 을지로입구역 2번 출구 도보 2분. 정육왕 블라인드 테스트 1위.',
  alternates: { canonical: '/euljiro-moksal' },
}

export default async function EuljiroMoksalPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'EULJIRO · SANCHEONG BLACK PORK',
        h1: '을지로 목살\n산청 흑돼지 파동숙성',
        description: '을지로 최고의 흑돼지 목살. 지리산 산청 흑돼지 목살을 특허 파동숙성과 100% 대나무 숯 직화로 구워내는 을지로 프리미엄 목살 전문점. 정육왕 블라인드 테스트 밸런스 1위.',
        body: [
          '목살은 삼겹살보다 지방이 적고 씹는 맛이 강한 부위입니다. 육즙관리소의 산청 흑돼지 목살은 흑돼지 특유의 탄탄한 근섬유와 적당한 마블링이 절묘하게 조화를 이루어, 씹을수록 깊어지는 감칠맛이 특징입니다.',
          '특허 파동숙성 기술로 목살의 근섬유를 부드럽게 이완시켜 육즙 보존력을 높입니다. 100% 대나무 숯 직화의 강한 열로 마이야르 반응을 일으켜 겉면은 바삭하게, 속은 촉촉하게 구워냅니다. 전담 서버가 최적의 타이밍을 잡아 드립니다.',
          '정육왕 블라인드 테스트에서 한국 5대 프리미엄 돼지 중 밸런스 1위를 기록한 산청 흑돼지 목살. 을지로입구역 근처에서 이 맛을 경험해 보세요.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '을지로입구점 예약',
      }}
    />
  )
}
