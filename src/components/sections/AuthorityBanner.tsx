import { getSiteConfig } from '@/lib/fetchers/config'
import { CHEF_ENDORSEMENT } from '@/lib/constants/brand'
import { AuthorityBannerClient } from './AuthorityBannerClient'

function extractYoutubeId(url: string): string {
  const match = url.match(/(?:shorts\/|v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return match?.[1] ?? CHEF_ENDORSEMENT.videoIdShort
}

export async function AuthorityBanner() {
  const config = await getSiteConfig()
  const videoUrl = config['chef_video_url'] || CHEF_ENDORSEMENT.videoUrl
  const videoId = extractYoutubeId(videoUrl)

  return <AuthorityBannerClient videoId={videoId} />
}
