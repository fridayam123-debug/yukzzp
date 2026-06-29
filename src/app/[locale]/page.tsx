import type { Metadata } from 'next'
import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { getLocations } from '@/lib/fetchers/locations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrganizationJsonLd } from '@/components/schema/OrganizationJsonLd'
import { WebsiteJsonLd } from '@/components/schema/WebsiteJsonLd'
import { RestaurantJsonLd } from '@/components/schema/RestaurantJsonLd'
import { Hero } from '@/components/sections/Hero'
import { AuthorityBanner } from '@/components/sections/AuthorityBanner'
import { BrandStory } from '@/components/sections/BrandStory'
import { WhySignature } from '@/components/sections/WhySignature'
import { TwoLocations } from '@/components/sections/TwoLocations'
import { GroupCTA } from '@/components/sections/GroupCTA'
import { ReservationCTA } from '@/components/sections/ReservationCTA'
import { InteriorBanner } from '@/components/sections/InteriorBanner'
import { ReviewStrip } from '@/components/sections/ReviewStrip'
import { InstagramStrip } from '@/components/sections/InstagramStrip'
import { SancheonSection } from '@/components/sections/SancheonSection'
import { LazySection } from '@/components/ui/LazySection'

export const revalidate = 300

const BASE_URL = 'https://www.yukjeup.com'

