import { getMenu } from '@/lib/fetchers/menu'
import { PhotoUploader } from './PhotoUploader'

export const dynamic = 'force-dynamic'

export default async function AdminMenuPage() {
  const { categories, items } = await getMenu()

  return (
    <div className="p-8 max-w-[1200px]">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-2">메뉴 사진 관리</h1>
      <p className="text-[13px] text-[var(--color-body)] mb-10">
        사진을 클릭하면 바로 교체됩니다. JPEG · PNG · WebP, 최대 10MB.
      </p>

      {categories.map(cat => {
        const catItems = items.filter(i => i.category_id === cat.id)
        if (catItems.length === 0) return null
        return (
          <div key={cat.id} className="mb-12">
            <h2 className="text-[15px] font-semibold text-[var(--color-ink)] pb-3 mb-6 border-b border-[var(--color-hairline)]">
              {cat.name_ko}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {catItems.map(item => (
                <div key={item.id} className="flex flex-col gap-2">
                  <PhotoUploader
                    itemId={item.id}
                    currentUrl={item.photo_url}
                    itemName={item.name_ko}
                  />
                  <div>
                    <p className="text-[13px] font-medium text-[var(--color-ink)] leading-[1.3]">
                      {item.name_ko}
                    </p>
                    {item.price_krw != null && (
                      <p className="text-[11px] text-[var(--color-body)] mt-0.5">
                        {item.price_krw.toLocaleString()}원
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
