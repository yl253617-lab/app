"use client";

import { useState } from "react";
import { logout } from "./actions"; // 退出登录可以直接导入
import ProfileEditor from "./ProfileEditor";
import ProjectManager from "./ProjectManager";
import BlogManager from "./BlogManager";

export default function AdminDashboardClient({ 
  profile, 
  initialProjects = [], 
  initialPosts = [], 
  initialComments = [],
  actions // ✅ 接收从 page.tsx 传来的 actions
}: any) {
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    { id: "profile", label: "个人名片", icon: "👤" },
    { id: "projects", label: "作品管理", icon: "🚀" },
    { id: "blog", label: "文章随笔", icon: "✍️" },
    { id: "comments", label: "评论互动", icon: "💬" },
  ];

  return (
    <main className="h-screen w-full bg-[#F8FAFC] flex overflow-hidden font-sans">
      {/* 左侧侧边栏保持不变 */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-50 font-black text-xl text-slate-900">后台管理</div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === item.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-50">
          <form action={logout}>
            <button className="w-full py-3 text-xs font-black text-red-400 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all">
              退出登录
            </button>
          </form>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <section className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          {/* ✅ 修复 1：传递 updateAction */}
          {activeTab === "profile" && (
            <ProfileEditor 
              profile={profile} 
              updateAction={actions.updateProfile} 
            />
          )}
          
          {/* ✅ 修复 2：传递项目管理相关的 Actions */}
          {activeTab === "projects" && (
            <ProjectManager 
              initialProjects={initialProjects} 
              addProject={actions.addProject}
              updateProject={actions.updateProject}
              deleteProject={actions.deleteProject}
            />
          )}
          
          {/* ✅ 修复 3：传递博客管理相关的 Actions */}
          {activeTab === "blog" && (
            <BlogManager 
              posts={initialPosts} 
              savePost={actions.savePost}
              deletePost={actions.deletePost}
            />
          )}

          {/* ✅ 修复 4：评论互动直接使用 actions 里的函数 */}
          {activeTab === "comments" && (
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-black text-slate-800">所有评论 ({initialComments.length})</h3>
                <form action={actions.approveAllComments}>
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg">一键通过</button>
                </form>
              </div>
              <div className="space-y-4">
                {initialComments.map((c: any) => (
                  <div key={c.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between mb-2 text-xs font-black">
                      <span>{c.author} <span className="text-slate-300 font-normal">于 {c.post?.title}</span></span>
                      <span className={c.is_approved ? 'text-green-600' : 'text-amber-600'}>{c.is_approved ? '已公开' : '待审核'}</span>
                    </div>
                    <p className="text-xs text-slate-500 italic mb-4">"{c.content}"</p>
                    <div className="flex gap-4 text-[10px] font-bold">
                      <form action={actions.toggleCommentStatus.bind(null, c.id, c.is_approved)}>
                        <button className="text-indigo-600 underline">转换状态</button>
                      </form>
                      <form action={actions.deleteComment.bind(null, c.id)}>
                        <button className="text-red-400 underline">删除</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}