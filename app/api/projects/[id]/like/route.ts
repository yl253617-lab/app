import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 适配 Next.js 15 的异步 params
  const { id } = await params;
  const projectId = parseInt(id);

  if (isNaN(projectId)) {
    return NextResponse.json({ error: "无效的项目 ID" }, { status: 400 });
  }

  try {
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { likes: { increment: 1 } },
    });
    return NextResponse.json({ likes: updated.likes });
  } catch (error) {
    console.error("点赞更新失败:", error);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}