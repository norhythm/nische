import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // バリデーション
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "全てのフィールドを入力してください" },
        { status: 400 }
      );
    }

    // メール設定（環境変数から取得）
    const isProduction = process.env.NODE_ENV === "production";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpConfig: any = {
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
