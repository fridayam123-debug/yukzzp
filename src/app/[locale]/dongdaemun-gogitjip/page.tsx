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
  title: '동대문 고깃집 · 고기집 — 육즙관리소 더룸 을지로 동대문점',
  description: '동대문 고깃집 추천. 산청 흑돼지·거창 백돼지 프리미엄 고기집. 동대문역사문화공원역 도보 3분. 4~35인 개별룸, 외국인 다국어 메뉴. 오전 11시~새벽 5시.',
  alternates: { canonical: '/dongdaemun-gogitjip' },
}

export default async function DongdaemunGogitjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'DONGDAEMUN · PREMIUM PORK BBQ',
        h1: '동대문 고깃집\n육즙관리소 더룸 을지로 동대문점',
        description: '동대문 최고의 고깃집. 동대문역사문화공원역 도보 3분. 지리산 산청 흑돼지와 거창 백돼지 프리미엄 고기 전문점. 4인~35인 개별룸, 외국인 관광객 다국어 메뉴. 오전 11시~새벽 5시.',
        body: [
          '동대문·을지로에서 제대로 된 고깃집을 찾는다면 육즙관리소 더룸 을지로 동대문점이 최선의 선택입니다. 동대문역사문화공원역에서 도보 3분, DDP·동대문 쇼핑타운 바로 인근에 위치합니다.',
          '지리산 산청 흑돼지와 거창 백돼지를 특허 파동숙성·100% 대나무숯 직화로 완성합니다. 4인, 8인, 10인, 16인, 20인, 35인 규모의 개별룸을 갖추고 있어 소규모 식사부터 단체 모임까지 모두 가능합니다.',
          '외국인 관광객을 위한 영어·일어·중국어 메뉴와 전담 그릴링 서비스를 제공합니다. 오전 11시부터 새벽 5시까지 운영하며 굿모닝시티 주차 1시간 무료.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1461-7228',
        telHref: 'tel:0507-1461-7228',
        ctaLabel: '더룸 을지로 동대문점 예약',
      }}
    />
  )
}
