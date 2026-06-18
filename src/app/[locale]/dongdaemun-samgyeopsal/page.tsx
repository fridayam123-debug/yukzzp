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
  title: '동대문 삼겹살 — 육즙관리소 산청 흑돼지 삼겹살',
  description: '동대문 삼겹살 맛집. 지리산 산청 흑돼지 삼겹살, 특허 파동숙성, 100% 대나무숯 직화. 동대문역사문화공원역 도보 3분. 오전 11시~새벽 5시 운영.',
  alternates: { canonical: '/dongdaemun-samgyeopsal' },
}

export default async function DongdaemunSamgyeopsalPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'DONGDAEMUN · SANCHEONG BLACK PORK',
        h1: '동대문 삼겹살\n산청 흑돼지 파동숙성',
        description: '동대문 프리미엄 흑돼지 삼겹살. 동대문역사문화공원역 도보 3분. 지리산 산청 흑돼지 삼겹살, 특허 파동숙성, 100% 대나무숯 직화. 이원일 셰프 추천. 오전 11시~새벽 5시.',
        body: [
          '동대문 근처에서 프리미엄 흑돼지 삼겹살을 찾는다면 육즙관리소 더룸 을지로 동대문점이 최선의 선택입니다. 동대문역사문화공원역에서 도보 3분으로 DDP·동대문시장에서 이동이 편리합니다.',
          '야생쑥을 먹고 자란 지리산 산청 흑돼지 삼겹살은 흑돼지 특유의 탄탄한 지방이 구워지면서 고소하고 달콤한 향을 냅니다. 특허 파동숙성과 100% 대나무숯 직화, 전담 그릴링 서비스의 조합으로 동대문 최고의 삼겹살을 경험해 보세요.',
          '오전 11시부터 새벽 5시까지 운영하여 야간 동대문 쇼핑 후에도 방문하기 좋습니다. 굿모닝시티 지하주차장에서 1시간 무료 주차권을 제공합니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1461-7228',
        telHref: 'tel:0507-1461-7228',
        ctaLabel: '더룸 을지로 동대문점 예약',
      }}
    />
  )
}
