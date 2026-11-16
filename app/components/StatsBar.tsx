'use client';

import { useEffect, useState } from 'react';

interface Stats {
  diagnosis: number;
  procedure: number;
  drgGroups: number;
  mappings: number;
}

const format = (n: number) => n.toLocaleString('zh-CN');

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    { label: '诊断编码', value: stats?.diagnosis },
    { label: '手术操作编码', value: stats?.procedure },
    { label: 'DRG 分组', value: stats?.drgGroups },
    { label: '编码映射', value: stats?.mappings },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="bg-white border border-slate-200 rounded-xl px-4 py-4 text-center shadow-sm"
          >
            <div className="text-2xl font-semibold text-slate-900 tabular-nums">
              {it.value == null ? '—' : format(it.value)}
            </div>
            <div className="text-xs text-slate-400 mt-1">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