const META: Record<string, { title: string; description: string; keywords: string; ogTitle: string; ogDescription: string }> = {
  ko: {
    title: '육즙관리소 공식 홈페이지 | 양재역본점·을지로동대문점',
    description: '육즙관리소 공식 홈페이지. 양재역·을지로 산청 흑돼지 전문 K-BBQ 다이닝.',
    keywords: '육즙관리소, 육즙관리소 공식 홈페이지, 서울 단체 회식, 강남 프라이빗 룸, 을지로 단체석, 회식 장소 추천, 비즈니스 미팅 레스토랑, 외국인 접대 K-BBQ, 송년회 장소, 양재역 맛집, 산청 흑돼지',
    ogTitle: '육즙관리소 공식 홈페이지 | 양재역본점·을지로동대문점',
    ogDescription: '육즙관리소 공식 홈페이지. 양재역·을지로 산청 흑돼지 전문 K-BBQ 다이닝.',
  },
  en: {
    title: 'Yukzzp | Premium K-BBQ Dining Seoul · Yangjae · Euljiro',
    description: 'Chef-endorsed premium Korean BBQ dining in Seoul. Sancheon black pork, bamboo charcoal grill, private rooms for 4–16, group seating for 20–40. Corporate dinners, business meetings & foreign guest entertainment.',
    keywords: 'Korean BBQ Seoul, K-BBQ private room, Seoul group dining, Yangjae restaurant, Euljiro BBQ, Korean pork Seoul',
    ogTitle: 'Yukzzp | Premium K-BBQ Seoul',
    ogDescription: 'Premium K-BBQ dining in Seoul. Private rooms 4–16, group seating 20–40, dedicated grilling service.',
  },
  ja: {
    title: '육즙관리소 | ソウルプレミアムK-BBQダイニング · 良才駅 · 乙支路',
    description: 'シェフ推薦ソウルのプレミアムK-BBQダイニング。山清黒豚·巨昌白豚、竹炭直火グリル。4〜16名プライベートルーム、20〜40名団体席。歓送迎会・ビジネスディナー・外国人接待。良才駅本店・乙支路東大門店。',
    keywords: 'ソウル焼肉, K-BBQ, 韓国料理 ソウル, プライベートルーム, 宴会, 韓国黒豚, 良才駅グルメ',
    ogTitle: '육즙관리소 | ソウルプレミアムK-BBQ',
    ogDescription: 'ソウル良才駅・乙支路のプレミアムK-BBQダイニング。4〜16名個室、20〜40名団体席、専任グリルサービス。',
  },
  vi: {
    title: 'Yukzzp | Nhà hàng K-BBQ cao cấp Seoul · Yangjae · Euljiro',
    description: 'Nhà hàng K-BBQ cao cấp được đầu bếp nổi tiếng giới thiệu tại Seoul. Thịt heo đen Sancheon, nướng than tre, phòng riêng 4–16 người, chỗ ngồi nhóm 20–40 người. Tiệc công ty, họp kinh doanh, tiếp khách nước ngoài.',
    keywords: 'BBQ Hàn Quốc Seoul, nhà hàng Seoul, K-BBQ, phòng riêng Seoul, tiệc nhóm Seoul',
    ogTitle: 'Yukzzp | K-BBQ cao cấp Seoul',
    ogDescription: 'Nhà hàng K-BBQ cao cấp Seoul. Phòng riêng 4–16 người, 20–40 người, dịch vụ nướng chuyên nghiệp.',
  },
  zh: {
    title: '육즙관리소 | 首尔高端K-BBQ餐厅 · 梁才站 · 乙支路',
    description: '首尔高端韩式烤肉餐厅，著名厨师推荐。山清黑猪·居昌白猪，100%竹炭直火。4~16人私人包厢，20~40人团餐座位。公司聚餐·年终宴·商务会谈·外国客人接待。梁才站本店·乙支路东大门店。',
    keywords: '首尔烤肉, 韩式烤肉, 首尔团餐, 私人包厢首尔, 商务宴请, 外国客人接待, 梁才站美食',
    ogTitle: '육즙관리소 | 首尔高端K-BBQ',
    ogDescription: '首尔梁才站·乙支路高端K-BBQ餐厅。4~16人私人包厢，20~40人团餐座位，专属桌边烤肉服务。',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META.ko

  return {
    title: { absolute: m.title },
    description: m.description,
    keywords: m.keywords,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: locale === 'ko' ? `${BASE_URL}/` : `${BASE_URL}/${locale}`,
      siteName: '육즙관리소',
      type: 'website',
      images: [
        {
          url: '/photos/brand/brand-story.jpg',
          width: 1200,
          height: 630,
          alt: '육즙관리소 — 산청 흑돼지 프리미엄 다이닝',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.ogTitle,
      description: m.ogDescription,
      images: ['/photos/brand/brand-story.jpg'],
    },
    alternates: {
      canonical: locale === 'ko' ? `${BASE_URL}/` : `${BASE_URL}/${locale}`,
      languages: {
        ko: BASE_URL,
        en: `${BASE_URL}/en`,
        ja: `${BASE_URL}/ja`,
        vi: `${BASE_URL}/vi`,
        zh: `${BASE_URL}/zh`,
        'x-default': BASE_URL,
      },
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const locations = await getLocations()
  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      {locations.map((loc) => (
        <RestaurantJsonLd key={loc.slug} location={loc} />
      ))}
      <Header transparent />
      <main>
        {/* 1. Hero */}
        <Suspense fallback={<div className="h-[85vh] md:min-h-screen bg-[var(--color-stone)]" />}><Hero /></Suspense>
        {/* 2. 셰프 추천 영상 */}
        <Suspense fallback={null}><AuthorityBanner /></Suspense>
        {/* 3. 왜 산청 흑돼지인가 영상 */}
        <Suspense fallback={null}><SancheonSection /></Suspense>
        {/* 4. 인스타그램 릴스 */}
        <LazySection minH="560px"><InstagramStrip /></LazySection>
        {/* 5. 네가지 약속 + 시그니처 */}
        <Suspense fallback={null}><WhySignature /></Suspense>
        {/* 6. 로케이션 */}
        <TwoLocations locations={locations} />
        {/* 7. 단체 */}
        <LazySection minH="640px"><GroupCTA /></LazySection>
        {/* 8. 인테리어 배너 */}
        <InteriorBanner />
        {/* 9. 브랜드 스토리 */}
        <Suspense fallback={null}><BrandStory /></Suspense>
        {/* 10. 예약 CTA */}
        <ReservationCTA locations={locations} />
        {/* 11. 리뷰 */}
        <LazySection minH="800px"><ReviewStrip /></LazySection>
      </main>
      <Footer locations={locations} />
    </>
  )
}
