import type { Config } from "tailwindcss";

const config: Config = {
  // 扫描路径，确保样式能应用到所有组件
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 你可以在这里定义开题报告中提到的品牌色
      colors: {
        brand: "#4f46e5", 
      },
    },
  },
  // 引入官方排版插件，这是“专业版”的关键
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;