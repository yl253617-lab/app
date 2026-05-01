"use client";

import { motion } from "framer-motion";

export default function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // 初始状态：透明且向下偏移 20px
      whileInView={{ opacity: 1, y: 0 }} // 当进入视口时：不透明且回到原位
      viewport={{ once: true }} // 只在第一次滑到时触发动画
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.21, 0.47, 0.32, 0.98] // 优雅的贝塞尔曲线
      }}
    >
      {children}
    </motion.div>
  );
}