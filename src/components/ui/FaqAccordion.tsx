'use client'

import { useState } from 'react'
import type { Faq } from '@/lib/fetchers/faqs'

export function FaqAccordion({ faqs, locale }: { faqs: Faq[]; locale: string }) {
  const [open, setOpen] = useState<string | null>(null)

  if (faqs.length === 0) return (
    <p className="text-[13px] text-[var(--color-body)] opacity-50 py-4">준비 중입니다.</p>
  )

  return (
    <div className="divide-y divide-[var(--color-hairline)]">
      {faqs.map((faq) => {
        const question = locale === 'en' && faq.question_en ? faq.question_en
          : locale === 'ja' && faq.question_ja ? faq.question_ja
          : locale === 'zh' && faq.question_zh_hans ? faq.question_zh_hans
          : locale === 'zh-TW' && faq.question_zh_hant ? faq.question_zh_hant
          : faq.question_ko
        const answer   = locale === 'en' && faq.answer_en ? faq.answer_en
          : locale === 'ja' && faq.answer_ja ? faq.answer_ja
          : locale === 'zh' && faq.answer_zh_hans ? faq.answer_zh_hans
          : locale === 'zh-TW' && faq.answer_zh_hant ? faq.answer_zh_hant
          : faq.answer_ko
        const isOpen   = open === faq.id

        return (
          <div key={faq.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between py-5 text-left gap-6 group"
            >
              <span className="text-[15px] leading-[1.5] text-[var(--color-ink)] font-normal [word-break:keep-all] group-hover:opacity-70 transition-opacity">
                {question}
              </span>
              <span className={`text-[18px] text-[var(--color-espresso)] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            {isOpen && (
              <div className="pb-6 text-[14px] leading-[1.85] text-[var(--color-body)] [word-break:keep-all]">
                {answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
