'use client'
import { useState } from 'react'
import type { Database } from '@/lib/supabase/types'

type Cat = Database['public']['Tables']['menu_categories']['Row']
type Item = Database['public']['Tables']['menu_items']['Row']

export default function MenuClient({ categories, items }: { categories: Cat[]; items: Item[] }) {
  const [activeCat, setActiveCat] = useState<string | null>(null)

  const visibleCategories = activeCat
    ? categories.filter(c => c.id === activeCat)
    : categories

  return (
    <main className="bg-[var(--color-canvas)] min-h-screen">
      {/* Page header */}
      <div className="border-b border-[var(--color-hairline)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-24 pt-16 pb-12">
          <div className="text-[11px] tracking-[3px] font-mono text-[var(--color-body)] uppercase">Menu</div>
          <h1 className="text-[48px] md:text-[64px] font-normal text-[var(--color-ink)] mt-2 tracking-[-0.02em] leading-[1]">
            전체 메뉴
          </h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-24 py-16 flex flex-col md:flex-row gap-12 md:gap-20">

        {/* Left — sticky category nav */}
        <aside className="shrink-0 md:w-44">
          <nav className="md:sticky md:top-28 flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveCat(null)}
              className={`whitespace-nowrap text-left text-[13px] py-2 md:border-l-2 border-b-2 md:border-b-0 px-4 transition-colors ${
                activeCat === null
                  ? 'border-[var(--color-espresso)] text-[var(--color-espresso)] font-semibold'
                  : 'border-transparent text-[var(--color-body)] hover:text-[var(--color-ink)]'
              }`}
            >
              전체
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`whitespace-nowrap text-left text-[13px] py-2 md:border-l-2 border-b-2 md:border-b-0 px-4 transition-colors ${
                  activeCat === cat.id
                    ? 'border-[var(--color-espresso)] text-[var(--color-espresso)] font-semibold'
                    : 'border-transparent text-[var(--color-body)] hover:text-[var(--color-ink)]'
                }`}
              >
                {cat.name_ko}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right — menu sections */}
        <div className="flex-1 min-w-0">
          {visibleCategories.map(cat => {
            const catItems = items.filter(i => i.category_id === cat.id)
            if (catItems.length === 0) return null
            return (
              <section key={cat.id} className="mb-20 last:mb-0">
                {/* Category header */}
                <div className="flex items-baseline gap-4 pb-4 mb-2 border-b-2 border-[var(--color-espresso)]">
                  <h2 className="text-[22px] font-semibold text-[var(--color-ink)]">{cat.name_ko}</h2>
                  <span className="text-[11px] font-mono tracking-[1.5px] text-[var(--color-body)] uppercase">{cat.name_en}</span>
                </div>

                {/* Items */}
                <ul>
                  {catItems.map(item => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-6 py-6 border-b border-[var(--color-hairline)] last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-[17px] font-medium text-[var(--color-ink)]">
                            {item.name_ko}
                          </span>
                          {item.weight_g && (
                            <span className="text-[11px] font-mono text-[var(--color-body)]">
                              {item.weight_g}g
                            </span>
                          )}
                          {item.is_signature && (
                            <span className="text-[9px] tracking-[2px] font-mono border border-[var(--color-brass)] text-[var(--color-brass)] px-2 py-0.5">
                              SIGNATURE
                            </span>
                          )}
                          {item.is_lunch_special && (
                            <span className="text-[9px] tracking-[1.5px] font-mono border border-[var(--color-forest-mid)] text-[var(--color-forest-mid)] px-2 py-0.5">
                              런치특선
                            </span>
                          )}
                        </div>
                        {item.description_ko && (
                          <p className="mt-1.5 text-[13px] text-[var(--color-body)] leading-[1.65] max-w-[520px]">
                            {item.description_ko}
                          </p>
                        )}
                      </div>

                      {item.price_krw != null && (
                        <div className="shrink-0 text-right">
                          <span className="text-[17px] font-mono text-[var(--color-ink)]">
                            {item.price_krw.toLocaleString()}
                            <span className="text-[13px]">원</span>
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}

          <p className="mt-16 pt-8 border-t border-[var(--color-hairline)] text-[12px] text-[var(--color-body)]">
            메뉴 항목과 가격은 각 매장의 사정에 따라 다를 수 있습니다.
          </p>
        </div>
      </div>
    </main>
  )
}
