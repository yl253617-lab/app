const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('正在开始填充数据库数据...')

  // ==========================================
  // 1. 批量添加博客文章 (模型名: post)
  // ==========================================
  const posts = [
    {
      title: '深入理解 Next.js 渲染架构：从 CSR 到 SSR 与 ISR 的演进',
      slug: 'nextjs-rendering-architecture-ssr-isr',
      excerpt: '探讨传统 React 单页应用首屏加载的痛点，并解析 Next.js 如何通过混合渲染架构实现性能与 SEO 的双赢。',
      content: '## 传统 CSR 的困境\n传统的 React 应用主要采用客户端渲染 (CSR)。浏览器下载一个空的 HTML 壳和庞大的 bundle.js，然后由 JS 引擎动态生成 DOM。这种模式导致了极高的总阻塞时间 (TBT) 和糟糕的 SEO 表现。\n\n## Next.js 的破局之道\nNext.js 提供了更加细粒度的渲染策略：SSR 和 ISR。在本系统中，我采用了 ISR 架构，在保障极佳的 LCP 首屏响应的同时，极大降低了数据库的瞬时读取压力。',
      is_published: true,
    },
    {
      title: '记一次 Serverless 环境下的 Prisma 连接池溢出 Bug 排查',
      slug: 'prisma-connection-pool-fix-on-vercel',
      excerpt: '部署到 Vercel 后遭遇 Too many connections 报错？本文带你通过 Node.js 全局单例模式根治数据库连接泄露。',
      content: '最近将个人博客部署到 Vercel 后，频繁遇到 Too many connections 报错。原因是 Next.js 开发环境的热模块替换 (HMR) 机制导致 PrismaClient 被频繁重复实例化。使用 globalThis 对象实现单例模式可以有效解决该问题。',
      is_published: true,
    },
    {
      title: '使用 Tailwind CSS 重构 UI 层的思考',
      slug: 'refactoring-with-tailwindcss',
      excerpt: '为什么放弃传统的 CSS Module 和 Sass？原子化 CSS 是如何提升前端工程开发效率的。',
      content: '在项目中全面舍弃传统 CSS 预处理器，转向 Tailwind CSS。原子化 CSS 带来了样式的可预测性与无上下文依赖，配合 Next.js 的 PostCSS 摇树优化，极大优化了网络传输性能。',
      is_published: true,
    }
  ]

  for (const p of posts) {
    // 使用 upsert 防止重复运行脚本时报错
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }

  // ==========================================
  // 2. 批量添加作品集项目 (模型名: project)
  // ==========================================
  const projects = [
    {
      title: '基于 Next.js 的全栈个人作品集与博客系统',
      tech_stack: 'Next.js 16, React, Prisma, MySQL, Tailwind CSS', 
      description: '作为本科毕业设计开发的一套现代化全栈 Web 应用。采用 Next.js 混合渲染架构，配合 Prisma ORM 进行数据持久化。',
      cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 
      is_featured: true,
    },
    {
      title: '高校学生信息管理系统 (后端 API 服务)',
      tech_stack: 'Java, Spring Boot, MyBatis, Redis, MySQL',
      description: '独立设计与实现的 RESTful API 后端服务。实现了学生学籍信息的增删改查、多角色权限控制（RBAC）以及基于 Redis 的热点数据缓存。',
      cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
      is_featured: true,
    },
    {
      title: '极简风自适应响应式电商前端',
      tech_stack: 'Vue 3, TypeScript, Vite, Pinia',
      description: '采用 Vue 3 组合式 API 开发的现代化电商前端界面。实现了复杂的购物车逻辑、商品 SKU 联动选择与前端骨架屏加载状态。',
      cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      is_featured: false,
    }
  ]

  // 先清空旧项目，避免重复插入导致数据越来越长
  await prisma.project.deleteMany({})
  for (const p of projects) {
    await prisma.project.create({ data: p })
  }

  // ==========================================
  // 3. 填充你的个人主页资料 (模型名: Profile)
  // ==========================================
  
  // 将 JSON 数组转换成字符串存入数据库
  const educationData = JSON.stringify([
    {
      degree: '工学学士，计算机科学与技术',
      school: '昆明学院',
      year: '2022 - 2026',
      description: '主修软件工程、数据结构、计算机网络等核心课程。本次毕业设计在石栋老师的悉心指导下，完成了这套基于 Next.js 的全栈系统开发。虽然在工程实践上还有许多青涩之处，但在此过程中对现代 Web 底层架构有了更直观的体悟。'
    }
  ]);

  const experienceData = JSON.stringify([
    {
      role: '全栈开发实践者 (毕业设计)',
      company: '个人独立项目',
      year: '2025.12 - 2026.05',
      description: '独立负责该博客与作品集系统的全后端设计与实现。在开发过程中，亲自踩过了 Vercel 部署路由报错、跨国网络延迟排查，以及 Prisma 在热更新下并发连接耗尽等诸多真实的工程“坑”，逐步将书本上的理论知识落地到了一行行实际代码中。'
    },
    {
      role: '前端开发 (课程设计)',
      company: '计科2班协作项目',
      year: '2024.09 - 2025.01',
      description: '与同学们协作完成了一系列基础的 Web 数据管理系统，熟练掌握了 React 组件化开发思想与团队 Git 分支协作流程，为本次独立的完整全栈开发打下了坚实的代码基础。'
    }
  ]);

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      name: '梁永波',
      bio: '你好！我是一名即将毕业的计科专业学生。作为一名还在不断摸索的全栈开发“小白”，这是我亲手搭建的第一个相对完整的线上 Web 应用。虽然我的代码逻辑可能还有些青涩，但我对探索未知的技术世界始终充满热情与敬畏。',
      skills: 'Next.js, React, TypeScript, MySQL, Prisma ORM, Tailwind CSS',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop',
      experience: experienceData,
      education: educationData
    },
    create: {
      id: 1,
      name: '梁永波',
      bio: '你好！我是一名即将毕业的计科专业学生。作为一名还在不断摸索的全栈开发“小白”，这是我亲手搭建的第一个相对完整的线上 Web 应用。虽然我的代码逻辑可能还有些青涩，但我对探索未知的技术世界始终充满热情与敬畏。',
      skills: 'Next.js, React, TypeScript, MySQL, Prisma ORM, Tailwind CSS',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop',
      experience: experienceData,
      education: educationData
    }
  })

  console.log('数据库填充完成！✅ 网站现在是精装房了！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })