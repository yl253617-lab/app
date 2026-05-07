import { PrismaClient } from '@prisma/client'

// 1. 定义一个创建实例的工厂函数
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// 2. 获取该实例的类型
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// 3. 将 globalThis 转换为一个包含 prisma 属性的对象，避免直接使用 declare global 导致的冲突
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// 4. 优先使用全局缓存的实例，如果没有则创建新实例并导出
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

// 5. 在非生产环境下，将实例挂载到全局对象，防止 Next.js 热更新导致连接池溢出
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma