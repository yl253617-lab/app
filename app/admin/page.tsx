import { prisma } from "@/lib/prisma";
// ✅ 导入所有需要的 Actions
import { 
  updateProfile, 
  addProject, 
  updateProject, 
  deleteProject,
  savePost,
  deletePost,
  approveAllComments, 
  toggleCommentStatus, 
  deleteComment 
} from "./actions";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
  const [profile, projects, posts, comments] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.project.findMany({ orderBy: { id: "desc" } }),
    prisma.post.findMany({ orderBy: { id: "desc" } }),
    prisma.comment.findMany({ 
      include: { post: true }, 
      orderBy: { id: "desc" } 
    }),
  ]);

  return (
    <AdminDashboardClient 
      profile={profile} 
      initialProjects={projects || []} 
      initialPosts={posts || []} 
      initialComments={comments || []}
      // ✅ 将函数作为 Props 传递
      actions={{
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        savePost,
        deletePost,
        approveAllComments,
        toggleCommentStatus,
        deleteComment
      }}
    />
  );
}