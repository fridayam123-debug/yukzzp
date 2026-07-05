import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/locations', destination: '/#locations', permanent: true },
      { source: '/$', destination: '/', permanent: true },
      { source: '/&', destination: '/', permanent: true },
    ]
  },
  images: {
    // AVIF → WebP → JPEG 순으로 최신 포맷 우선 제공 (브라우저 지원에 따라 자동 선택)
    formats: ['image/avif', 'image/webp'],
    // 480px 추가: 소형 모바일(375~479px)에 640px 대신 480px 이미지 제공
    deviceSizes: [480, 640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 30일 CDN 캐싱: Vercel에서 최적화된 이미지를 장기 캐시
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
