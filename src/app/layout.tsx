import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yukzzp.com"),
  title: {
    default: "육즙관리소 — 프리미엄 흑돼지 다이닝",
    template: "%s — 육즙관리소",
  },
  description:
    "셰프 이원일이 인정한 흑돼지 다이닝. 산청·거창 산지 100% 대나무 숯 직화. 양재역 본점·더룸 을지로동대문점 운영.",
  openGraph: {
    siteName: "육즙관리소",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/photos/brand/brand-story.jpg",
        width: 1200,
        height: 630,
        alt: "육즙관리소 — 산청 흑돼지 프리미엄 다이닝",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/photos/brand/brand-story.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // getLocale resolves via next-intl request config (returns defaultLocale outside [locale] tree)
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://cdn.cafe24.com/fonts/classictype/cafe24classictype.css" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
