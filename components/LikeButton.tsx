'use client';
import { useState } from 'react';

export default function LikeButton({ id, initialLikes }: { id: number, initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return; // 防抖，防止疯狂连击
    setIsLiking(true);
    
    // 乐观更新：先在前端 +1，让用户感觉系统瞬间响应
    setLikes(prev => prev + 1);

    try {
      const res = await fetch(`/api/projects/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes); // 最终以后端的真实数据为准校准
      } else {
        setLikes(prev => prev - 1); // 如果服务器报错，数字回退
      }
    } catch (error) {
      setLikes(prev => prev - 1); // 网络异常，数字回退
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button 
      onClick={handleLike} 
      disabled={isLiking}
      className="flex items-center gap-2 text-pink-500 hover:scale-110 active:scale-95 transition-transform"
    >
      <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
      </svg>
      <span className="font-bold">{likes}</span>
    </button>
  );
}