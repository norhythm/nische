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
      subject: `ポートフォリオサイトからのお問い合わせ${envLabel} - ${
        subject || "(件名なし)"
      } ${name}`,
      html: `
        <div style="font: small / 1.5 Arial, Helvetica, sans-serif;">
          ${
            !isProduction
              ? '<div style="background-color: #fff3cd; color: #856404; padding: 10px; border: 1px solid #ffeaa7; border-radius: 4px; margin-bottom: 20px;"><strong>開発環境テスト</strong> - このメールは開発環境から送信されました。</div>'
              : ""
          }

          お名前: ${name}<br/>
          メールアドレス: ${email}<br/>
          件名: ${subject || "(件名なし)"}<br/><br/>

          メッセージ:<br/>
          ${message}<br/><br/>


          このメールはポートフォリオサイトのお問い合わせフォームから送信されました。
          ${
            !isProduction ? "<br><strong>環境:</strong> 開発環境 (Mailpit)" : ""
          }
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
