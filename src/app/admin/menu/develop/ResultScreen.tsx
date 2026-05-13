'use client'
import { useState } from 'react'
import { BrandChangeModal } from './BrandChangeModal'
import type { Recipe, Ingredient, IngredientCategory } from './types'

const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  main: 'bg-red-500',
  seasoning: 'bg-yellow-400',
  aromatic: 'bg-orange-400',
  garnish: 'bg-gray-400',
  sauce: 'bg-amber-700',
  starch: 'bg-amber-100',
}

const DIFFICULTY_LABEL = { easy: '쉬움', medium: '보통', hard: '어려움' }

interface Props {
  recipe: Recipe
  onReset: () => void
}

export function ResultScreen({ recipe, onReset }: Props) {
  const [brandModal, setBrandModal] = useState<Ingredient | null>(null)

  return (
    <>
      <div className="max-w-[800px] p-8 print:p-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8 print:mb-4">
          <button
            onClick={onReset}
            className="text-[13px] text-[var(--color-body)] hover:text-[var(--color-ink)] print:hidden"
          >
            ← 다른 사진
          </button>
          <div className="flex items-center gap-3 print:hidden">
            <span className="text-[12px] text-[var(--color-body)] bg-[var(--color-surface)] px-3 py-1 rounded-full">
              ✓ 분석 완료
            </span>
            <button
              onClick={() => window.print()}
              className="text-[13px] text-[var(--color-body)] hover:text-[var(--color-ink)] border border-[var(--color-hairline)] px-4 py-2 rounded-[8px]"
            >
              인쇄
            </button>
          </div>
        </div>

        {/* 음식명 */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-[var(--color-body)] uppercase tracking-widest mb-2">
            분석된 음식
          </p>
          <h1 className="text-[28px] font-semibold text-[var(--color-ink)] tracking-tight leading-tight">
            {recipe.name}
          </h1>
          <p className="text-[14px] text-[var(--color-body)] mt-3 leading-relaxed">{recipe.description}</p>
          <div className="flex gap-4 mt-4 text-[12px] text-[var(--color-body)]">
            <span>준비 {recipe.prep_time_min}분</span>
            <span>조리 {recipe.cook_time_min}분</span>
            <span>난이도 {DIFFICULTY_LABEL[recipe.difficulty]}</span>
          </div>
        </div>

        {/* 장비 */}
        {recipe.equipment.length > 0 && (
          <div className="mb-8 p-5 bg-[var(--color-surface)] rounded-[12px]">
            <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-3">장비</p>
            <div className="flex flex-wrap gap-3">
              {recipe.equipment.map((eq, i) => (
                <span key={i} className="text-[13px] text-[var(--color-ink)]">
                  {eq.name} {eq.quantity}개{eq.note ? ` (${eq.note})` : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 재료 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[15px] font-semibold text-[var(--color-ink)]">재료 & 계량</p>
            <span className="text-[12px] text-[var(--color-body)] bg-[var(--color-surface)] px-3 py-1 rounded-full">
              {recipe.servings}인분 기준
            </span>
          </div>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-4 bg-white border border-[var(--color-hairline)] rounded-[10px]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${CATEGORY_COLORS[ing.category]}`}
                  />
                  <div>
                    <p className="text-[14px] font-medium text-[var(--color-ink)]">
                      {ing.name}
                      {ing.prep_form && (
                        <span className="ml-1 text-[12px] font-normal text-[var(--color-body)]">
                          ({ing.prep_form})
                        </span>
                      )}
                      <span className="ml-2 text-[13px] font-normal text-[var(--color-body)]">
                        {ing.amount}
                        {ing.unit}
                      </span>
                    </p>
                    {ing.brand && (
                      <p className="text-[12px] text-[var(--color-body)] mt-0.5">
                        <span
                          className={`mr-1.5 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            ing.brand_source === 'profile'
                              ? 'bg-green-100 text-green-700'
                              : ing.brand_source === 'catalog'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {ing.brand_source === 'profile'
                            ? '거래처'
                            : ing.brand_source === 'catalog'
                            ? '카탈로그'
                            : '추천'}
                        </span>
                        {ing.brand} {ing.product}
                      </p>
                    )}
                    {ing.note && (
                      <p className="text-[11px] text-[var(--color-body)] mt-0.5">{ing.note}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setBrandModal(ing)}
                  className="text-[11px] text-[var(--color-body)] hover:text-[var(--color-ink)] border border-[var(--color-hairline)] px-2 py-1 rounded-[6px] shrink-0 print:hidden"
                >
                  브랜드 지정
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 조리 프로세스 */}
        <div className="mb-8">
          <p className="text-[15px] font-semibold text-[var(--color-ink)] mb-4">조리 프로세스</p>
          <div className="space-y-4">
            {recipe.steps.map((step) => (
              <div key={step.order} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-[var(--color-espresso)] flex items-center justify-center shrink-0 text-[13px] font-semibold text-[var(--color-espresso)]">
                  {step.order}
                </div>
                <div className="flex-1 pb-4 border-b border-[var(--color-hairline)] last:border-0">
                  <p className="text-[14px] font-semibold text-[var(--color-ink)] mb-1">{step.title}</p>
                  <p className="text-[13px] text-[var(--color-body)] leading-relaxed">{step.instruction}</p>
                  {step.sensory_cues && step.sensory_cues.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {step.sensory_cues.map((cue, j) => (
                        <span
                          key={j}
                          className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded"
                        >
                          {cue}
                        </span>
                      ))}
                    </div>
                  )}
                  {(step.duration_sec || step.temperature) && (
                    <p className="text-[12px] text-[var(--color-body)] mt-1">
                      {step.temperature && `${step.temperature} · `}
                      {step.duration_sec &&
                        (step.duration_sec >= 60
                          ? `${Math.floor(step.duration_sec / 60)}분`
                          : `${step.duration_sec}초`)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 셰프 핵심 포인트 */}
        {recipe.chef_tips.length > 0 && (
          <div className="mb-8 p-5 border border-[var(--color-hairline)] rounded-[12px]">
            <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-3">셰프 핵심 포인트</p>
            <ul className="space-y-2">
              {recipe.chef_tips.map((tip, i) => (
                <li key={i} className="text-[13px] text-[var(--color-body)] flex gap-2">
                  <span className="text-[var(--color-espresso)]">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 비용 추정 */}
        {recipe.cost_estimate_krw && (
          <div className="mb-8 p-5 bg-[var(--color-surface)] rounded-[12px]">
            <p className="text-[13px] font-semibold text-[var(--color-ink)] mb-1">비용 추정</p>
            <p className="text-[22px] font-medium text-[var(--color-ink)]">
              {recipe.cost_estimate_krw.toLocaleString()}원
            </p>
            <p className="text-[12px] text-[var(--color-body)] mt-1">
              10인분 기준 · 카탈로그 단가 기준 · 1인 {Math.round(recipe.cost_estimate_krw / 10).toLocaleString()}원
            </p>
          </div>
        )}
      </div>

      {brandModal && (
        <BrandChangeModal
          ingredient={brandModal}
          onClose={() => setBrandModal(null)}
          onSaved={() => {}}
        />
      )}
    </>
  )
}
