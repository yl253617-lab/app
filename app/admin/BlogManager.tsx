"use client";

import { useState } from "react";
import { savePost, deletePost } from "./actions";

export default function BlogManager({ posts = [] }: { posts: any[] }) {
  const [editingPost, setEditingPost] = useState<any>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const safePosts = Array.isArray(posts) ? posts : [];

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // ✅ 改用标准的 onSubmit 处理函数，彻底接管表单
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🛑 阻止浏览器默认提交行为
    setSlugError(null); // 每次点击重置错误状态

    const formData = new FormData(e.currentTarget);
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;

    // ======= TC-24 边界拦截逻辑 =======
    const slugRegex = /^[a-z0-9-]+$/;
    // 只要有输入内容，且不符合正则，立刻拦截
    if (slug && !slugRegex.test(slug)) {
      setSlugError("❌ 拦截成功：SLUG 格式非法！只能包含小写字母、数字和连字符(-)。");
      return; 
    }
    // =====================================

    if (!slug) {
      formData.set("slug", generateSlug(title) || `post-${Date.now()}`);
    }

    try {
      await savePost(formData);
      setEditingPost(null);
      // 清空表单
      (e.target as HTMLFormElement).reset();
      alert("✨ 文章已发布并同步至数据库");
    } catch (err: any) {
      setSlugError("数据库连接失败，或者 Slug 已存在");
    }
  };

  return (
    <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 mt-8">
      <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-indigo-600">
        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span> 文章管理
      </h2>

      {/* ✅ 这里改成了 onSubmit */}
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 mb-10 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100"
      >
        {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-wider">文章标题 (必填)</label>
            <input 
              name="title" 
              defaultValue={editingPost?.title} 
              placeholder="输入标题..." 
              required 
              className="w-full p-4 bg-white rounded-2xl border border-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-wider">分类</label>
            <input 
              name="category" 
              defaultValue={editingPost?.category || "技术"} 
              placeholder="技术" 
              className="w-full p-4 bg-white rounded-2xl border border-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-wider">自定义链接 (SLUG)</label>
          <input 
            name="slug" 
            defaultValue={editingPost?.slug} 
            placeholder="my-first-post (留空则自动生成)" 
            className={`w-full p-4 bg-white rounded-2xl border-2 text-sm font-mono transition-all outline-none ${slugError ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:ring-2 focus:ring-indigo-500'}`} 
          />
          {slugError && <p className="text-[10px] text-red-500 font-bold ml-2 animate-bounce">{slugError}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-wider">正文内容 (MARKDOWN) (必填)</label>
          <textarea 
            name="content" 
            defaultValue={editingPost?.content} 
            placeholder="使用 Markdown 编写..." 
            required 
            className="w-full p-4 bg-white rounded-2xl border border-slate-100 text-sm h-72 font-mono focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none" 
          />
        </div>
        
        <button type="submit" className="w-full py-5 bg-[#121826] text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-indigo-600 transition-all active:scale-[0.98] mt-4">
          {editingPost ? "更新文章内容" : "发布随笔"}
        </button>
      </form>

      {/* 底部列表保持原样 */}
      <div className="space-y-3">
        {safePosts.map(post => (
          <div key={post.id} className="flex items-center justify-between p-5 bg-slate-50 border border-transparent hover:border-indigo-100 rounded-2xl transition-all group">
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-slate-800">{post.title}</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Slug: /{post.slug}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={() => {setEditingPost(post); window.scrollTo({top:0, behavior:'smooth'})}} className="px-4 py-2 bg-white text-indigo-600 text-[10px] font-bold rounded-xl border border-indigo-100 shadow-sm">编辑</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}