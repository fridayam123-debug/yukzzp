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
  title: 'DDP 맛집 — 육즙관리소 더룸 을지로 동대문점',
  description: 'DDP(동대문디자인플라자) 근처 맛집. 동대문역사문화공원역 도보 3분. 산청 흑돼지 프리미엄 K-BBQ. 외국인 환영, 다국어 메뉴. 오전 11시~새벽 5시 운영.',
  alternates: { canonical: '/ddp-matjip' },
}

export default async function DdpMatjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'DDP · DONGDAEMUN · PREMIUM K-BBQ',
        h1: 'DDP 맛집\n육즙관리소 더룸 을지로 동대문점',
        description: 'DDP(동대문디자인플라자) 방문 후 즐기는 프리미엄 K-BBQ. 동대문역사문화공원역 도보 3분. DDP 전시·패션위크·행사 후 식사하기 좋은 위치. 산청 흑돼지, 전담 그릴링 서비스. 오전 11시~새벽 5시.',
        body: [
          'DDP(동대문디자인플라자)를 찾는 분들을 위한 프리미엄 K-BBQ 다이닝. 동대문역사문화공원역에서 도보 3분 거리로 DDP에서 이동이 매우 편리합니다. DDP 전시 관람, 패션위크, 각종 행사 후 이어지는 식사 자리로 최적의 선택입니다.',
          'DDP를 방문하는 외국인 관광객·바이어를 위한 영어·일어·중국어 다국어 메뉴와 전담 그릴링 서비스를 제공합니다. 4인부터 35인까지 수용 가능한 개별룸을 갖추고 있어 소규모 식사부터 단체 비즈니스 디너까지 가능합니다.',
          '오전 11시부터 새벽 5시까지 운영하여 야간 DDP 행사 후에도 방문하기 좋습니다. 굿모닝시티 지하주차장에서 1시간 무료 주차권을 제공합니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '더룸 을지로 동대문점 예약',
      }}
    />
  )
}
