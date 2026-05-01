"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleApproval(id: number, isApproved: boolean) {
  await prisma.comment.update({
    where: { id },
    data: { is_approved: isApproved }
  });
  revalidatePath('/blog/[slug]', 'page'); // 刷新详情页缓存
  revalidatePath('/admin/comments');     // 刷新后台页缓存
}

export async function deleteComment(id: number) {
  await prisma.comment.delete({ where: { id } });
  revalidatePath('/admin/comments');
}