"use client"; //
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button 
      type="button" 
      onClick={() => router.back()} 
      className="px-8 py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl"
    >
      取消
    </button>
  );
}