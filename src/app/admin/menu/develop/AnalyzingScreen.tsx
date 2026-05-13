'use client'
import { useEffect, useState } from 'react'

const STEPS = [
  '음식 식별 중',
  '식자재 카탈로그 매칭 중',
  '10인분 계량 산출 중',
  '브랜드 검증 중',
]

export function AnalyzingScreen() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
      2500,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="p-8 max-w-[640px]">
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
        <div className="w-12 h-12 border-2 border-[var(--color-hairline)] border-t-[var(--color-espresso)] rounded-full animate-spin" />
        <div className="space-y-2 text-center">
          {STEPS.map((s, i) => (
            <p
              key={s}
              className={`text-[14px] transition-all ${
                i === step
                  ? 'text-[var(--color-ink)] font-medium'
                  : i < step
                  ? 'text-[var(--color-body)] line-through'
                  : 'text-[var(--color-hairline)]'
              }`}
            >
              {s}
            </p>
          ))}
        </div>
        <p className="text-[12px] text-[var(--color-body)]">약 5~10초 소요</p>
      </div>
    </div>
  )
}
