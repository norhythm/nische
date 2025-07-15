# ローカルメールテストガイド

このプロジェクトでは、Mailpitを使用してローカル環境でメール送信機能をテストできます。

## セットアップ

### 1. Mailpitのインストール

```bash
# Homebrew経由でインストール
brew install mailpit

# または、公式サイトからダウンロード
# https://github.com/axllent/mailpit
```

### 2. 環境設定

プロジェクトルートに`.env.local`ファイルが作成されています。開発環境用の設定が含まれています：

```env
# Development environment - using Mailpit for local mail testing
NODE_ENV=development

# Mailpit SMTP Configuration (for local testing)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test@example.com
SMTP_PASS=password
SMTP_FROM=test@example.com

# Contact form recipient (for local testing)
CONTACT_EMAIL=recipient@example.com
```

## 使用方法

### 1. Mailpitの起動

ターミナルで以下のコマンドを実行してMailpitを起動します：

```bash
# 通常起動
npm run mail:start

# または、詳細ログ付きで起動
npm run mail:dev

# または、直接コマンドで起動
mailpit
```

Mailpitが正常に起動すると、以下のような出力が表示されます：

```
[MAILPIT] 2024/07/15 15:30:00 [INFO] Starting Mailpit
[MAILPIT] 2024/07/15 15:30:00 [INFO] SMTP server listening on 0.0.0.0:1025
[MAILPIT] 2024/07/15 15:30:00 [INFO] HTTP server listening on 0.0.0.0:8025
```

### 2. Next.jsアプリケーションの起動

別のターミナルで開発サーバーを起動します：

```bash
npm run dev
```

### 3. メール送信テスト

1. ブラウザで `http://localhost:3000/contact` にアクセス
2. コンタクトフォームに情報を入力
3. 「Send Message」ボタンをクリック

### 4. 送信されたメールの確認

1. ブラウザで `http://localhost:8025` にアクセス
2. Mailpitのwebインターフェースが表示されます
3. 送信されたメールが一覧に表示されます
4. メールをクリックすると内容を確認できます

## Mailpitの機能

### Webインターフェース

- **URL**: `http://localhost:8025`
- **機能**:
  - 送信されたメールの一覧表示
  - メール内容の詳細表示（HTML/テキスト）
  - 添付ファイルの表示
  - メールの検索・フィルタリング
  - レスポンシブ対応

### APIエンドポイント

- **メール一覧**: `GET http://localhost:8025/api/v1/messages`
- **メール詳細**: `GET http://localhost:8025/api/v1/message/{id}`
- **全メール削除**: `DELETE http://localhost:8025/api/v1/messages`

## 本番環境への切り替え

本番環境でメール送信を使用する場合は、`.env.local`ファイルを以下のように更新します：

```env
NODE_ENV=production

# Gmail SMTP Configuration (for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Contact form recipient
CONTACT_EMAIL=recipient@example.com
```

## トラブルシューティング

### Mailpitが起動しない場合

```bash
# ポート1025が使用中の場合、別のポートを使用
mailpit --smtp=localhost:1026

# 設定を確認
mailpit --help
```

### メールが送信されない場合

1. Mailpitが正常に起動していることを確認
2. `.env.local`の設定が正しいことを確認
3. Next.jsアプリケーションを再起動
4. ブラウザの開発者ツールでネットワークエラーを確認

### 開発環境の判定

APIルートでは`NODE_ENV`環境変数を使用して開発環境を判定しています：

- `NODE_ENV=development`: Mailpit使用（認証なし）
- `NODE_ENV=production`: 本番SMTP使用（認証あり）

## 参考リンク

- [Mailpit GitHub](https://github.com/axllent/mailpit)
- [Mailpit ドキュメント](https://mailpit.axllent.org/)
- [Nodemailer ドキュメント](https://nodemailer.com/)