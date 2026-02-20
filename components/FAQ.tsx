const questions = [
  {
    q: "扫描为何必须等待 8-12 秒？",
    a: "风控检测需要并行完成多维度指纹比对与 IP 信誉查询，强制延时用于模拟真实算力评估。"
  },
  {
    q: "评分越低意味着什么？",
    a: "低分代表环境与设备指纹被平台高危标记，批量封禁概率显著上升。"
  },
  {
    q: "为什么我更换浏览器仍被识别？",
    a: "设备层面的指纹与 VisitorID 可跨浏览器关联，单纯更换浏览器无法隔离硬件。"
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-neon">FAQ</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">常见问题</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {questions.map((item) => (
          <div key={item.q} className="rounded-xl border border-white/10 bg-black/60 p-4">
            <p className="text-sm font-semibold text-white">{item.q}</p>
            <p className="mt-2 text-xs text-slate-300">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
