import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 审核通过/取消通过
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await prisma.comment.update({
      where: { id: Number(id) },
      data: { is_approved: body.is_approved },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}

// 删除评论
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.comment.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}