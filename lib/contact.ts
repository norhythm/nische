import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, message, recaptchaToken, honeypot } = req.body;

    // Honeypotフィールドが埋まっていたらスパムとしてリジェクト
    if (honeypot) {
      return res.status(400).json({ error: "スパムが検出されました。" });
    }

    // reCAPTCHAが導入されている場合、トークンの検証を実行
    if (recaptchaToken) {
      const verificationResponse = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        }
      );
      const verificationResult = await verificationResponse.json();

      if (!verificationResult.success) {
        return res.status(400).json({ error: "reCAPTCHA検証に失敗しました。" });
      }
    }

    // Nodemailerの設定
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_RECEIVER,
        subject: `お問い合わせ：${name}`,
        text: `名前: ${name}\nメールアドレス: ${email}\nメッセージ:\n${message}`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("メール送信エラー:", error);
      res.status(500).json({ error: "メール送信に失敗しました。" });
    }
  } else {
    res.status(405).json({ error: "メソッドが許可されていません。" });
  }
}
