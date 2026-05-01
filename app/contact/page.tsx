"use client";
import { useState } from "react";
import FadeIn from "@/components/FadeIn";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    _honey: "", // 🌟 亮点 1：隐藏的蜜罐字段
  });

  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🌟 亮点 2：如果蜜罐字段被填写，说明是机器爬虫，直接静默拦截
    if (formData._honey) {
      setStatus({ type: "success", msg: "消息发送成功！" }); // 假装成功，欺骗机器人
      return;
    }

    setStatus({ type: "loading", msg: "正在通过安全通道发送..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 发送给后端时剔除蜜罐字段
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        }), 
      });

      if (response.ok) {
        setStatus({ type: "success", msg: "发送成功！我会尽快回复您的邮件。" });
        setFormData({ name: "", email: "", message: "", _honey: "" }); 
      } else {
        const data = await response.json();
        setStatus({ type: "error", msg: data.error || "发送失败，请稍后重试。" });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "网络连接异常，请检查您的网络设置。" });
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-20 px-6 bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* 左侧：联系方式 */}
            <div>
              <h1 className="text-6xl font-black text-slate-900 mb-8 tracking-tight">
                联系我
              </h1>
              <p className="text-slate-500 text-lg mb-16 leading-relaxed max-w-md">
                我一直对有趣的合作机会保持开放态度。无论是技术探讨、项目合作还是其他事宜，欢迎随时给我发消息！
              </p>
              
              <div className="space-y-8">
                {/* 电话 */}
                <div className="flex items-center gap-6 group cursor-default">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-[1.25rem] flex items-center justify-center font-black text-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-emerald-200">
                    Ph
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-slate-900 font-bold text-lg tracking-wide">187 8818 6346</p>
                  </div>
                </div>
                
                {/* QQ */}
                <div className="flex items-center gap-6 group cursor-default">
                  <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-[1.25rem] flex items-center justify-center font-black text-xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-200">
                    QQ
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Tencent</p>
                    <p className="text-slate-900 font-bold text-lg tracking-wide">230677615</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-6 group cursor-default">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-[1.25rem] flex items-center justify-center font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-indigo-200">
                    Em
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Email</p>
                    <p className="text-slate-900 font-bold text-lg tracking-wide">230677615@qq.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：安全表单 */}
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] space-y-5 shadow-xl shadow-slate-200/50 border border-slate-100">
              
              {/* 隐藏的蜜罐字段，普通用户看不见，机器脚本会自动填写 */}
              <input 
                type="text" 
                name="_honey" 
                value={formData._honey} 
                onChange={handleChange} 
                className="hidden" 
                tabIndex={-1} 
                autoComplete="off" 
              />

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">您的姓名</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold text-slate-700 outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">电子邮箱</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold text-slate-700 outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">消息内容</label>
                <textarea
                  name="message"
                  required
                  placeholder="告诉我您的想法..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold text-slate-700 outline-none transition-all resize-none placeholder:font-medium placeholder:text-slate-300"
                />
              </div>

              {/* 状态反馈 */}
              {status.msg && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold ${status.type === "error" ? "bg-red-50 text-red-600" : status.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"}`}>
                  <svg className={`w-4 h-4 ${status.type === "loading" ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {status.type === "loading" ? (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    ) : status.type === "error" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={status.type === "loading"}
                className={`w-full py-4 mt-2 rounded-2xl font-black tracking-wide transition-all ${
                  status.type === "loading"
                    ? "bg-slate-200 cursor-not-allowed text-slate-400"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-xl shadow-indigo-200 active:translate-y-0"
                }`}
              >
                {status.type === "loading" ? "送信中..." : "发送消息"}
              </button>
            </form>

          </div>
        </FadeIn>
      </div>
    </main>
  );
}