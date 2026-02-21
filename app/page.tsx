import Hero from "@/components/Hero";
import ScanExperience from "@/components/ScanExperience";
import FAQ from "@/components/FAQ";
import StructuredData from "@/components/StructuredData";

export default function HomePage() {
  return (
    <main className="pb-20">
      <StructuredData />
      <Hero />

      <section className="mx-auto w-full max-w-6xl px-6 pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-neon">Dimension 01</p>
            <p className="mt-3 text-sm font-semibold text-white">浏览器指纹欺骗检测</p>
            <p className="mt-2 text-xs text-slate-300">
              拆解 CreepJS 核心逻辑，锁定 Canvas 噪点、Webdriver 与 JS 引擎伪装。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-neon">Dimension 02</p>
            <p className="mt-3 text-sm font-semibold text-white">物理设备绝对烙印</p>
            <p className="mt-2 text-xs text-slate-300">
              FingerprintJS 生成 VisitorID，揭示设备级关联风险与硬件隔离缺口。
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-neon">Dimension 03</p>
            <p className="mt-3 text-sm font-semibold text-white">IP 质量与欺诈评分</p>
            <p className="mt-2 text-xs text-slate-300">
              ASN + Hosting + 黑名单欺诈分，快速暴露机房节点与代理污染池问题。
            </p>
          </div>
        </div>
      </section>

      <ScanExperience />
      <FAQ />
    </main>
  );
}
