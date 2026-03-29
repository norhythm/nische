import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { z } from "zod/v4";

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(254),
  subject: z.string().max(500).optional().default(""),
  message: z.string().min(1).max(5000),
});

// Simple in-memory rate limiting: 5 requests per hour per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Lazy cleanup: remove expired entries when map grows large
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "リクエストが多すぎます。しばらく時間をおいてから再度お試しください。" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Zod validation
    const parseResult = contactSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "全てのフィールドを入力してください" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parseResult.data;

    // メール設定（環境変数から取得）
    const isProduction = process.env.NODE_ENV === "production";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpConfig: SMTPTransport.Options = {
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465, // 465はSSL/TLS、587はSTARTTLS
    };

    // SMTP認証情報が設定されていれば使用
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      smtpConfig.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      };
    }

    const transporter = nodemailer.createTransport(smtpConfig);

    // メール内容
    const envLabel = isProduction ? "" : " [開発環境]";
    const devNotice = !isProduction
      ? "[開発環境テスト] このメールは開発環境から送信されました。\n\n"
      : "";

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `ポートフォリオサイトからのお問い合わせ${envLabel} - ${subject || "(件名なし)"} ${name}`,
      text: `${devNotice}お名前: ${name}\nメールアドレス: ${email}\n件名: ${subject || "(件名なし)"}\n\nメッセージ:\n${message}\n\n---\nこのメールはポートフォリオサイトのお問い合わせフォームから送信されました。`,
    };

    // メール送信
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "メールが正常に送信されました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
