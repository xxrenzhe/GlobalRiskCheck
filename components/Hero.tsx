export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-20">
      <div className="absolute inset-0 bg-haze opacity-80" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-neon">
          <span className="h-2 w-2 rounded-full bg-neon" />
          Risk Intelligence System
        </div>
        <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
          2026 跨境出海终极防封风控评估系统
        </h1>
        <p className="max-w-2xl text-base text-slate-300 md:text-lg">
          您的账号正在“裸奔”吗？一键透视 WebRTC、Canvas 指纹与 IP 欺诈值，10 秒还原平台风控对您的真实判定。
        </p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="rounded-full border border-neon/30 px-4 py-2">
            免费深度扫描 · 8-12 秒强制加载
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2">
            90% 用户直接落入红区
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#scan"
            className="animate-pulse rounded-full bg-neon px-8 py-4 text-sm font-semibold text-black shadow-glow"
          >
            初始化深度扫描
          </a>
          <span className="text-xs text-slate-400">
            评分仅供内部风控模拟，请勿用于违规用途
          </span>
        </div>
      </div>
    </section>
  );
}
