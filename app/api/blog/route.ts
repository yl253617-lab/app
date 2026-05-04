import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const posts = await prisma.post.findMany({
      where: {
        is_published: true,
        // 如果 URL 有 category 参数就过滤，没有就查全部
        ...(category && category !== "全部" ? { category } : {}),
      },
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "获取博客失败" }, { status: 500 });
  }
}