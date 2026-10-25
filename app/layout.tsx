import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = 'https://y-liard-gamma.vercel.app';

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: '今日の一杯 — 気分・体調から選ぶAIお茶レコメンド',
  description: '今日の気分と体調を選ぶだけで、AIがぴったりのコーヒー・紅茶・日本茶とお茶菓子を提案します。',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: '今日の一杯',
    description: '気分・体調からAIが今日のお茶を提案してくれるアプリ',
    url: siteUrl,
    siteName: '今日の一杯',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '今日の一杯',
    description: '気分・体調からAIが今日のお茶を提案してくれるアプリ',
  },
  appleWebApp: {
    capable: true,
    title: '今日の一杯',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'theme-color': '#3b2a1a',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
