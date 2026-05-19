export const dynamic = 'force-dynamic'

import { getReels } from './actions'
import { InstagramClient } from './InstagramClient'

export default async function InstagramAdminPage() {
  const reels = await getReels()
  return <InstagramClient initialReels={reels} />
}
