"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("确定要删除吗？")) return;

    try {
      // 这里的路径必须对应我们上面创建的 API 路由
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("删除成功！");
        router.refresh(); // 刷新页面数据
      } else {
        const errorData = await res.json();
        alert(`删除失败: ${errorData.error}`);
      }
    } catch (error) {
      alert("网络请求异常，请检查后端是否启动");
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:font-bold">
      删除
    </button>
  );
}