export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/60 py-10 text-xs text-slate-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">GlobalRiskCheck</p>
          <p className="mt-2">2026 跨境出海防封环境检测系统</p>
        </div>
        <div className="space-y-1">
          <p>免责声明：本工具仅用于环境风险评估，不构成合规建议。</p>
          <p>© 2026 GlobalRiskCheck. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
