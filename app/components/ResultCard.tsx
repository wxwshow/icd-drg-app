import type { SearchResult, MappingRole } from '@/lib/types';

interface ResultCardProps {
  result: SearchResult;
}

const ROLE_LABELS: Record<MappingRole, { label: string; color: string }> = {
  principal_diagnosis:  { label: '主诊断',   color: 'bg-blue-100 text-blue-800' },
  secondary_diagnosis:  { label: '次诊断',   color: 'bg-slate-100 text-slate-700' },
  procedure:            { label: '手术操作', color: 'bg-purple-100 text-purple-800' },
  cc:                   { label: '合并症',   color: 'bg-amber-100 text-amber-800' },
  mcc:                  { label: '严重合并症', color: 'bg-red-100 text-red-800' },
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  diagnosis:  { label: '诊断', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  procedure:  { label: '手术', color: 'bg-violet-50 text-violet-700 border-violet-200' },
};

const DRG_TYPE_LABELS: Record<string, string> = {
  medical:  'bg-green-50 text-green-700',
  surgical: 'bg-orange-50 text-orange-700',
  pre:      'bg-gray-50 text-gray-600',
};

const DRG_TYPE_TEXT: Record<string, string> = {
  medical:  '内科',
  surgical: '外科',
  pre:      '预分组',
};

export default function ResultCard({ result }: ResultCardProps) {
  const roleCfg = result.role ? ROLE_LABELS[result.role] : null;
  const typeCfg = TYPE_LABELS[result.icd_type] ?? TYPE_LABELS.diagnosis;
  const hasDRG = result.drg_code != null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5
                    hover:border-blue-300 hover:shadow-md
                    transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* Left: ICD-10 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-lg font-mono font-bold text-slate-900">
              {result.icd_code}
            </code>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${typeCfg.color}`}>
              {typeCfg.label}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-2">
            {result.icd_description}
          </p>
          {result.chapter_title && (
            <p className="text-xs text-slate-400">
              章节：{result.chapter_title}
              {result.block_title && ` / ${result.block_title}`}
            </p>
          )}
        </div>

        {/* Right: DRG */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {hasDRG ? (
            <>
              {roleCfg && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleCfg.color}`}>
                  {roleCfg.label}
                </span>
              )}
              {result.drg_type && (
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${DRG_TYPE_LABELS[result.drg_type] ?? ''}`}>
                  {DRG_TYPE_TEXT[result.drg_type] ?? result.drg_type}
                </span>
              )}
              <span className="text-sm font-mono font-semibold text-blue-700">
                {result.drg_code}
              </span>
              <p className="text-xs text-slate-500 text-right max-w-[200px] leading-tight">
                {result.drg_description}
              </p>
              {result.mdc_code && (
                <span className="text-xs text-slate-400 font-mono">
                  {result.mdc_code}
                </span>
              )}
              {result.relative_weight != null && (
                <span className="text-xs text-slate-400">
                  权重：{result.relative_weight.toFixed(4)}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-slate-300 italic">暂无 DRG 分组</span>
          )}
        </div>
      </div>
    </div>
  );
}
