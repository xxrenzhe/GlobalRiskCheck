const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GlobalRiskCheck",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "免费深度检测 WebRTC、Canvas 指纹与 IP 欺诈值，10 秒生成惨烈评分与修复方案。",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  publisher: {
    "@type": "Organization",
    name: "GlobalRiskCheck"
  }
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
