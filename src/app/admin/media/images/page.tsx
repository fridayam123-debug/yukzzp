import { getSiteConfig } from '@/lib/fetchers/config'
import { KeyImageUploader } from './KeyImageUploader'

export const dynamic = 'force-dynamic'

const IMAGE_ITEMS = [
  {
    imageKey: 'hero.background',
    label: 'Hero 배경 이미지',
    description: '메인 페이지 최상단 히어로 섹션의 배경 사진. 권장: 1920×1080 이상.',
    fallbackPath: '/photos/locations/euljiro/wave-wall.jpg',
    configKey: 'hero_background_url',
  },
  {
    imageKey: 'interior.banner',
    label: '인테리어 배너 이미지',
    description: '중간 전폭 배너 이미지. 권장: 1920×1080 이상.',
    fallbackPath: '/photos/interior/euljiro-interior.jpg',
    configKey: 'interior_banner_url',
  },
  {
    imageKey: 'brand.story',
    label: '브랜드 스토리 이미지',
    description: '브랜드 스토리 섹션 우측 사진. 권장: 800×600 이상.',
    fallbackPath: '/photos/brand/brand-story.jpg',
    configKey: 'brand_story_url',
  },
] as const

export default async function KeyImagesPage() {
  const config = await getSiteConfig()

  return (
    <div className="p-8 max-w-[900px]">
      <h1 className="text-[22px] font-medium text-[var(--color-ink)] mb-2">주요 이미지 관리</h1>
      <p className="text-[13px] text-[var(--color-body)] mb-10">
        클릭하면 바로 교체됩니다. JPEG · PNG · WebP, 최대 10MB. 저장 즉시 반영됩니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {IMAGE_ITEMS.map(item => (
          <KeyImageUploader
            key={item.imageKey}
            imageKey={item.imageKey}
            label={item.label}
            description={item.description}
            currentUrl={config[item.configKey] ?? ''}
            fallbackPath={item.fallbackPath}
          />
        ))}
      </div>
    </div>
  )
}
