// app/layout.tsx
import Navbar from "@/components/Navbar"; 
import "./globals.css";
import type { Metadata } from 'next';

// ✅ 现在这里是服务端组件了，可以完美导出 metadata，SEO 满分起步！
export const metadata: Metadata = {
  title: '梁永波的个人博客与作品集',
  description: '记录全栈开发之路，分享技术心得，展示我的每一个创意作品。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="antialiased">
        {/* 把判断逻辑交给 Navbar 组件自己内部去处理 */}
        <Navbar />
        
        {/* 页面主体内容 */}
        {children}
      </body>
    </html>
  );
}