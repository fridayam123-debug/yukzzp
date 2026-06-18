import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // AVIF → WebP → JPEG 순으로 최신 포맷 우선 제공 (브라우저 지원에 따라 자동 선택)
    formats: ['image/avif', 'image/webp'],
    // 모바일 max 828px, PC max 1920px — 3840px 불필요 요청 방지
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
