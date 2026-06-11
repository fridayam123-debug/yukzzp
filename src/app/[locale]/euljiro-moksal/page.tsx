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
  description: '을지로 흑돼지 목살 맛집. 지리산 산청 흑돼지 목살, 특허 파동숙성, 100% 대나무숯 직화. 동대문역사문화공원역 도보 3분. 정육왕 블라인드 테스트 밸런스 1위.',
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
        description: '을지로 최고의 흑돼지 목살. 동대문역사문화공원역 도보 3분. 지리산 산청 흑돼지 목살, 특허 파동숙성, 100% 대나무숯 직화. 정육왕 블라인드 테스트 밸런스 1위. 오전 11시~새벽 5시.',
        body: [
          '을지로에서 흑돼지 목살을 찾는다면 육즙관리소 더룸 을지로 동대문점을 방문해 보세요. 동대문역사문화공원역에서 도보 3분 거리로 DDP·을지로·청계천에서 접근이 편리합니다.',
          '산청 흑돼지 목살은 흑돼지 특유의 단단한 근섬유가 씹을수록 깊은 감칠맛을 냅니다. 특허 파동숙성으로 목살 근섬유를 이완시켜 부드러우면서도 쫄깃함을 살려냅니다. 100% 대나무숯 직화의 고온으로 겉면을 바삭하게 구워 마이야르 반응을 극대화하고, 전담 서버가 최적의 굽기를 잡아 드립니다.',
          '정육왕 블라인드 테스트에서 밸런스 1위를 기록한 산청 흑돼지 목살. 오전 11시부터 새벽 5시까지 운영하여 야간에도 방문하기 좋습니다.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '더룸 을지로 동대문점 예약',
      }}
    />
  )
}
