import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const NAVER_ID = process.env.NEXT_PUBLIC_NAVER_ACCOUNT_ID

export function AnalyticsScripts() {
  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`,
            }}
          />
        </>
      )}
      {NAVER_ID && (
        <>
          <Script src="//wcs.naver.net/wcslog.js" strategy="afterInteractive" />
          <Script
            id="naver-wcs-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `if(!wcs_add)var wcs_add={};wcs_add["wa"]="${NAVER_ID}";if(window.wcs){wcs.inflow("yukjeup.com");var _nasa={};wcs_do(_nasa);}`,
            }}
          />
        </>
      )}
    </>
  )
}
