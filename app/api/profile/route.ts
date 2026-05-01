import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: 1 },
    });
    // 如果没有数据，返回包含所有字段的空对象，防止前端解析失败
    return NextResponse.json(profile || { name: "", bio: "", avatar: "", skills: "" });
  } catch (error) {
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // upsert 逻辑：必须包含模型定义的所有非空字段
    const updated = await prisma.profile.upsert({
      where: { id: 1 },
      update: {
        name: body.name || "未命名",
        bio: body.bio || "",
        avatar: body.avatar || "",
        skills: body.skills || "", // 必填字段修复
      },
      create: {
        id: 1,
        name: body.name || "新用户",
        bio: body.bio || "",
        avatar: body.avatar || "",
        skills: body.skills || "", // 必填字段修复
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json({ error: "数据库同步失败，请检查字段是否齐全" }, { status: 500 });
  }
}