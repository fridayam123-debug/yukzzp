import { WEBSITE_SCHEMA, FAQ_SCHEMA, HOME_BREADCRUMB_SCHEMA } from '@/lib/constants/schema'

export function WebsiteJsonLd() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_BREADCRUMB_SCHEMA) }} />
    </>
  )
}
