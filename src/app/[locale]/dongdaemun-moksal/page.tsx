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
  description: '동대문 흑돼지 목살 맛집. 지리산 산청 흑돼지 목살, 특허 파동숙성, 100% 대나무 숯 직화. 을지로입구역 도보 2분. 정육왕 블라인드 테스트 밸런스 1위.',
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
        description: '동대문 근처 프리미엄 흑돼지 목살. 을지로입구역 도보 2분. 지리산 산청 흑돼지 목살, 특허 파동숙성, 100% 대나무 숯 직화. 정육왕 블라인드 테스트 밸런스 1위 원육.',
        body: [
          '동대문 근처에서 흑돼지 목살을 찾는다면 육즙관리소 을지로입구점을 방문해 보세요. 을지로입구역 2번 출구에서 도보 2분 거리로 동대문·DDP에서 접근이 편리합니다.',
          '산청 흑돼지 목살은 삼겹살과는 다른 매력을 지닌 부위입니다. 지방이 적고 씹는 맛이 강한 목살은, 흑돼지 특유의 단단한 근섬유가 씹을수록 깊은 감칠맛을 내뿜습니다. 특허 파동숙성으로 목살의 근섬유를 이완시켜 부드럽게 만들면서도 쫄깃함을 살려냅니다.',
          '100% 대나무 숯 직화의 고온으로 목살 겉면을 바삭하게 구워 마이야르 반응을 극대화하고, 전담 서버가 최적의 굽기를 잡아 드립니다. 동대문에서 흑돼지 목살의 진미를 경험해 보세요.',
        ],
        locationSlug: 'euljiro',
        phone: '0507-1335-7474',
        telHref: 'tel:0507-1335-7474',
        ctaLabel: '을지로입구점 예약',
      }}
    />
  )
}
