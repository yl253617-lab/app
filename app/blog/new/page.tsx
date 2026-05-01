import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function NewBlogPage() {
  async function createPost(formData: FormData) {
    "use server";
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const category = formData.get("category")?.toString() || "技术";

    if (!title || !content) return;

    await prisma.post.create({ data: { title, content, category } });
    revalidatePath("/blog");
    redirect("/admin/dashboard");
  }

  return (
    <main className="pt-32 px-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8">撰写新博客</h1>
      <form action={createPost} className="space-y-6">
        <input name="title" placeholder="文章标题" required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none" />
        <input name="category" placeholder="分类 (如：Next.js, UI设计)" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none" />
        <textarea name="content" placeholder="支持使用 Markdown 格式编写内容..." rows={12} required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none" />
        <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl">立即发布</button>
      </form>
    </main>
  );
}