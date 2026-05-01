import { prisma } from "@/lib/prisma";
import FadeIn from "@/components/FadeIn";

// 🌟 亮点 1：定义严谨的 TypeScript 数据接口
interface Experience {
  time: string;
  role: string;
  company: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  time: string;
}

export const revalidate = 3600;

export default async function AboutPage() {
  const profile = await prisma.profile.findUnique({
    where: { id: 1 },
  });

  // 🌟 亮点 2：安全的 JSON 字符串反序列化解析器
  const parseJSONField = <T,>(data: string | null | undefined, fallback: T[]): T[] => {
    if (!data) return fallback;
    try {
      return JSON.parse(data) as T[];
    } catch (error) {
      console.error("履历数据反序列化失败:", error);
      return fallback; // 容错处理：即使数据库数据格式崩了，页面也不会白屏
    }
  };

  const experiences = parseJSONField<Experience>(profile?.experience, []);
  const educations = parseJSONField<Education>(profile?.education, []);

  // 解析技术栈
  const skills = profile?.skills 
    ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) 
    : ['Next.js', 'React', 'TypeScript', 'Prisma', 'MySQL', 'Tailwind CSS'];

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50/30">
      <div className="max-w-4xl mx-auto space-y-20">
        <FadeIn>
          {/* 个人简介卡片 */}
          <section className="flex flex-col md:flex-row gap-12 items-center bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="w-64 h-64 relative group flex-shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-100 to-blue-50 rounded-[3rem] rotate-6 group-hover:rotate-3 transition-transform duration-500"></div>
              <img
                src={profile?.avatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"}
                className="w-full h-full object-cover rounded-[2.5rem] relative z-10 shadow-lg border-4 border-white"
                alt={profile?.name || "Profile"}
              />
            </div>
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                {profile?.name || "梁永波"}
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                {profile?.bio || "深耕前端开发领域，热衷于构建响应式、高性能的 Web 应用..."}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {skills.map((skill, i) => (
                  <span key={i} className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full shadow-sm hover:scale-105 transition-transform cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          {/* 个人经历时间轴 */}
          <section className="space-y-12">
            <h2 className="text-3xl font-black flex items-center gap-4 text-slate-900">
              <span className="w-8 h-1.5 bg-indigo-600 rounded-full"></span>
              个人经历
            </h2>
            
            <div className="space-y-12 border-l-2 border-indigo-100 ml-4 pl-10 relative">
              {experiences.length > 0 ? experiences.map((exp, index) => (
                <div key={index} className="relative group">
                  {/* 时间轴节点动效 */}
                  <div className="absolute -left-[49px] top-1.5 w-4 h-4 rounded-full bg-white border-[3px] border-indigo-500 shadow-sm group-hover:scale-125 group-hover:bg-indigo-500 transition-all duration-300"></div>
                  
                  <div className="space-y-3 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <h3 className="text-2xl font-black text-slate-900">{exp.role}</h3>
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                        {exp.time}
                      </span>
                    </div>
                    <p className="font-bold text-slate-400 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      {exp.company}
                    </p>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      {exp.description}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 italic font-medium">在后台管理系统中添加你的第一条职业经历...</p>
              )}
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          {/* 教育背景 */}
          <section className="space-y-12 pb-10">
            <h2 className="text-3xl font-black flex items-center gap-4 text-slate-900">
              <span className="w-8 h-1.5 bg-indigo-600 rounded-full"></span>
              教育背景
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {educations.length > 0 ? educations.map((edu, index) => (
                <div key={index} className="p-8 bg-white rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{edu.school}</h3>
                    <p className="text-slate-500 font-bold mt-1.5 text-sm">{edu.degree}</p>
                  </div>
                  <span className="px-4 py-1.5 bg-slate-50 rounded-full text-xs font-black text-slate-400 border border-slate-100">
                    {edu.time}
                  </span>
                </div>
              )) : (
                <p className="text-slate-400 italic font-medium">暂无教育背景数据</p>
              )}
            </div>
          </section>
        </FadeIn>

      </div>
    </main>
  );
}