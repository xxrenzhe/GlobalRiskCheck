export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/50 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-neon shadow-glow" />
          <span className="text-sm font-semibold tracking-[0.3em] text-neon">GRISK</span>
        </div>
        <nav className="hidden items-center gap-6 text-xs text-slate-300 md:flex">
          <a href="#scan" className="transition hover:text-white">
            扫描入口
          </a>
          <a href="#result" className="transition hover:text-white">
            风险评分
          </a>
          <a href="#solutions" className="transition hover:text-white">
            修复方案
          </a>
          <a href="#faq" className="transition hover:text-white">
            常见问题
          </a>
        </nav>
        <a
          href="#scan"
          className="rounded-full border border-neon/60 px-4 py-2 text-xs font-semibold text-neon transition hover:bg-neon hover:text-black"
        >
          立即检测
        </a>
      </div>
    </header>
  );
}
