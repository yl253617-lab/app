import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 统一处理 Params 的类型定义
type Props = {
  params: Promise<{ id: string }>;
};

// 1. 获取单个项目数据 (供编辑页面使用)
export async function GET(request: Request, { params }: Props) {
  try {
    const { id } = await params; // 必须 await params
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });
    if (!project) return NextResponse.json({ error: "未找到项目" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

// 2. 更新项目内容
export async function PATCH(request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await prisma.project.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

// 3. 删除项目 (解决“无效ID”问题)
export async function DELETE(request: Request, { params }: Props) {
  try {
    const { id } = await params; // 必须 await 才能解构出真正的 id
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "无效的 ID 格式" }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "数据库操作失败" }, { status: 500 });
  }
}