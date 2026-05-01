"use client"; // 必须声明为客户端组件，因为使用了表单提交和 window.location

import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  // 这里粘贴你提供的那段 handleSubmit 函数
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      cover_image: formData.get("cover_image"), 
      tech_stack: formData.get("tech_stack"),
      demo_link: formData.get("demo_link"),
      github_link: formData.get("github_link"),
      sort_order: 0
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("发布成功！");
      // 建议使用 router.push 而不是 window.location 以获得更好的性能
      router.push("/admin/dashboard");
      router.refresh(); 
    }
  }

  return (
    <div className="max-w-2xl mx-auto pt-32 px-6"> {/* 使用 pt-32 解决导航栏遮挡 */}
      <h1 className="text-3xl font-black mb-8">发布新作品</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 注意：input 的 name 属性必须与 formData.get() 中的参数对应 */}
        <input name="title" placeholder="项目标题" required className="w-full p-3 border rounded" />
        <textarea name="description" placeholder="项目描述" className="w-full p-3 border rounded" />
        <input name="cover_image" placeholder="封面图片链接" className="w-full p-3 border rounded" />
        <input name="tech_stack" placeholder="技术栈 (如: Next.js, MySQL)" className="w-full p-3 border rounded" />
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded">
          提交发布
        </button>
      </form>
    </div>
  );
}