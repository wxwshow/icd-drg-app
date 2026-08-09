import SearchPage from "./components/SearchPage";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          ICD-10 编码 / DRG 分组查询
        </h1>
        <p className="text-slate-500 text-lg">
          搜索诊断编码、手术操作编码及其 DRG 分组映射
        </p>
      </div>

      <SearchPage />
    </main>
  );
}
