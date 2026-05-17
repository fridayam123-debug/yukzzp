import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ko', 'en', 'ja', 'vi'],
  defaultLocale: 'ko',
  // Korean (default) stays at /, others get /en, /ja, /vi prefix
  localePrefix: 'as-needed',
})

export type AppLocale = (typeof routing.locales)[number]
