import Link from 'next/link';
import { prisma } from "@/lib/prisma";

// 开启 ISR 缓存，首页每 1 小时后台静默刷新一次，兼顾访问速度与数据新鲜度
export const revalidate = 3600;

export default async function HomePage() {
  // 1. 服务端获取动态个人数据
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });

  // 2. 数据库聚合查询：统计全站动态数据总数
  const projectCount = await prisma.project.count();
  const postCount = await prisma.post.count({ where: { is_published: true } });

  // 3. 获取最新发布的 2 篇文章作为速递
  const recentPosts = await prisma.post.findMany({
    where: { is_published: true },
    orderBy: { created_at: 'desc' },
    take: 2,
    select: { id: true, title: true, slug: true, created_at: true, category: true }
  });

  // 动态解析技术栈字典
  const skills = profile?.skills 
    ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) 
    : ['Next.js', 'React', 'TypeScript', 'Prisma', 'MySQL', 'Tailwind'];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-1000">
      
      {/* 顶部动态数据概览 (证明系统是全栈动态的) */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <div className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm text-xs font-bold text-indigo-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          系统正常运行
        </div>
        <div className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm text-xs font-bold text-slate-500">
          已收录 <span className="text-indigo-600 font-black">{projectCount}</span> 个项目
        </div>
        <div className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-sm text-xs font-bold text-slate-500">
          已发布 <span className="text-indigo-600 font-black">{postCount}</span> 篇文章
        </div>
      </div>
      
      {/* 主标题 */}
      <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">
        探索技术与设计的 <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 relative inline-block">
          完美融合
          <svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/>
          </svg>
        </span>
      </h1>
      
      {/* 简介 (动态读取数据库内容) */}
      <p className="max-w-2xl text-lg md:text-xl text-slate-600 leading-relaxed mb-12">
        {profile?.bio || "你好，我是梁永波。这里记录了我的全栈开发之路，分享技术心得，展示我的每一个创意作品。"}
      </p>
      
      {/* 动作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link 
          href="/portfolio" 
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          查看作品集
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </Link>
        <Link 
          href="/blog" 
          className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-xl font-bold hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
        >
          阅读博客文章
        </Link>
      </div>

      {/* 最新内容速递 (提升首页实用性与数据联动) */}
      {recentPosts.length > 0 && (
        <div className="mt-20 w-full max-w-4xl text-left">
          <div className="flex items-center justify-between mb-6 px-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">最新发布</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {recentPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="text-xs font-bold text-indigo-500 mb-3">{post.category || '未分类'}</div>
                <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{post.title}</h3>
                <div className="text-xs text-slate-400 mt-4 font-medium">
                  {post.created_at?.toLocaleDateString('zh-CN')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 技术栈徽章 (动态渲染) */}
      <div className="mt-24 pt-12 border-t border-slate-100 w-full max-w-4xl">
        <p className="text-slate-400 text-sm font-medium mb-8">常用技术栈</p>
        <div className="flex flex-wrap justify-center gap-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
          {skills.map(tech => (
            <span key={tech} className="text-slate-600 font-bold">{tech}</span>
          ))}
        </div>
      </div>
      
    </div>
  );
}