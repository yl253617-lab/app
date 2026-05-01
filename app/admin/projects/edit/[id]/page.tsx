"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

// 定义项目数据类型
interface ProjectData {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  tech_stack: string;
  demo_link: string;
  github_link: string;
  sort_order: number;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. 使用 use() 钩子拆解 Next.js 15 的异步 params
  const { id } = use(params);
  const router = useRouter();
  
  const [formData, setFormData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. 页面加载时抓取旧数据填充表单
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? "作品不存在" : "获取数据失败");
        }
        const data = await res.json();
        setFormData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  // 3. 处理表单提交更新数据
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH", // 对应后端的 PATCH 方法
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("更新成功！");
        router.push("/admin/dashboard");
        router.refresh(); // 强制刷新服务器组件
      } else {
        const result = await res.json();
        alert(`更新失败: ${result.error}`);
      }
    } catch (err) {
      alert("网络请求异常，请检查后端 API");
    }
  };

  // 渲染加载态和错误态
  if (loading) return <div className="pt-32 text-center text-slate-500 font-bold">读取数据库中...</div>;
  if (error) return <div className="pt-32 text-center text-red-500 font-bold">错误: {error}</div>;
  if (!formData) return null;

  return (
    <div className="max-w-3xl mx-auto pt-32 pb-20 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Edit Project.</h1>
        <p className="text-slate-500 font-medium">正在修改项目 ID: {id}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 标题 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase">作品标题</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>

          {/* 技术栈 */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase">技术栈 (用逗号隔开)</label>
            <input
              type="text"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 描述 */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase">详细描述</label>
          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>

        {/* 封面图链接 */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase">封面图片 URL</label>
          <input
            type="text"
            value={formData.cover_image}
            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
            className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-colors shadow-xl shadow-slate-200"
          >
            确认并保存修改内容
          </button>
        </div>
      </form>
    </div>
  );
}