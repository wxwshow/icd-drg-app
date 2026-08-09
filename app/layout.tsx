import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ICD-10 / DRG 编码查询",
  description: "查询 ICD-10 诊断与手术操作编码，及其 DRG 预分组映射",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="antialiased">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {children}
        <footer className="text-center text-xs text-slate-400 py-8">
          仅供参考，编码结果请以官方文件为准
        </footer>
      </body>
    </html>
  );
}
