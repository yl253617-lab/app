import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 写入数据库
    const newProject = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        cover_image: body.cover_image,
        tech_stack: body.tech_stack,
        demo_link: body.demo_link,
        github_link: body.github_link,
        sort_order: Number(body.sort_order) || 0,
      },
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("创建作品失败:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}