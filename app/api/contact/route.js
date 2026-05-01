import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // 1. 基础校验
    if (!name || !email || !message) {
      return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
    }

    // 2. 配置 QQ 邮箱 Transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.qq.com",
      port: 465,
      secure: true, // 使用 SSL 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. 构建邮件
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`, // 发件人显示格式
      to: process.env.RECEIVER_EMAIL,
      replyTo: email, // 方便你直接回复该留言用户
      subject: `个人站新消息：来自 ${name}`,
      text: `姓名: ${name}\n邮箱: ${email}\n内容: ${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">您有一条新的网站留言</h2>
          <p><strong>发件人:</strong> ${name}</p>
          <p><strong>其邮箱:</strong> ${email}</p>
          <p><strong>内容详情:</strong></p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">${message}</div>
        </div>
      `,
    };

    // 4. 发送
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    // 如果报错，这里会在 Git Bash 打印详细原因
    console.error("QQ邮箱发送失败记录:", error);
    return NextResponse.json({ error: "服务器发送邮件失败" }, { status: 500 });
  }
}