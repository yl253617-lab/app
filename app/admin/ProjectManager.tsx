"use client";

import { useState } from "react";
import { addProject, updateProject, deleteProject } from "./actions";

export default function ProjectManager({ initialProjects = [] }: { initialProjects: any[] }) {
  const [editingProject, setEditingProject] = useState<any>(null);
  const [urlError, setUrlError] = useState<string | null>(null); 
  const projects = Array.isArray(initialProjects) ? initialProjects : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUrlError(null);

    const formData = new FormData(e.currentTarget);
    const coverImage = formData.get("cover_image") as string;
    const demoLink = formData.get("demo_link") as string;
    const githubLink = formData.get("github_link") as string;

    // ======= 【TC-25 进阶版：严格 HTTPS 协议拦截校验】 =======
    // 正则表达式：只允许 https:// 开头
    const httpsRegex = /^https:\/\//; 
    
    if (coverImage && !httpsRegex.test(coverImage)) {
      setUrlError("❌ 封面图格式错误：为了保证网站安全，图片地址必须以 https:// 开头");
      return; 
    }

    if (demoLink && !httpsRegex.test(demoLink)) {
      setUrlError("❌ 预览地址格式错误：外链必须以 https:// 开头");
      return; 
    }
    
    if (githubLink && !httpsRegex.test(githubLink)) {
      setUrlError("❌ GitHub 地址格式错误：必须以 https:// 开头");
      return;
    }
    // =========================================================

    // 填补数据库需要的默认字段，保持 UI 极简
    formData.append("sort_order", "0");
    formData.append("is_featured", "false");

    try {
      if (editingProject) {
        await updateProject(formData);
      } else {
        await addProject(formData);
      }
      
      setEditingProject(null);
      (e.target as HTMLFormElement).reset();
      alert("✨ 作品已成功同步至数据库！");
    } catch (err) {
      alert("保存失败，请检查网络或数据库连接");
    }
  };

  return (
    <section className="space-y-6">
      {/* 1. 发布作品表单 */}
      <div className={`bg-white p-8 rounded-[2rem] shadow-sm border transition-all ${editingProject ? 'border-[#2563eb] ring-4 ring-blue-50' : 'border-slate-100'}`}>
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-[#2563eb]">
          <span className="w-1.5 h-6 bg-[#2563eb] rounded-full"></span>
          {editingProject ? "编辑项目信息" : "发布新作品"}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {editingProject && <input type="hidden" name="id" value={editingProject.id} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input 
              name="title" 
              defaultValue={editingProject?.title} 
              placeholder="项目名称 (必填)" 
              required 
              className="w-full p-4 bg-[#f8f9fa] rounded-xl border-none text-sm focus:ring-2 focus:ring-[#2563eb] outline-none transition-all" 
            />
            <input 
              name="tech_stack" 
              defaultValue={editingProject?.tech_stack} 
              placeholder="技术栈 (如: Next.js / Tailwind)" 
              className="w-full p-4 bg-[#f8f9fa] rounded-xl border-none text-sm focus:ring-2 focus:ring-[#2563eb] outline-none transition-all" 
            />
          </div>

          {/* 第二行：封面图 URL (加入拦截样式) */}
          <input 
            name="cover_image" 
            defaultValue={editingProject?.cover_image} 
            placeholder="封面图 URL (必须以 https:// 开头)" 
            onChange={() => setUrlError(null)}
            className={`w-full p-4 bg-[#f8f9fa] rounded-xl text-sm transition-all outline-none ${urlError?.includes('封面') ? 'ring-2 ring-red-500 bg-red-50' : 'border-none focus:ring-2 focus:ring-[#2563eb]'}`} 
          />

          {/* 第三行：预览地址 & GitHub (加入拦截样式) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input 
              name="demo_link" 
              defaultValue={editingProject?.demo_link} 
              placeholder="预览地址 (必须以 https:// 开头)" 
              onChange={() => setUrlError(null)} 
              className={`w-full p-4 bg-[#f8f9fa] rounded-xl text-sm transition-all outline-none ${urlError?.includes('预览') ? 'ring-2 ring-red-500 bg-red-50' : 'border-none focus:ring-2 focus:ring-[#2563eb]'}`} 
            />
            <input 
              name="github_link" 
              defaultValue={editingProject?.github_link} 
              placeholder="GitHub (必须以 https:// 开头)" 
              onChange={() => setUrlError(null)}
              className={`w-full p-4 bg-[#f8f9fa] rounded-xl text-sm transition-all outline-none ${urlError?.includes('GitHub') ? 'ring-2 ring-red-500 bg-red-50' : 'border-none focus:ring-2 focus:ring-[#2563eb]'}`} 
            />
          </div>
          
          {/* TC-25 拦截错误提示 */}
          {urlError && (
            <p className="text-red-500 text-xs font-bold px-2 animate-in fade-in slide-in-from-top-1">{urlError}</p>
          )}

          <textarea 
            name="description" 
            defaultValue={editingProject?.description} 
            placeholder="项目描述..." 
            className="w-full p-4 bg-[#f8f9fa] rounded-xl border-none text-sm h-32 resize-none focus:ring-2 focus:ring-[#2563eb] outline-none transition-all" 
          />
          
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-4 bg-[#1d4ed8] text-white rounded-xl font-bold text-sm hover:bg-[#1e40af] transition-colors">
              {editingProject ? "确认保存修改" : "立即发布项目"}
            </button>
            {editingProject && (
               <button type="button" onClick={() => setEditingProject(null)} className="px-8 py-4 bg-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors">取消编辑</button>
            )}
          </div>
        </form>
      </div>

      {/* 2. 管理作品列表 */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 mb-6 ml-2 tracking-wider">管理作品 ({projects.length})</h3>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm italic bg-[#f8f9fa] rounded-2xl">
              还没有上传作品哦~
            </div>
          ) : (
            projects.map(p => (
              <div key={p.id} className="flex items-center gap-5 p-4 bg-[#f8f9fa] rounded-2xl group transition-all hover:bg-white hover:shadow-md hover:border-blue-100 border border-transparent">
                <img 
                  src={p.cover_image || "/placeholder.png"} 
                  alt={p.title} 
                  className="w-14 h-14 rounded-xl object-cover bg-slate-200 border border-slate-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-[15px] font-bold text-slate-800 truncate mb-1">{p.title}</p>
                  <p className="text-xs text-slate-400 truncate">{p.tech_stack}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => {setEditingProject(p); window.scrollTo({top:0, behavior:'smooth'})}} 
                    className="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    编辑
                  </button>
                  <button 
                    onClick={async () => {
                      if(confirm("确定要删除这个作品吗？")) {
                        await deleteProject(p.id);
                      }
                    }} 
                    className="px-4 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}