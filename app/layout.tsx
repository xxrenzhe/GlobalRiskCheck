import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SecurityLayer from "@/components/SecurityLayer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://globalriskcheck.co"),
  title: "GlobalRiskCheck | 2026 跨境出海终极防封风控评估系统",
  description:
    "免费深度检测 WebRTC、Canvas 指纹与 IP 欺诈值，10 秒生成惨烈评分与修复方案。",
  keywords: [
    "跨境电商",
    "防封",
    "指纹浏览器",
    "WebRTC",
    "IP 质量检测",
    "风险评估"
  ],
  openGraph: {
    title: "GlobalRiskCheck | 防封风控评估",
    description: "免费深度检测指纹与 IP 质量，生成高危扣分项并给出修复方案。",
    url: "https://globalriskcheck.co",
    siteName: "GlobalRiskCheck",
    locale: "zh_CN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalRiskCheck | 防封风控评估",
    description: "免费深度检测指纹与 IP 质量，生成高危扣分项并给出修复方案。"
  },
  alternates: {
    canonical: "https://globalriskcheck.co"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121212"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const useObfuscated = process.env.NEXT_PUBLIC_OBFUSCATED === "true";
  return (
    <html lang="zh-CN" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-night text-white">
        <Script
          src={useObfuscated ? "/scan-core.obf.js" : "/scan-core.js"}
          strategy="beforeInteractive"
        />
        <SecurityLayer>
          <Header />
          {children}
          <Footer />
        </SecurityLayer>
      </body>
    </html>
  );
}
