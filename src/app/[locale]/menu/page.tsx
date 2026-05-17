import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

export const dynamic = 'force-dynamic'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MenuJsonLd } from '@/components/schema/MenuJsonLd'
import { getMenu } from '@/lib/fetchers/menu'
import { getLocations } from '@/lib/fetchers/locations'
import MenuClient from './menu-client'

export const metadata: Metadata = {
  title: '메뉴',
  description: '지리산 흑돼지 모듬 57,000원, 진꽃살 87,000원, 아보카도 육회 28,000원. 100% 대나무 숯 직화 · 직원 그릴링 무료.',
  alternates: { canonical: '/menu' },
  openGraph: {
    images: [{ url: '/photos/food/modeum-platter.png', width: 1200, height: 630, alt: '육즙관리소 지리산 숙성 흑돼지 모듬' }],
  },
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { categories, items } = await getMenu()
  const locations = await getLocations()
  return (
    <>
      <MenuJsonLd categories={categories} items={items} />
      <Header />
      <MenuClient categories={categories} items={items} />
      <Footer locations={locations} />
    </>
  )
}
