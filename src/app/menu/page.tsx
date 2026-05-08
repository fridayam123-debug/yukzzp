import type { Metadata } from 'next'

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
}

export default async function MenuPage() {
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
