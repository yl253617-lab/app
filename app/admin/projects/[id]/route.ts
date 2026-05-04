import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  // 1. 将类型定义中的 params 改为 Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 2. 必须使用 await 先解包 params
    const resolvedParams = await params; 
    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "无效的项目 ID" }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("删除失败:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}