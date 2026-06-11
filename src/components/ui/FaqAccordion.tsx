/**
 * FaqAccordion — 순수 서버 컴포넌트 (no 'use client')
 *
 * <details>/<summary> 네이티브 HTML 사용:
 *  - 답변 텍스트가 JavaScript 실행 여부와 무관하게 초기 HTML에 항상 포함
 *  - aria-hidden 없음 → 크롤러가 모든 답변 텍스트를 읽을 수 있음
 *  - 접힘/펼침 상태는 CSS group-open: variant로 제어
 */

import type { Faq } from '@/lib/fetchers/faqs'

export function FaqAccordion({ faqs, locale }: { faqs: Faq[]; locale: string }) {
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
          /**
           * <details>: 열림/닫힘은 브라우저가 관리 (open 어트리뷰트)
           * 중요: 내부 콘텐츠는 닫힌 상태에서도 HTML 소스에 항상 존재
           */
          <details key={faq.id} className="group">
            {/* summary: 질문 헤딩 + 토글 아이콘 */}
            <summary className="flex items-center justify-between py-5 gap-6 cursor-pointer [list-style:none] [&::-webkit-details-marker]:hidden hover:opacity-70 transition-opacity">
              <h3 className="flex-1 m-0 text-[15px] font-normal leading-[1.5] text-[var(--color-ink)] [word-break:keep-all]">
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
              {/* 아이콘: details[open]이면 45도 회전 */}
              <span
                aria-hidden="true"
                className="text-[18px] text-[var(--color-espresso)] transition-transform duration-200 flex-shrink-0 group-open:rotate-45"
              >
                +
              </span>
            </summary>

            {/*
              답변: <details> 특성상 HTML 소스에 항상 포함됨.
              닫힌 상태에서 브라우저가 시각적으로 숨기지만,
              view-source / 크롤러는 이 텍스트를 읽을 수 있음.
            */}
            <div className="faq-answer pb-6 [word-break:keep-all]">
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
          </details>
        )
      })}
    </div>
  )
}
