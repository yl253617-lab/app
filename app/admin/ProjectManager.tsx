"use client";

import { useState } from "react";
import { addProject, updateProject, deleteProject } from "./actions";

// ✅ 1. 增加参数默认值 = [] 解决 undefined 导致的崩溃
export default function ProjectManager({ initialProjects = [] }: { initialProjects: any[] }) {
  const [editingProject, setEditingProject] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  // 包装提交逻辑以展示提示
  const handleFormAction = async (formData: FormData) => {
    try {
      if (editingProject) {
        await updateProject(formData);
        setToast("作品信息已成功更新！");
      } else {
        await addProject(formData);
        setToast("新作品发布成功！");
      }
      setEditingProject(null);
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast("操作失败，请重试");
    }
  };

  // ✅ 2. 预处理数据，确保变量始终是数组
  const projects = Array.isArray(initialProjects) ? initialProjects : [];

  return (
    <section className="space-y-8 relative">
      {/* 动态成功提示气泡 */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px]">✓</div>
            <span className="text-xs font-bold">{toast}</span>
          </div>
        </div>
      )}

      {/* 编辑/发布表单 */}
      <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all duration-500 ${editingProject ? 'border-amber-400 ring-4 ring-amber-50' : 'border-slate-100'}`}>
        <h2 className={`text-xl font-black mb-6 flex items-center gap-2 ${editingProject ? 'text-amber-600' : 'text-blue-600'}`}>
          <span className={`w-1.5 h-6 rounded-full ${editingProject ? 'bg-amber-600' : 'bg-blue-600'}`}></span>
          {editingProject ? "正在修改作品" : "发布新作品"}
        </h2>
        
        <form action={handleFormAction} className="grid grid-cols-1 gap-4">
          {editingProject && <input type="hidden" name="id" value={editingProject.id} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" defaultValue={editingProject?.title || ""} key={`t-${editingProject?.id}`} placeholder="项目名称" required className="p-3 bg-slate-50 rounded-xl border-none text-xs focus:ring-2 focus:ring-blue-500" />
            <input name="tech_stack" defaultValue={editingProject?.tech_stack || ""} key={`s-${editingProject?.id}`} placeholder="技术栈 (如: Next.js / Tailwind)" className="p-3 bg-slate-50 rounded-xl border-none text-xs focus:ring-2 focus:ring-blue-500" />
          </div>

          <input name="cover_image" defaultValue={editingProject?.cover_image || ""} key={`i-${editingProject?.id}`} placeholder="封面图 URL" className="p-3 bg-slate-50 rounded-xl border-none text-xs focus:ring-2 focus:ring-blue-500" />
          
          <div className="grid grid-cols-2 gap-2">
            <input name="demo_link" defaultValue={editingProject?.demo_link || ""} key={`d-${editingProject?.id}`} placeholder="预览地址" className="p-3 bg-slate-50 rounded-xl border-none text-xs focus:ring-2 focus:ring-blue-500" />
            <input name="github_link" defaultValue={editingProject?.github_link || ""} key={`g-${editingProject?.id}`} placeholder="GitHub" className="p-3 bg-slate-50 rounded-xl border-none text-xs focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <textarea name="description" defaultValue={editingProject?.description || ""} key={`ds-${editingProject?.id}`} placeholder="项目描述..." className="p-3 bg-slate-50 rounded-xl border-none text-xs h-24 focus:ring-2 focus:ring-blue-500" />
          
          <div className="flex gap-2">
            <button className={`flex-1 py-4 text-white rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 ${editingProject ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {editingProject ? "保存并覆盖修改" : "立即发布项目"}
            </button>
            {editingProject && (
              <button type="button" onClick={() => setEditingProject(null)} className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-xs">取消</button>
            )}
          </div>
        </form>
      </div>

      {/* 项目列表清单 */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        {/* ✅ 3. 使用安全变量访问 length */}
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 ml-2">管理作品 ({projects.length})</h3>
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-10 text-slate-300 text-xs italic">暂无作品数据</div>
          ) : (
            projects.map(p => (
              <div key={p.id} className={`flex items-center gap-4 p-4 rounded-2xl group border transition-all ${editingProject?.id === p.id ? 'bg-amber-50 border-amber-200 scale-[1.01]' : 'bg-slate-50 border-transparent hover:border-blue-100'}`}>
                {/* ✅ 4. img src 增加 null 检查，防止报错 */}
                <img src={p.cover_image || null} className="w-12 h-12 rounded-lg object-cover bg-slate-200 shadow-sm" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-800 truncate">{p.title}</p>
                  <p className="text-[9px] text-slate-400 truncate mt-0.5">{p.tech_stack}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => { setEditingProject(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2.5 bg-white text-slate-400 hover:text-amber-500 rounded-xl shadow-sm border border-slate-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <form action={deleteProject.bind(null, p.id)}>
                      <button className="p-2.5 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}