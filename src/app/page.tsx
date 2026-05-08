import { getLocations } from '@/lib/fetchers/locations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrganizationJsonLd } from '@/components/schema/OrganizationJsonLd'
import { Hero } from '@/components/sections/Hero'
import { AuthorityBanner } from '@/components/sections/AuthorityBanner'
import { BrandStory } from '@/components/sections/BrandStory'
import { WhySignature } from '@/components/sections/WhySignature'
import { TwoLocations } from '@/components/sections/TwoLocations'
import { GroupCTA } from '@/components/sections/GroupCTA'
import { ReservationCTA } from '@/components/sections/ReservationCTA'
import { ReviewStrip } from '@/components/sections/ReviewStrip'
import { InstagramStrip } from '@/components/sections/InstagramStrip'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const locations = await getLocations()
  return (
    <>
      <OrganizationJsonLd />
      <Header />
      <main>
        <Hero />
        <AuthorityBanner />
        <WhySignature />
        <TwoLocations locations={locations} />
        <GroupCTA />
        <BrandStory />
        <ReviewStrip />
        <InstagramStrip />
        <ReservationCTA locations={locations} />
      </main>
      <Footer locations={locations} />
    </>
  )
}
