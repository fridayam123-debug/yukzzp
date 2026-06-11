import { getSiteConfig } from '@/lib/fetchers/config'
import { getSiteCopy } from '@/lib/fetchers/copy'
import { CHEF_ENDORSEMENT } from '@/lib/constants/brand'
import { getLocale } from 'next-intl/server'
import { AuthorityBannerClient } from './AuthorityBannerClient'
import type { Locale } from '@/lib/fetchers/copy'

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:shorts\/|v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return match?.[1] ?? CHEF_ENDORSEMENT.videoIdShort
}

export async function AuthorityBanner() {
  const locale = await getLocale() as Locale
  const [config, copy] = await Promise.all([
    getSiteConfig(),
    getSiteCopy(locale),
  ])
  const videoUrl = config['chef_video_url'] || CHEF_ENDORSEMENT.videoUrl
  const videoId = extractYoutubeId(videoUrl)

  return (
    <AuthorityBannerClient
      videoId={videoId}
      eyebrow={copy['authority.eyebrow'] || 'MEDIA · Chef Recommendation'}
      h2={copy['authority.h2'] || '이원일 셰프가 직접 소개한\n미친듯이 맛있는 돼지고기집 육즙관리소'}
      sub={copy['authority.sub'] || '"미친 듯이 맛있는 돼지고기집" 육즙관리소'}
      body={[
        copy['authority.body1'],
        copy['authority.body2'],
        copy['authority.body3'],
      ].filter(Boolean)}
      videoBtn={copy['authority.videoBtn'] || '▶ 영상 보기'}
      viewCountLabel={copy['authority.viewCount']?.replace('{count}', CHEF_ENDORSEMENT.viewCount.toLocaleString()) || `공식 셰프 채널 ${CHEF_ENDORSEMENT.viewCount.toLocaleString()}+ 조회`}
    />
  )
}
