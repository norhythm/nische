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
    const smtpConfig: any = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // TLS用にfalse
    };

    // 本番環境のみ認証を使用
    if (isProduction) {
      smtpConfig.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      };
    }

    const transporter = nodemailer.createTransport(smtpConfig);

    // メール内容
    const envLabel = isProduction ? "" : " [開発環境]";
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL, // 受信メールアドレス
      subject: `ポートフォリオサイトからのお問い合わせ${envLabel} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          ${
            !isProduction
              ? '<div style="background-color: #fff3cd; color: #856404; padding: 10px; border: 1px solid #ffeaa7; border-radius: 4px; margin-bottom: 20px;"><strong>開発環境テスト</strong> - このメールは開発環境から送信されました。</div>'
              : ""
          }

          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            新しいお問い合わせ
          </h2>

          <div style="margin: 20px 0;">
            <p><strong>お名前:</strong> ${name}</p>
            <p><strong>メールアドレス:</strong> ${email}</p>
            <p><strong>件名:</strong> ${subject || "(件名なし)"}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #34495e; margin-bottom: 10px;">メッセージ:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; white-space: pre-wrap;">
${message}
            </div>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #7f8c8d;">
            このメールはポートフォリオサイトのお問い合わせフォームから送信されました。
            ${
              !isProduction
                ? "<br><strong>環境:</strong> 開発環境 (Mailpit)"
                : ""
            }
          </p>
        </div>
      `,
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
