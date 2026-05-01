'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ 引入 useRouter

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ 实例化 router

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      postId,
      author: formData.get('author'),
      content: formData.get('content'),
    };

    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('提交成功！评论将在后台审核后显示。');
        (e.target as HTMLFormElement).reset();
        
        // ✅ 核心：触发 Next.js 的服务器组件刷新，如果评论不需要审核就能立即在页面上渲染出来
        router.refresh(); 
      } else {
        const errorData = await res.json();
        alert(`提交失败: ${errorData.error || '请重试'}`);
      }
    } catch (err) {
      console.error('Submit Error:', err);
      alert('网络异常，请稍后再试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16 pt-10 border-t border-slate-100">
      <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">参与讨论</h3>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <label htmlFor="author" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
            您的昵称
          </label>
          <input
            id="author"
            name="author"
            type="text"
            placeholder="例如：技术爱好者"
            required
            className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
            评论内容
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="写下你的想法..."
            required
            rows={5}
            className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all
            ${loading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-indigo-100'
            }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在提交...
            </>
          ) : (
            '发布评论'
          )}
        </button>
      </form>
    </section>
  );
}