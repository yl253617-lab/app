"use client";

import { useState } from "react";
import { savePost, deletePost } from "./actions";

// ✅ 修复 1：通过解构赋值设置默认值 posts = []，防止 initial render 崩溃
export default function BlogManager({ posts = [] }: { posts: any[] }) {
  const [editingPost, setEditingPost] = useState<any>(null);

  // ✅ 修复 2：二次防御，确保在渲染逻辑中始终处理数组
  const safePosts = Array.isArray(posts) ? posts : [];

  // 辅助函数：将标题转换为 URL 友好的 slug (用于留空时的自动生成)
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 mt-8">
      <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-indigo-600">
        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span> 文章管理
      </h2>

      {/* 文章编辑/发布表单 */}
      <form 
        action={async (formData) => {
          // 如果是新文章且没有手动输入 slug，则根据标题自动生成
          if (!formData.get("slug")) {
            const title = formData.get("title") as string;
            formData.append("slug", generateSlug(title) || `post-${Date.now()}`);
          }
          await savePost(formData);
          setEditingPost(null);
        }} 
        className="space-y-4 mb-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100"
      >
        {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">文章标题</label>
            <input 
              name="title" 
              defaultValue={editingPost?.title} 
              placeholder="输入标题..." 
              required 
              className="w-full p-4 bg-white rounded-2xl border-none text-sm focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">分类</label>
            <input 
              name="category" 
              defaultValue={editingPost?.category || "技术"} 
              placeholder="如：Next.js" 
              className="w-full p-4 bg-white rounded-2xl border-none text-sm focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">自定义链接 (Slug)</label>
          {/* ✅ 关键修改点：添加 pattern 和 title 属性用于测试拦截 */}
          <input 
            name="slug" 
            defaultValue={editingPost?.slug} 
            placeholder="my-first-post (留空则自动生成)" 
            pattern="^[a-z0-9-]+$"
            title="Slug 只能包含小写字母、数字和连字符（例如: my-blog-post）"
            className="w-full p-4 bg-white rounded-2xl border-none text-sm font-mono focus:ring-2 focus:ring-indigo-500" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">正文内容 (Markdown)</label>
          <textarea 
            name="content" 
            defaultValue={editingPost?.content} 
            placeholder="使用 Markdown 编写..." 
            required 
            className="w-full p-4 bg-white rounded-2xl border-none text-sm h-64 font-mono focus:ring-2 focus:ring-indigo-500" 
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
            {editingPost ? "更新文章" : "发布随笔"}
          </button>
          {editingPost && (
            <button type="button" onClick={() => setEditingPost(null)} className="px-8 py-4 bg-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-300 transition-all">
              取消
            </button>
          )}
        </div>
      </form>

      {/* 文章列表 */}
      <div className="space-y-3">
        {safePosts.length === 0 ? (
          <div className="text-center py-10 text-slate-300 text-xs italic bg-slate-50 rounded-2xl border border-dashed">
            暂无文章数据
          </div>
        ) : (
          safePosts.map(post => (
            <div key={post.id} className="flex items-center justify-between p-5 bg-white border border-slate-50 rounded-[1.5rem] hover:border-indigo-100 hover:shadow-md transition-all group">
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-md uppercase">{post.category}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : '未知日期'}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">/{post.slug}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                <button 
                  onClick={() => {
                    setEditingPost(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="px-4 py-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                >
                  编辑
                </button>
                <button 
                  onClick={async () => {
                    if(confirm("确定要删除这篇文章吗？")) {
                      await deletePost(post.id);
                    }
                  }} 
                  className="px-4 py-2 text-[10px] font-bold text-red-400 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}