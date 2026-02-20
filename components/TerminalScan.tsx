"use client";

type Props = {
  logs: string[];
  progress: number;
};

export default function TerminalScan({ logs, progress }: Props) {
  return (
    <div className="glass grid-bg relative overflow-hidden rounded-2xl border border-neon/20 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-danger" />
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          <span className="h-2 w-2 rounded-full bg-neon" />
          <span className="ml-3 font-semibold text-neon">GRISK TERMINAL</span>
        </div>
        <div className="text-xs text-slate-400">深度扫描中 {Math.min(progress, 100)}%</div>
      </div>
      <div className="h-56 overflow-hidden rounded-lg bg-black/70 p-4 font-mono text-xs leading-5 text-neon">
        {logs.length === 0 ? (
          <p className="text-slate-500">等待指令...</p>
        ) : (
          logs.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)
        )}
        <span className="inline-block h-4 w-2 animate-pulse bg-neon align-middle" />
      </div>
    </div>
  );
}
