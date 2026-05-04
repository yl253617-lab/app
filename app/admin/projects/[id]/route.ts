import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}