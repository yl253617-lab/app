import { prisma } from "@/lib/prisma";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '作品集 | 梁永波',
  description: '基于 Next.js、React、Prisma 与 MySQL 构建的全栈开发实战项目与创意作品展示。',
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ tech?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tech = resolvedParams.tech;
  const q = resolvedParams.q;

  // 1. 获取所有项目，用于在内存中动态提取和统计分类标签 (内存聚合算法)
  const allProjects = await prisma.project.findMany();
  
  const techCounts: Record<string, number> = {};
  allProjects.forEach(project => {
    const techs = project.tech_stack?.split(',').map(t => t.trim()).filter(Boolean) || [];
    techs.forEach(t => {
      techCounts[t] = (techCounts[t] || 0) + 1;
    });
  });

  // 把统计好的对象转换成数组，并按照数量从高到低排序
  const categories = Object.entries(techCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 2. Prisma 组合查询逻辑
  const projects = await prisma.project.findMany({
    where: {
      tech_stack: tech ? { contains: tech } : undefined,
      OR: q ? [
        { title: { contains: q } },
        { description: { contains: q } }
      ] : undefined
    },
    orderBy: { sort_order: "asc" },
  });

  // 3. 静默增加曝光量
  if (projects.length > 0) {
    prisma.project.updateMany({
      where: { id: { in: projects.map(p => p.id) } },
      data: { view_count: { increment: 1 } }
    }).catch(console.error); 
  }

  // 辅助函数：用来在点击分类时保留当前的搜索关键词
  const buildHref = (cat?: string) => {
    const params = new URLSearchParams();
    if (cat) params.set('tech', cat);
    if (q) params.set('q', q);
    return `/portfolio?${params.toString()}`;
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <header className="mb-16 text-center max-w-2xl mx-auto">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6">作品集</h1>
            <p className="text-slate-500 text-lg italic mb-8">Selected Works & Personal Projects</p>
            
            {/* 防抖搜索框 */}
            <div className="flex justify-center">
              <SearchBar />
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            
            {/* 【左侧：分类侧边栏】 */}
            <aside className="lg:col-span-1 space-y-8 order-1">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-5 tracking-tight flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  技术栈索引
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href={buildHref()}
                      className={`flex justify-between items-center px-4 py-2.5 rounded-xl transition-all text-sm font-bold ${!tech ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      <span>全部作品</span>
                      <span className={`py-0.5 px-2.5 rounded-md text-xs transition-colors ${!tech ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                        {allProjects.length}
                      </span>
                    </Link>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.name}>
                      <Link
                        href={buildHref(cat.name)}
                        className={`flex justify-between items-center px-4 py-2.5 rounded-xl transition-all text-sm font-bold ${tech === cat.name ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                      >
                        <span>{cat.name}</span>
                        <span className={`py-0.5 px-2.5 rounded-md text-xs transition-colors ${tech === cat.name ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                          {cat.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* 【右侧：作品卡片展示区】 */}
            <div className="lg:col-span-3 order-2">
              <div className="grid gap-8 md:grid-cols-2">
                {projects.map((project) => (
                  <div key={project.id} className="group relative bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col">
                    
                    {/* 封面图 */}
                    <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-slate-100 mb-8">
                      {project.cover_image ? (
                        <img
                          src={project.cover_image}
                          alt={project.title}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-300 font-bold uppercase tracking-widest">No Image</div>
                      )}
                    </div>
                    
                    {/* 标题与描述 */}
                    <div className="px-2 flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech_stack?.split(',').map((techName) => (
                          <span key={techName} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-full">
                            {techName.trim()}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-snug">
                        {project.title}
                      </h2>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {project.description}
                      </p>
                      
                      {/* 外链 */}
                      <div className="flex gap-6 mb-6">
                        {project.demo_link && (
                          <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="text-sm font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800">
                            View Demo →
                          </a>
                        )}
                        {project.github_link && (
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
                            Source Code
                          </a>
                        )}
                      </div>

                      {/* 核心亮点：工程度量与互动指标底部栏 */}
                      <div className="mt-auto flex justify-between items-end pt-6 border-t border-slate-50">
                        <div className="flex gap-6">
                          <LikeButton id={project.id} initialLikes={project.likes} />
                          <div className="flex items-center gap-1.5 text-slate-400 text-sm font-bold">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {project.view_count}
                          </div>
                        </div>
                        
                        {/* 技术复杂度模拟柱状图 */}
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Complexity</p>
                           <div className="flex gap-1 justify-end">
                              {[1, 2, 3].map(i => (
                                <div 
                                  key={i} 
                                  className={`h-1.5 w-4 rounded-full ${
                                    i <= (project.tech_stack?.split(',').length || 0) / 2 
                                      ? 'bg-indigo-600' 
                                      : 'bg-slate-100'
                                  }`} 
                                />
                              ))}
                           </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* 空数据占位符 */}
              {projects.length === 0 && (
                <div className="py-32 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
                  <p className="text-slate-400 font-bold text-lg mb-2">没有找到相关的项目 🥲</p>
                  <p className="text-slate-400 text-sm font-medium">尝试更换搜索词或者分类标签</p>
                </div>
              )}
            </div>

          </div>
        </FadeIn>
      </div>
    </main>
  );
}