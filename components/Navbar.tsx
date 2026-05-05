"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // 如果当前路径是以 /admin 开头（后台管理页面），直接返回 null 隐藏导航栏
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "首页", href: "/" },
    { name: "博客", href: "/blog" },
    { name: "作品", href: "/portfolio" },
    { name: "关于我", href: "/about" },
    { name: "联系方式", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex items-center px-8 justify-between">
      {/* 🌟 增加了 p-2 和 -ml-2 扩大触摸区域 */}
      <Link href="/" className="text-xl font-black text-indigo-600 p-2 -ml-2">
        PORTFOLIO.
      </Link>
      
      <div className="flex items-center gap-8">
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            // 🌟 增加了 py-2 px-3 扩大链接点击区域
            className={`py-2 px-3 text-sm font-bold transition-colors hover:text-indigo-600 ${
              pathname === link.href ? "text-indigo-600" : "text-slate-500"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}