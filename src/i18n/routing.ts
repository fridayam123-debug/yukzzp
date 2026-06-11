import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ko', 'en', 'ja', 'vi', 'zh'],
  defaultLocale: 'ko',
  // Korean (default) stays at /, others get /en, /ja, /vi prefix
  localePrefix: 'as-needed',
  // 브라우저 언어 자동 감지 비활성화 — 명시적 클릭으로만 언어 변경
  localeDetection: false,
})

export type AppLocale = (typeof routing.locales)[number]
