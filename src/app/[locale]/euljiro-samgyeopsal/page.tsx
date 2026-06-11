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
  title: '을지로 삼겹살 — 육즙관리소 산청 흑돼지 삼겹살',
  description: '을지로 삼겹살 맛집. 지리산 산청 흑돼지 삼겹살, 특허 파동숙성, 100% 대나무숯 직화. 동대문역사문화공원역 도보 3분. 오전 11시~새벽 5시 운영.',
  alternates: { canonical: '/euljiro-samgyeopsal' },
}

export default async function EuljiroSamgyeopsalPage({ params }: { params: Promise<{ locale: string }> }) {
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
        h1: '을지로 삼겹살\n산청 흑돼지 파동숙성',
        description: '을지로에서 만나는 프리미엄 흑돼지 삼겹살. 동대문역사문화공원역 도보 3분. 지리산 산청 흑돼지 삼겹살을 특허 파동숙성과 100% 대나무숯 직화로 구워내는 을지로 최고의 삼겹살 전문점. 오전 11시~새벽 5시.',
        body: [
          '을지로에서 흑돼지 삼겹살을 찾는다면 육즙관리소 더룸 을지로 동대문점이 정답입니다. 지리산 산청 흑돼지 삼겹살은 야생쑥을 먹고 자란 흑돼지 특유의 탄탄한 지방층과 윤기 있는 살코기 결이 특징입니다.',
          '특허 파동숙성 기술로 삼겹살 조직을 이완시켜 육즙이 구우는 과정에서 빠져나가지 않도록 합니다. 100% 대나무숯 직화의 고온으로 겉면은 바삭하게 카라멜화되고, 안은 촉촉한 육즙이 살아 있는 완벽한 삼겹살이 완성됩니다.',
          '오전 11시부터 새벽 5시까지 운영하여 DDP 전시·동대문 쇼핑 후에도 방문하기 좋습니다. 굿모닝시티 지하주차장에서 1시간 무료 주차권을 제공합니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '더룸 을지로 동대문점 예약',
      }}
    />
  )
}
