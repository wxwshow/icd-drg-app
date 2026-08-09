'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchBox({ onSearch, loading }: SearchBoxProps) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 350);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // Press "/" to focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative w-full max-w-2xl">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="输入 ICD-10 编码、诊断名称或 DRG 关键词..."
        className="w-full pl-12 pr-12 py-4 text-lg bg-white border-2
                   border-slate-200 rounded-2xl shadow-sm
                   focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                   outline-none transition-all duration-200
                   placeholder:text-slate-400"
        autoFocus
      />

      {value && (
        <button
          onClick={() => {
            setValue('');
            onSearch('');
            inputRef.current?.focus();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2
                     text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="清除搜索"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {loading && (
        <div className="absolute right-14 top-1/2 -translate-y-1/2">
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
