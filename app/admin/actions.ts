"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// ✅ 核心鉴权辅助函数：拦截未登录请求
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  if (!token || token.value !== "authorized") {
    throw new Error("未授权访问，请先登录");
  }
}

/* ================= 1. 个人资料 (Profile) ================= */
export async function updateProfile(formData: FormData) {
  await checkAuth(); // 🔐 权限校验
  try {
    const data = {
      name: formData.get("name") as string,
      bio: formData.get("bio") as string,
      avatar: formData.get("avatar") as string,
      skills: formData.get("skills") as string,
      experience: formData.get("experience") as string,
      education: formData.get("education") as string,
    };
    await prisma.profile.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/about");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/* ================= 2. 作品管理 (Project) ================= */
export async function addProject(formData: FormData) {
  await checkAuth(); // 🔐 权限校验
  try {
    await prisma.project.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        cover_image: formData.get("image") as string,
        tech_stack: formData.get("tags") as string,
        demo_link: formData.get("link") as string,
        github_link: formData.get("github") as string,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateProject(formData: FormData) {
  await checkAuth(); // 🔐 权限校验
  try {
    const id = Number(formData.get("id"));
    await prisma.project.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        cover_image: formData.get("image") as string,
        tech_stack: formData.get("tags") as string,
        demo_link: formData.get("link") as string,
        github_link: formData.get("github") as string,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteProject(id: number) {
  await checkAuth(); // 🔐 权限校验
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/* ================= 3. 博客管理 (Post) ================= */
export async function savePost(formData: FormData) {
  await checkAuth(); // 🔐 权限校验
  try {
    const id = formData.get("id") ? Number(formData.get("id")) : null;
    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      category: formData.get("category") as string,
    };
    if (id) {
      await prisma.post.update({ where: { id }, data });
    } else {
      await prisma.post.create({ data });
    }
    revalidatePath("/blog");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deletePost(id: number) {
  await checkAuth(); // 🔐 权限校验
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/* ================= 4. 评论管理 (Comment) ================= */
export async function approveAllComments() {
  await checkAuth(); // 🔐 权限校验
  try {
    await prisma.comment.updateMany({
      where: { is_approved: false },
      data: { is_approved: true },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    throw new Error("一键审核失败");
  }
}

export async function toggleCommentStatus(id: number, currentStatus: boolean) {
  await checkAuth(); // 🔐 权限校验
  try {
    await prisma.comment.update({
      where: { id },
      data: { is_approved: !currentStatus },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    throw new Error("操作失败");
  }
}

export async function deleteComment(id: number) {
  await checkAuth(); // 🔐 权限校验
  try {
    await prisma.comment.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    throw new Error("删除失败");
  }
}

/* ================= 5. 其他 ================= */
export async function logout() {
  // 清除 cookie 的逻辑可以放在前端或者这里的 API
  redirect("/");
}