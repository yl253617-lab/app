'use client';

import { useState } from 'react';

export default function CommentSection({ postId }: { postId: number }) {
  const [loading, setLoading] = useState(false);

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
      } else {
        alert('提交失败，请重试');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16 pt-10 border-t border-slate-100">
      <h3 className="text-2xl font-black text-slate-900 mb-6">参与讨论</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-slate-50 p-6 rounded-2xl">
        <input 
          name="author" 
          placeholder="您的昵称" 
          required 
          className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <textarea 
          name="content" 
          placeholder="说点什么吧..." 
          required 
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
        >
          {loading ? '提交中...' : '提交评论'}
        </button>
      </form>
    </section>
  );
}