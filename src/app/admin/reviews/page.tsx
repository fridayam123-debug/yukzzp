import { getReviewStats, getAllReviews } from './actions'
import { ReviewsClient } from './ReviewsClient'

export const dynamic = 'force-dynamic'

export default async function ReviewsAdminPage() {
  const [stats, allReviews] = await Promise.all([getReviewStats(), getAllReviews()])
  return <ReviewsClient stats={stats} allReviews={allReviews} />
}
