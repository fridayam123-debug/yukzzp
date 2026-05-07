'use client'
import { useState } from 'react'
import type { Database } from '@/lib/supabase/types'

type Cat = Database['public']['Tables']['menu_categories']['Row']
type Item = Database['public']['Tables']['menu_items']['Row']

export default function MenuClient({ categories, items }: { categories: Cat[]; items: Item[] }) {
  const [lang, setLang] = useState<'ko' | 'en'>('ko')
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const filtered = activeCat ? items.filter(i => i.category_id === activeCat) : items

  return (
    <main className="px-6 md:px-24 py-12 max-w-[1440px] mx-auto">
      {/* Header row */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">MENU</div>
          <h1 className="text-[40px] font-normal mt-2 text-[var(--color-ink)]">
            {lang === 'ko' ? '전체 메뉴' : 'Full Menu'}
          </h1>
        </div>
        <div className="flex gap-3 text-[13px] font-mono">
          <button onClick={() => setLang('ko')} className={lang === 'ko' ? 'underline text-[var(--color-ink)]' : 'text-[var(--color-body)]'}>KO</button>
          <button onClick={() => setLang('en')} className={lang === 'en' ? 'underline text-[var(--color-ink)]' : 'text-[var(--color-body)]'}>EN</button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCat(null)}
          className={`px-4 py-1.5 rounded-full text-[13px] border ${activeCat === null ? 'bg-[var(--color-forest)] text-white border-[var(--color-forest)]' : 'border-[var(--color-hairline)] text-[var(--color-body)]'}`}
        >
          전체
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-4 py-1.5 rounded-full text-[13px] border ${activeCat === cat.id ? 'bg-[var(--color-forest)] text-white border-[var(--color-forest)]' : 'border-[var(--color-hairline)] text-[var(--color-body)]'}`}
          >
            {lang === 'ko' ? cat.name_ko : cat.name_en}
          </button>
        ))}
      </div>

      {/* Items grouped by category */}
      {categories
        .filter(cat => activeCat === null || activeCat === cat.id)
        .map(cat => {
          const catItems = items.filter(i => i.category_id === cat.id)
          if (catItems.length === 0) return null
          return (
            <section key={cat.id} className="mb-12">
              <h2 className="text-[22px] font-medium mb-4 text-[var(--color-ink)]">
                {lang === 'ko' ? cat.name_ko : cat.name_en}
              </h2>
              <ul className="divide-y divide-[var(--color-hairline)]">
                {catItems.map(item => (
                  <li key={item.id} className="py-4 flex justify-between items-baseline gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[16px] font-medium text-[var(--color-ink)]">
                          {lang === 'ko' ? item.name_ko : (item.name_en ?? item.name_ko)}
                        </span>
                        {item.is_signature && (
                          <span className="text-[10px] tracking-[1px] font-mono bg-[var(--color-cream-gold)]/30 text-[var(--color-forest)] px-2 py-0.5 rounded-full">SIGNATURE</span>
                        )}
                        {item.is_lunch_special && (
                          <span className="text-[10px] tracking-[1px] font-mono bg-[var(--color-forest-mid)]/10 text-[var(--color-forest-mid)] px-2 py-0.5 rounded-full">런치특선</span>
                        )}
                      </div>
                      {(lang === 'ko' ? item.description_ko : item.description_en) && (
                        <p className="text-[13px] text-[var(--color-body)] mt-1">
                          {lang === 'ko' ? item.description_ko : item.description_en}
                        </p>
                      )}
                      {item.weight_g && (
                        <p className="text-[11px] text-[var(--color-body)]/70 mt-0.5 font-mono">{item.weight_g}g</p>
                      )}
                    </div>
                    {item.price_krw && (
                      <span className="text-[15px] font-mono whitespace-nowrap text-[var(--color-ink)]">
                        {item.price_krw.toLocaleString()}원
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

      <p className="text-[12px] text-[var(--color-body)] mt-12 border-t border-[var(--color-hairline)] pt-6">
        메뉴 항목과 가격은 각 매장의 사정에 따라 다를 수 있습니다.
      </p>
    </main>
  )
}
