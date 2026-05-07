import http from 'k6/http';
import { sleep } from 'k6';

// 压测配置：10 个并发用户，持续轰炸 10 秒
export const options = {
  vus: 10,
  duration: '10s',
};

// 模拟真实用户的行为逻辑
export default function () {
  const url = 'http://localhost:3000/blog';
  
  // 完美伪装成真实的 Chrome 浏览器
  const params = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
  };

  // 发起 GET 请求
  http.get(url, params);
  
  // 每次请求后停顿 0.5 到 1.5 秒（模拟人类阅读停顿，完美绕过防火墙检测）
  sleep(Math.random() + 0.5); 
}