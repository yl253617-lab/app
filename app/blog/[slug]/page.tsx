import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import FadeIn from "@/components/FadeIn";
import CommentForm from "@/components/CommentForm";

type Props = {
  params: Promise<{ slug: string }>;
};

// 开启 ISR
export const revalidate = 3600;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "");
  const post = await prisma.post.findUnique({
    where: { slug: decodedSlug },
    select: { title: true }
  });
  return { title: post ? `${post.title} | 梁永波的博客` : "文章详情" };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");
  
  if (!slug) return notFound();

  const post = await prisma.post.findUnique({
    where: { slug: slug },
    include: {
      comments: {
        where: { is_approved: true }, // 只显示审核通过的
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!post) return notFound();

  // 异步增加浏览量，不阻塞页面渲染
  prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  }).catch(console.error);

  return (
    <main className="min-h-screen pt-40 pb-20 px-6 bg-white">
      <FadeIn>
        <article className="max-w-3xl mx-auto">
          <header className="mb-12 border-b border-slate-100 pb-12">
            <div className="flex items-center gap-4 mb-6 text-sm font-medium">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                {post.category || "技术"}
              </span>
              <time className="text-slate-400">
                {post.created_at?.toLocaleDateString('zh-CN')}
              </time>
              <span className="text-slate-400">· {post.views} 次阅读</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-slate prose-indigo lg:prose-xl max-w-none mb-20">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <hr className="border-slate-100 mb-16" />

          <section className="mb-16">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              全部评论
              <span className="text-sm font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                {post.comments.length}
              </span>
            </h3>

            {post.comments.length === 0 ? (
              <p className="text-slate-400 italic bg-slate-50 p-6 rounded-2xl text-center">
                暂无评论，快来当第一个沙发！
              </p>
            ) : (
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-indigo-600">{comment.author}</span>
                      <time className="text-xs text-slate-300">
                        {new Date(comment.createdAt).toLocaleString('zh-CN')}
                      </time>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <CommentForm postId={post.id} />

          <footer className="mt-20 pt-10 border-t border-slate-100">
            <a href="/blog" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              ← 返回文章列表
            </a>
          </footer>
        </article>
      </FadeIn>
    </main>
  );
}