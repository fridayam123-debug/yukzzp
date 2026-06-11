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
  title: '동대문 목살 — 육즙관리소 산청 흑돼지 목살',
  description: '동대문 흑돼지 목살 맛집. 지리산 산청 흑돼지 목살, 특허 파동숙성, 100% 대나무숯 직화. 동대문역사문화공원역 도보 3분. 정육왕 블라인드 테스트 1위.',
  alternates: { canonical: '/dongdaemun-moksal' },
}

export default async function DongdaemunMoksalPage({ params }: { params: Promise<{ locale: string }> }) {
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
        h1: '동대문 목살\n산청 흑돼지 파동숙성',
        description: '동대문 프리미엄 흑돼지 목살. 동대문역사문화공원역 도보 3분. 지리산 산청 흑돼지 목살, 특허 파동숙성, 100% 대나무숯 직화. 정육왕 밸런스 1위. 오전 11시~새벽 5시.',
        body: [
          '동대문 근처에서 흑돼지 목살을 찾는다면 육즙관리소 더룸 을지로 동대문점을 방문해 보세요. 동대문역사문화공원역에서 도보 3분, DDP·동대문 쇼핑타운 바로 인근에 위치합니다.',
          '산청 흑돼지 목살은 삼겹살보다 지방이 적고 씹는 맛이 강한 부위입니다. 특허 파동숙성으로 목살 근섬유를 이완시켜 부드러우면서도 쫄깃함을 살리고, 100% 대나무숯 직화의 고온으로 겉면을 바삭하게 구워냅니다. 전담 서버가 최적의 굽기를 잡아 드립니다.',
          '정육왕 블라인드 테스트 밸런스 1위 산청 흑돼지 목살. 오전 11시부터 새벽 5시까지 운영하여 야간에도 방문하기 좋습니다. 굿모닝시티 지하주차장 이용 시 1시간 무료.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '더룸 을지로 동대문점 예약',
      }}
    />
  )
}
