import { WEBSITE_SCHEMA, FAQ_SCHEMA } from '@/lib/constants/schema'

export function WebsiteJsonLd() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
    </>
  )
}
