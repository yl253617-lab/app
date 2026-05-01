import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import SearchBar from "@/components/SearchBar";

export const revalidate = 3600; 

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const currentCategory = resolvedParams.category;

  // 1. 主查询
  const posts = await prisma.post.findMany({
    where: { 
      is_published: true,
      category: currentCategory ? currentCategory : undefined,
      OR: q ? [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } } 
      ] : undefined
    },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      created_at: true,
      views: true,
      excerpt: true, // 拿摘要
      content: true, // 拿正文算阅读时间
    },
  });

  // 2. 聚合查询
  const categoryCounts = await prisma.post.groupBy({
    by: ['category'],
    _count: { id: true },
    where: { is_published: true }
  });

  // 3. 热搜排行
  const hotPosts = await prisma.post.findMany({
    where: { is_published: true },
    orderBy: { views: "desc" },
    take: 3,
    select: { id: true, title: true, slug: true, views: true }
  });

  // 辅助函数
  const getReadingTime = (text: string) => Math.max(1, Math.ceil((text?.length || 0) / 400));
  const buildHref = (cat?: string) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (q) params.set('q', q);
    return `/blog?${params.toString()}`;
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <header className="mb-16 text-center max-w-2xl mx-auto">
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
              技术随笔
            </h1>
            <p className="text-slate-500 text-lg mb-8">
              记录开发点滴，分享技术见解。探索前端架构与全栈开发的无限可能。
            </p>
            {/* 搜索框 */}
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </header>

          {/* 改为左侧边栏，右侧主内容 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            
            {/* 【左侧：侧边栏 (聚合与推荐)】 */}
            {/* order-1 让它在 HTML 结构里排前面，移动端会在上面，桌面端在左边 */}
            <aside className="lg:col-span-1 space-y-8 order-1">
              {/* 分类导航 */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-5 tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  分类检索
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href={buildHref()} 
                      className={`flex justify-between items-center px-4 py-2.5 rounded-xl transition-all text-sm font-bold ${!currentCategory ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      <span>全部文章</span>
                    </Link>
                  </li>
                  {categoryCounts.map((cat) => cat.category && (
                    <li key={cat.category}>
                      <Link 
                        href={buildHref(cat.category)} 
                        className={`flex justify-between items-center px-4 py-2.5 rounded-xl transition-all text-sm font-bold ${currentCategory === cat.category ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <span>{cat.category}</span>
                        <span className={`py-0.5 px-2.5 rounded-md text-xs transition-colors ${currentCategory === cat.category ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                          {cat._count.id}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 热门文章推荐 */}
              <div className="bg-gradient-to-b from-slate-900 to-indigo-950 p-7 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
                {/* 装饰背景 */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
                
                <h3 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
                  <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                  热门推荐
                </h3>
                <div className="space-y-5 relative z-10">
                  {hotPosts.map((post, index) => (
                    <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                      <div className="flex gap-4 items-start">
                        <span className={`text-2xl font-black mt-0.5 transition-all ${index === 0 ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]' : 'text-slate-700 group-hover:text-indigo-400'}`}>
                          0{index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold line-clamp-2 text-slate-200 group-hover:text-white transition-colors leading-snug">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-indigo-300 mt-1.5 uppercase tracking-wider font-bold">
                            {post.views} Views
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            {/* 【右侧：文章列表区】 */}
            <div className="lg:col-span-3 order-2">
              {posts.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold text-lg mb-2">没有找到相关的文章 🥲</p>
                  <p className="text-slate-400 text-sm">尝试更换搜索词或者分类</p>
                </div>
              ) : (
                // 改为了两列的高级卡片布局
                <div className="grid gap-6 md:grid-cols-2">
                  {posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group relative block p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                    >
                      {/* 🌟 卡片顶部悬浮渐变线条动效 */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>

                      <div className="flex justify-between items-start mb-6">
                        <span className="px-4 py-1.5 bg-indigo-50/80 text-indigo-600 text-xs font-black rounded-full uppercase tracking-wider border border-indigo-100/50">
                          {post.category || "未分类"}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          约 {getReadingTime(post.content)} 分钟
                        </span>
                      </div>

                      <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-snug">
                        {post.title}
                      </h2>
                      
                      {/* 截取摘要或正文作为简介 */}
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-10">
                        {post.excerpt || post.content.replace(/[#*`>]/g, '').substring(0, 100) + '...'}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-5 text-xs font-bold text-slate-400">
                          <time className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {post.created_at ? new Date(post.created_at).toLocaleDateString("zh-CN") : "2024-01-01"}
                          </time>
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            {post.views || 0}
                          </div>
                        </div>

                        {/* 🌟 悬浮滑入的“阅读全文”小彩蛋 */}
                        <span className="text-indigo-600 text-sm font-black opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                          阅读全文 →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </FadeIn>
      </div>
    </main>
  );
}