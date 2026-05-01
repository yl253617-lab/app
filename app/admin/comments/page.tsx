"use client";
import { useEffect, useState } from "react";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);

  // 获取所有评论
  const fetchComments = async () => {
    const res = await fetch("/api/admin/comments"); // 注意：你需要额外写一个 GET 接口获取全部评论，或者直接写在 Server Component 里
    const data = await res.json();
    setComments(data);
  };

  // 实际上为了简单，我们直接用 Server Action 或在页面初始化时加载
  // 这里演示核心逻辑：
  const handleApprove = async (id: number, currentStatus: boolean) => {
    await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_approved: !currentStatus }),
    });
    window.location.reload(); // 简单粗暴刷新页面
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除吗？")) return;
    await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  // 假设我们通过服务器组件传入初始数据，这里仅展示 UI 结构
  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black mb-10">评论管理后台</h1>
      
      <div className="grid gap-4">
        {/* 这里通常会 map 你的评论数据 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-slate-900">张三</span>
              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded-full">待审核</span>
            </div>
            <p className="text-slate-600">这篇文章写得真不错！</p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => {}} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">通过审核</button>
            <button onClick={() => {}} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold">删除</button>
          </div>
        </div>
      </div>
    </div>
  );
}