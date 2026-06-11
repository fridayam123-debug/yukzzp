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
  title: '동대문 맛집 — 육즙관리소 더룸 을지로 동대문점',
  description: '동대문 맛집 추천. 동대문역사문화공원역 도보 3분. DDP·동대문쇼핑타운·청계천 인근 프리미엄 K-BBQ. 외국인 환영. 오전 11시~새벽 5시. 주차 1시간 무료.',
  alternates: { canonical: '/dongdaemun-matjip' },
}

export default async function DongdaemunMatjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'DONGDAEMUN · DDP · PREMIUM K-BBQ',
        h1: '동대문 맛집\n육즙관리소 더룸 을지로 동대문점',
        description: '동대문역사문화공원역 도보 3분. DDP·동대문 쇼핑타운·청계천 인근 프리미엄 K-BBQ 다이닝. 산청 흑돼지, 특허 파동숙성, 전담 그릴링 서비스. 오전 11시~새벽 5시, 굿모닝시티 주차 1시간 무료.',
        body: [
          '육즙관리소 더룸 을지로 동대문점은 동대문역사문화공원역에서 도보 3분 거리에 위치한 프리미엄 K-BBQ 다이닝입니다. DDP, 동대문 쇼핑타운, 청계천, 을지로 인근에서 접근성이 좋아 동대문 맛집을 찾는 고객들에게 추천됩니다.',
          '지리산 산청 흑돼지와 거창 백돼지를 특허 파동숙성·100% 대나무숯 직화로 제공합니다. 전문 서버가 직접 고기를 구워주는 K-BBQ 서비스로 외국인 관광객, 비즈니스 손님, 가족 모임 모두 편안하게 식사하실 수 있습니다.',
          '오전 11시부터 새벽 5시까지 운영하여 DDP 전시 관람이나 동대문 야간 쇼핑 후에도 방문하기 좋습니다. 굿모닝시티 지하주차장 이용 시 1시간 무료 주차권을 제공합니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '더룸 을지로 동대문점 예약',
      }}
    />
  )
}
