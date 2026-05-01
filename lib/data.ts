// lib/data.ts
import { prisma } from "@/lib/prisma"; // 确保你之前创建了 prisma 客户端文件

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'desc' }, // 按权重排序
    });
    return projects;
  } catch (error) {
    console.error("数据库读取失败:", error);
    return [];
  }
}