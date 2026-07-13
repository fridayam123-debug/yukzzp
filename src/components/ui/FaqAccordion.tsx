import type { Faq } from '@/lib/fetchers/faqs'

export function FaqAccordion({ faqs, locale, idPrefix }: { faqs: Faq[]; locale: string; idPrefix?: string }) {
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

        return (
          <div key={faq.id} id={idPrefix ? `${idPrefix}-q${faq.id}` : undefined} className="scroll-mt-24 py-5">
            <h3 className="m-0 mb-3 text-[15px] font-normal leading-[1.5] text-[var(--color-ink)] [word-break:keep-all]">
              {isZh ? (
                <>
                  {faq.question_zh_hans && (
                    <span className="block">{faq.question_zh_hans}</span>
                  )}
                  {faq.question_zh_hant && (
                    <span className="block text-[13px] text-[var(--color-body)] mt-1">
                      {faq.question_zh_hant}
                    </span>
                  )}
                  {!faq.question_zh_hans && !faq.question_zh_hant && faq.question_ko}
                </>
              ) : question}
            </h3>

            <div className="faq-answer [word-break:keep-all]">
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
