import { getAllFaqsAdmin, getStoreOptions } from './actions'
import { FaqsClient } from './FaqsClient'

export const dynamic = 'force-dynamic'

export default async function AdminFaqsPage() {
  const [faqs, stores] = await Promise.all([getAllFaqsAdmin(), getStoreOptions()])
  return <FaqsClient initialFaqs={faqs} stores={stores} />
}
