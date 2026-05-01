import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, author, content } = body;

    // 参数校验
    if (!postId || !author || !content) {
      return NextResponse.json({ error: "必填字段缺失" }, { status: 400 });
    }

    // 在数据库中创建评论记录
    const newComment = await prisma.comment.create({
      data: {
        post_id: Number(postId), // 确保 postId 是数字
        author: author,
        content: content,
        is_approved: true,      // 默认需要管理员审核
      },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("提交评论失败:", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}