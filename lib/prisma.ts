import { PrismaClient } from '@prisma/client'

// 为了防止开发模式下热重载导致创建多个 Prisma 实例
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // 开启日志，方便你在终端看到 SQL 查询过程，调试毕设利器
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma