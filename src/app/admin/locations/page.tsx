import { getLocations } from '@/lib/fetchers/locations'
import { LocationPhotoUploader } from './LocationPhotoUploader'
import { LocationFieldsEditor } from './LocationFieldsEditor'

export const dynamic = 'force-dynamic'

export default async function AdminLocationsPage() {
  const locations = await getLocations()

  return (
    <div className="p-8 max-w-[900px]">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-2">지점 관리</h1>
      <p className="text-[13px] text-[var(--color-body)] mb-10">
        사진 클릭 시 바로 교체됩니다. 정보 편집 후 저장 버튼을 누르세요.
      </p>

      <div className="flex flex-col gap-12">
        {locations.map(loc => (
          <div key={loc.id} className="flex flex-col gap-4">
            <div>
              <p className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)] uppercase">{loc.slug}</p>
              <h2 className="text-[17px] font-medium text-[var(--color-ink)] mt-1">{loc.name_ko}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
              {/* 사진 업로더 */}
              <LocationPhotoUploader
                slug={loc.slug}
                currentUrl={loc.hero_image ?? null}
                label={loc.name_ko}
              />

              {/* 필드 에디터 */}
              <LocationFieldsEditor location={loc} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
