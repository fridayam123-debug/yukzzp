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
  title: '을지로 맛집 — 육즙관리소 더룸 을지로 동대문점',
  description: '을지로 맛집 추천. 동대문역사문화공원역 도보 3분. 산청 흑돼지·거창 백돼지 프리미엄 K-BBQ. 오전 11시~새벽 5시 운영. 이원일 셰프 추천, 전담 그릴링 서비스.',
  alternates: { canonical: '/euljiro-matjip' },
}

export default async function EuljiroMatjipPage({ params }: { params: Promise<{ locale: string }> }) {
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
        eyebrow: 'EULJIRO · DONGDAEMUN · PREMIUM K-BBQ',
        h1: '을지로 맛집\n육즙관리소 더룸 을지로 동대문점',
        description: '동대문역사문화공원역 도보 3분. DDP·동대문·을지로·청계천 중심부에 위치한 프리미엄 K-BBQ 다이닝. 지리산 산청 흑돼지와 거창 백돼지, 특허 파동숙성, 100% 대나무숯 직화, 전담 그릴링 서비스. 오전 11시~새벽 5시.',
        body: [
          '육즙관리소 더룸 을지로 동대문점은 을지로·동대문을 함께 아우르는 프리미엄 K-BBQ 다이닝입니다. 세련된 공간, 4인부터 35인까지 수용 가능한 개별룸, 전문 서버 그릴링 서비스를 갖추고 있어 회식, 비즈니스 미팅, 접대, 데이트 장소로 모두 적합합니다.',
          '지리산 산청 흑돼지와 거창 백돼지를 특허 파동숙성으로 풍미를 끌어올리고, 100% 대나무숯 직화와 전담 그릴링 서비스로 가장 맛있는 타이밍에 제공합니다. 이원일 셰프가 직접 추천한 미친듯이 맛있는 돼지고기를 을지로에서 만나보세요.',
          '오전 11시부터 새벽 5시까지 운영해 DDP 행사, 동대문 쇼핑, 야간 모임 후에도 방문하기 좋습니다. 굿모닝시티 지하주차장 이용 시 1시간 무료 주차권을 제공합니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '더룸 을지로 동대문점 예약',
      }}
    />
  )
}
