import { getAllCopyRows } from '@/lib/fetchers/copy'
import { CopyEditor } from './CopyEditor'

export const dynamic = 'force-dynamic'

export default async function AdminCopyPage() {
  const rows = await getAllCopyRows()

  return (
    <div className="p-8 max-w-[860px]">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-2">문구 관리</h1>
      <p className="text-[13px] text-[var(--color-body)] mb-10">
        저장하면 60초 내 홈페이지에 반영됩니다.
      </p>
      <CopyEditor rows={rows} />
    </div>
  )
}
