import { getLocations } from '@/lib/fetchers/locations'
import { LocationPhotoUploader } from './LocationPhotoUploader'

export const dynamic = 'force-dynamic'

export default async function AdminLocationsPage() {
  const locations = await getLocations()

  return (
    <div className="p-8 max-w-[900px]">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-2">지점 사진 관리</h1>
      <p className="text-[13px] text-[var(--color-body)] mb-10">
        사진을 클릭하면 바로 교체됩니다. JPEG · PNG · WebP, 최대 10MB.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locations.map(loc => (
          <div key={loc.id} className="flex flex-col gap-3">
            <div>
              <p className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)] uppercase">{loc.slug}</p>
              <h2 className="text-[17px] font-medium text-[var(--color-ink)] mt-1">{loc.name_ko}</h2>
            </div>
            <LocationPhotoUploader
              slug={loc.slug}
              currentUrl={loc.hero_image ?? null}
              label={loc.name_ko}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
