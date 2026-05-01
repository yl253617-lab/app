'use client';
import { useState } from 'react';

export default function CommentSection({ postId }: { postId: number }) {
  const [form, setForm] = useState({ author: '', content: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('正在提交...');
    
    const res = await fetch('/api/comment', {
      method: 'POST',
      body: JSON.stringify({ postId, ...form }),
    });

    if (res.ok) {
      setForm({ author: '', content: '' });
      setStatus('提交成功！评论将在管理员审核后显示。'); // 对应开题报告流程 
    } else {
      setStatus('提交失败，请重试');
    }
  };

  return (
    <div className="mt-10 p-6 bg-white rounded-xl shadow-sm border">
      <h3 className="text-lg font-bold mb-4">发表评论</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text"
          placeholder="您的昵称"
          className="w-full p-2 border rounded"
          value={form.author}
          onChange={e => setForm({...form, author: e.target.value})}
        />
        <textarea 
          placeholder="说点什么吧..."
          className="w-full p-2 border rounded h-24"
          required
          value={form.content}
          onChange={e => setForm({...form, content: e.target.value})}
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded font-bold">
          提交评论
        </button>
        {status && <p className="text-sm text-indigo-600">{status}</p>}
      </form>
    </div>
  );
}