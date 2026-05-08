import { ORGANIZATION_SCHEMA } from '@/lib/constants/schema'

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
    />
  )
}
