// app/layout.tsx
"use client"; // 必须是客户端组件才能使用 usePathname

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar"; // 确认你的 Navbar 路径
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 📝 逻辑：只要路径不是以 /admin 开头，就显示前台导航栏
  const isHomePage = !pathname?.startsWith("/admin");

  return (
    <html lang="zh">
      <body className="antialiased">
        {/* ✅ 只有在前台页面才渲染 Navbar */}
        {isHomePage && <Navbar />}
        
        {/* 页面主体内容 */}
        {children}
      </body>
    </html>
  );
}