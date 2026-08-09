'use client';

import { useState, useCallback } from 'react';
import SearchBox from './SearchBox';
import ResultCard from './ResultCard';
import type { SearchResponse, SearchResult } from '@/lib/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);

    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? `请求失败 (${res.status})`);
      }

      const data: SearchResponse = await res.json();
      setResults(data.results);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <SearchBox onSearch={handleSearch} loading={loading} />

      {/* Loading */}
      {loading && (
        <div className="w-full max-w-2xl space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse"
            >
              <div className="h-5 w-24 bg-slate-200 rounded mb-3" />
              <div className="h-4 w-full bg-slate-100 rounded mb-2" />
              <div className="h-3 w-48 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
          <button
            onClick={() => handleSearch(query)}
            className="ml-2 underline hover:no-underline font-medium"
          >
            重试
          </button>
        </div>
      )}

      {/* Initial */}
      {!hasSearched && !loading && !error && (
        <div className="text-center text-slate-400 mt-16">
          <p className="text-lg mb-1">
            输入 ICD-10 编码、诊断名称或 DRG 关键词进行搜索
          </p>
          <p className="text-sm">
            示例：&ldquo;高血压&rdquo;、&ldquo;I10&rdquo;、&ldquo;心力衰竭&rdquo;、&ldquo;F60A&rdquo;
          </p>
        </div>
      )}

      {/* Empty */}
      {hasSearched && !loading && !error && results.length === 0 && (
        <div className="text-center text-slate-400 mt-16">
          <p className="text-lg">未找到匹配的编码或 DRG 分组</p>
          <p className="text-sm">
            请尝试其他关键词
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="w-full max-w-2xl space-y-3">
          <p className="text-sm text-slate-500">
            &ldquo;{query}&rdquo; — 共 {results.length} 条结果
          </p>
          {results.map((r, i) => (
            <ResultCard
              key={`${r.icd_code}-${r.drg_code}-${r.role}-${i}`}
              result={r}
            />
          ))}
        </div>
      )}
    </div>
  );
}
