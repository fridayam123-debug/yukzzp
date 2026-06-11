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
        const isZh = locale === 'zh'

        const question = isZh
          ? null
          : locale === 'en' && faq.question_en ? faq.question_en
          : locale === 'ja' && faq.question_ja ? faq.question_ja
          : locale === 'vi' && faq.question_vi ? faq.question_vi
          : faq.question_ko

        const answer = isZh
          ? null
          : locale === 'en' && faq.answer_en ? faq.answer_en
          : locale === 'ja' && faq.answer_ja ? faq.answer_ja
          : locale === 'vi' && faq.answer_vi ? faq.answer_vi
          : faq.answer_ko

        const isOpen = open === faq.id

        return (
          <div key={faq.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between py-5 text-left gap-6 group"
            >
              <div className="flex-1 min-w-0">
                {isZh ? (
                  <div className="space-y-1">
                    {faq.question_zh_hans && (
                      <p className="text-[15px] leading-[1.5] text-[var(--color-ink)] font-normal [word-break:keep-all] group-hover:opacity-70 transition-opacity">
                        {faq.question_zh_hans}
                      </p>
                    )}
                    {faq.question_zh_hant && (
                      <p className="text-[13px] leading-[1.5] text-[var(--color-body)] font-normal [word-break:keep-all] group-hover:opacity-70 transition-opacity">
                        {faq.question_zh_hant}
                      </p>
                    )}
                    {!faq.question_zh_hans && !faq.question_zh_hant && (
                      <p className="text-[15px] leading-[1.5] text-[var(--color-ink)] font-normal [word-break:keep-all]">
                        {faq.question_ko}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-[15px] leading-[1.5] text-[var(--color-ink)] font-normal [word-break:keep-all] group-hover:opacity-70 transition-opacity">
                    {question}
                  </span>
                )}
              </div>
              <span className={`text-[18px] text-[var(--color-espresso)] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>

            {/* 답변: 항상 DOM에 존재 (크롤러 접근 가능) — CSS로만 접기 */}
            <div
              className={`[word-break:keep-all] overflow-hidden transition-[max-height,padding] duration-300 ease-in-out ${
                isOpen ? 'max-h-[2000px] pb-6' : 'max-h-0'
              }`}
              aria-hidden={!isOpen}
            >
              {isZh ? (
                <div className="space-y-4">
                  {faq.answer_zh_hans && (
                    <p className="text-[14px] leading-[1.85] text-[var(--color-body)]">
                      {faq.answer_zh_hans}
                    </p>
                  )}
                  {faq.answer_zh_hant && (
                    <p className="text-[13px] leading-[1.85] text-[var(--color-body)] opacity-75 border-t border-[var(--color-hairline)] pt-4">
                      {faq.answer_zh_hant}
                    </p>
                  )}
                  {!faq.answer_zh_hans && !faq.answer_zh_hant && (
                    <p className="text-[14px] leading-[1.85] text-[var(--color-body)]">
                      {faq.answer_ko}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[14px] leading-[1.85] text-[var(--color-body)]">
                  {answer}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
