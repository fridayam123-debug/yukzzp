import { getReviewStats } from './actions'
import { ReviewsClient } from './ReviewsClient'

export const dynamic = 'force-dynamic'

export default async function ReviewsAdminPage() {
  const stats = await getReviewStats()
  return <ReviewsClient stats={stats} />
}
