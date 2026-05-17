'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Database } from '@/lib/supabase/types'

type Cat = Database['public']['Tables']['menu_categories']['Row']
type Item = Database['public']['Tables']['menu_items']['Row']

export default function MenuClient({ categories, items }: { categories: Cat[]; items: Item[] }) {
  const t = useTranslations('menu')
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const visibleItems = activeCat
    ? items.filter(i => i.category_id === activeCat)
    : items

  return (
    <main className="bg-[var(--color-canvas)] min-h-screen">
      {/* Page header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 pt-16 pb-8">
        <h1 className="text-[40px] md:text-[52px] font-semibold text-[var(--color-ink)] tracking-[-0.02em]">
          {t('title')}
        </h1>
        <p className="mt-2 text-[14px] text-[var(--color-body)]">
          {items.length}{t('subtitleSuffix')}
        </p>
      </div>

      {/* Category filter pills */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 pb-10">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setActiveCat(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
              activeCat === null
                ? 'bg-[#1c1c14] text-white'
                : 'bg-white text-[var(--color-body)] border border-[var(--color-hairline)] hover:border-[var(--color-ink)]'
            }`}
          >
            {t('all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                activeCat === cat.id
                  ? 'bg-[#1c1c14] text-white'
                  : 'bg-white text-[var(--color-body)] border border-[var(--color-hairline)] hover:border-[var(--color-ink)]'
              }`}
            >
              {cat.name_ko}
            </button>
          ))}
        </div>
      </div>

      {/* Photo card grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {visibleItems.map(item => (
            <div key={item.id} className="flex flex-col">
              {/* Photo */}
              <div className="relative w-full aspect-[4/3] bg-[var(--color-canvas-soft)] overflow-hidden rounded-[4px]">
                {item.photo_url ? (
                  <Image
                    src={item.photo_url}
                    alt={item.name_ko}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[40px] leading-none select-none opacity-20">肉</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="pt-3">
                {item.is_signature && (
                  <span className="inline-block text-[10px] tracking-[1px] font-semibold bg-[#3a4820] text-white px-2 py-[3px] rounded-[3px] mb-2">
                    {t('signatureBadge')}
                  </span>
                )}
                <h3 className="text-[15px] font-semibold text-[var(--color-ink)] leading-[1.35] break-keep">
                  {item.name_ko}
                </h3>
                {item.description_ko && (
                  <p className="mt-1 text-[12px] text-[var(--color-body)] leading-[1.65] line-clamp-2">
                    {item.description_ko}
                  </p>
                )}
                {item.price_krw != null && (
                  <p className="mt-2 text-[14px] font-semibold text-[#c49128]">
                    {item.price_krw.toLocaleString()}{t('priceUnit')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
