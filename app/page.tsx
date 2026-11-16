import SearchPage from "./components/SearchPage";
import StatsBar from "./components/StatsBar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Top nav */}
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900">ICD-DRG 编码查询</div>
              <div className="text-[11px] text-slate-400">
                诊断 · 手术操作 · DRG 分组
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-500 border border-slate-200 rounded-full px-3 py-1">
            医保 2.0 版
          </span>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="text-center pt-14 pb-8 px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            ICD-10 编码 / DRG 分组查询
          </h1>
          <p className="text-slate-500 text-lg">
            搜索诊断编码、手术操作编码及其 DRG 分组映射
          </p>
        </section>

        <StatsBar />

        <div className="px-4 pb-16 flex flex-col items-center">
          <SearchPage />
        </div>
      </main>
    </div>
  );
}
