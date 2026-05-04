// @ts-nocheck
"use client";

import { useState } from "react";

export default function ProfileEditor({ profile, updateAction }: any) {
  // 安全解析 JSON 数据的辅助函数
  const safeParse = (data: any) => {
    if (!data) return [];
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch (e) {
      return [];
    }
  };

  const [exps, setExps] = useState(() => safeParse(profile?.experience));
  const [edus, setEdus] = useState(() => safeParse(profile?.education));
  const [isSaving, setIsSaving] = useState(false);

  // 动态操作逻辑
  const addExp = () => setExps([...exps, { time: "", role: "", company: "", description: "" }]);
  const addEdu = () => setEdus([...edus, { school: "", degree: "", time: "" }]);
  const removeExp = (index: number) => setExps(exps.filter((_: any, i: number) => i !== index));
  const removeEdu = (index: number) => setEdus(edus.filter((_: any, i: number) => i !== index));

  // ✅ 修复后的提交逻辑：手动处理异步请求
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止默认提交，改为手动处理
    setIsSaving(true);

    // 获取表单原始数据
    const formData = new FormData(e.currentTarget);
    
    // 关键：手动同步 state 中的 JSON 字符串到 formData 中
    formData.set("experience", JSON.stringify(exps));
    formData.set("education", JSON.stringify(edus));

    try {
      // 调用 actions.ts 中的 updateProfile
      const result = await updateAction(formData); 
      
      if (result?.success) {
        alert("✨ 个人资料已更新");
        // 强制刷新页面以获取最新数据（可选）
        window.location.reload(); 
      }
    } catch (err: any) {
      // 这里会弹出 actions.ts 中 throw 的具体错误
      console.error("提交失败:", err);
      alert("保存失败：" + (err.message || "请检查数据库连接"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // 修改 form 的处理方式，去掉 action 属性，改用 onSubmit
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 pb-24 text-slate-700">
      
      {/* --- 1. 形象头像区 --- */}
      <div className="bg-[#F8FAFC] p-8 rounded-[2.5rem] flex items-center gap-8 transition-all hover:shadow-md border border-transparent hover:border-slate-100">
        <div className="relative shrink-0">
          <img 
            src={profile?.avatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"} 
            className="w-24 h-24 rounded-full object-cover shadow-inner bg-white ring-4 ring-white" 
            alt="Avatar" 
          />
          <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white p-1.5 rounded-lg text-[10px] shadow-lg">Edit</div>
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Avatar URL / 头像地址</label>
          <input 
            name="avatar" 
            defaultValue={profile?.avatar} 
            className="w-full bg-white/50 backdrop-blur-sm border-none p-3 rounded-xl text-xs font-mono text-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" 
          />
        </div>
      </div>

      {/* --- 2. 基础信息区 --- */}
      <div className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Full Name / 姓名</label>
          <input 
            name="name" 
            required
            defaultValue={profile?.name} 
            placeholder="输入展示名称..."
            className="w-full p-5 bg-[#F8FAFC] rounded-[1.5rem] border-none text-base font-bold focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Bio / 个人简介</label>
          <textarea 
            name="bio" 
            defaultValue={profile?.bio} 
            placeholder="介绍一下你自己..."
            className="w-full p-6 bg-[#F8FAFC] rounded-[2rem] border-none text-sm leading-relaxed h-36 resize-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Tech Stack / 技术标签</label>
          <input 
            name="skills" 
            defaultValue={profile?.skills} 
            placeholder="Next.js, React, Tailwind (用英文逗号分隔)"
            className="w-full p-5 bg-[#F8FAFC] rounded-[1.5rem] border-none text-sm font-medium focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm" 
          />
        </div>
      </div>

      {/* --- 3. 职业经历 --- */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-6 px-4">
          <h3 className="font-black text-xl tracking-tight text-slate-900">职业经历</h3>
          <button 
            type="button" 
            onClick={addExp}
            className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-full hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
          >
            + ADD EXPERIENCE
          </button>
        </div>
        
        <div className="space-y-6">
          {exps.map((item: any, index: number) => (
            <div key={index} className="bg-[#F8FAFC] p-8 rounded-[2.5rem] space-y-4 relative group border border-transparent hover:border-indigo-100 transition-all shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Timeline / 周期</label>
                  <input 
                    value={item.time} 
                    onChange={(e) => { const n = [...exps]; n[index].time = e.target.value; setExps(n); }}
                    className="w-full p-4 bg-white rounded-2xl border-none text-xs font-bold focus:ring-2 focus:ring-indigo-50" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Position / 职位</label>
                  <input 
                    value={item.role} 
                    onChange={(e) => { const n = [...exps]; n[index].role = e.target.value; setExps(n); }}
                    className="w-full p-4 bg-white rounded-2xl border-none text-xs font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-50" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Organization / 公司</label>
                <input 
                  value={item.company} 
                  onChange={(e) => { const n = [...exps]; n[index].company = e.target.value; setExps(n); }}
                  className="w-full p-4 bg-white rounded-2xl border-none text-xs font-medium" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Achievement / 描述</label>
                <textarea 
                  value={item.description} 
                  onChange={(e) => { const n = [...exps]; n[index].description = e.target.value; setExps(n); }}
                  className="w-full p-4 bg-white rounded-2xl border-none text-xs h-24 resize-none leading-relaxed" 
                />
              </div>
              <button 
                type="button" 
                onClick={() => removeExp(index)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white text-red-400 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- 4. 教育背景 --- */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-6 px-4">
          <h3 className="font-black text-xl tracking-tight text-slate-900">教育背景</h3>
          <button 
            type="button" 
            onClick={addEdu}
            className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-full hover:bg-emerald-600 hover:text-white transition-all active:scale-90"
          >
            + ADD EDUCATION
          </button>
        </div>

        <div className="space-y-6">
          {edus.map((item: any, index: number) => (
            <div key={index} className="bg-[#F8FAFC] p-8 rounded-[2.5rem] space-y-4 relative group border border-transparent hover:border-emerald-100 transition-all shadow-sm">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">University / 学校</label>
                <input 
                  value={item.school} 
                  onChange={(e) => { const n = [...edus]; n[index].school = e.target.value; setEdus(n); }}
                  className="w-full p-4 bg-white rounded-2xl border-none text-xs font-bold" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Degree / 学位</label>
                  <input value={item.degree} onChange={(e) => { const n = [...edus]; n[index].degree = e.target.value; setEdus(n); }} className="w-full p-4 bg-white rounded-2xl border-none text-xs font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Period / 时间</label>
                  <input value={item.time} onChange={(e) => { const n = [...edus]; n[index].time = e.target.value; setEdus(n); }} className="w-full p-4 bg-white rounded-2xl border-none text-xs font-medium" />
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => removeEdu(index)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white text-red-400 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- 5. 提交按钮 --- */}
      <div className="pt-10">
        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm shadow-2xl shadow-indigo-100 hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isSaving ? "SYNCING DATA..." : "SAVE ALL CHANGES"}
        </button>
      </div>

      {/* 保持隐藏字段作为后备数据源 */}
      <input type="hidden" name="experience" value={JSON.stringify(exps)} />
      <input type="hidden" name="education" value={JSON.stringify(edus)} />
    </form>
  );
}