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

## 本番環境への切り替え（さくらインターネット + Vercel）

### さくらインターネットのSMTP情報

さくらインターネットのメールサーバーを使用します。SMTP接続情報はさくらインターネットのコントロールパネルで確認できます。

| 項目       | 値                                                        |
| ---------- | --------------------------------------------------------- |
| SMTPホスト | `初期ドメイン.sakura.ne.jp`（例: `example.sakura.ne.jp`） |
| ポート     | `587`（STARTTLS）または `465`（SSL/TLS）                  |
| 認証方式   | SMTP AUTH（PLAIN / LOGIN）                                |
| ユーザー名 | メールアドレス全体（例: `info@example.com`）              |
| パスワード | メールアカウントのパスワード                              |

> SMTPホストは、さくらインターネットのサーバーコントロールパネル > メール > メール一覧から確認できます。初期ドメイン（`xxx.sakura.ne.jp`）を使用してください。独自ドメインではなく初期ドメインを指定する点に注意してください。

### 環境変数の設定

#### ローカルで本番SMTP設定をテストする場合

`.env.local`を以下のように更新します：

```env
# さくらインターネット SMTP設定
SMTP_HOST=初期ドメイン.sakura.ne.jp
SMTP_PORT=587
SMTP_USER=info@example.com
SMTP_PASS=メールアカウントのパスワード
SMTP_FROM=info@example.com

# お問い合わせ受信先
CONTACT_EMAIL=受信したいメールアドレス
```

#### Vercelへのデプロイ時

Vercelのダッシュボードで環境変数を設定します。

1. [Vercel Dashboard](https://vercel.com) でプロジェクトを開く
2. **Settings** > **Environment Variables** に移動
3. 以下の環境変数を **Production** 環境に追加する：

| Key             | Value                          | Environment |
| --------------- | ------------------------------ | ----------- |
| `SMTP_HOST`     | `初期ドメイン.sakura.ne.jp`    | Production  |
| `SMTP_PORT`     | `587`                          | Production  |
| `SMTP_USER`     | `info@example.com`             | Production  |
| `SMTP_PASS`     | `メールアカウントのパスワード` | Production  |
| `SMTP_FROM`     | `info@example.com`             | Production  |
| `CONTACT_EMAIL` | `受信したいメールアドレス`     | Production  |

> `SMTP_FROM`と`SMTP_USER`は同じメールアドレスを指定してください。異なるアドレスを指定するとSPF認証に失敗し、迷惑メールとして扱われる可能性があります。

4. 環境変数を設定後、再デプロイする（Settings > Deployments > 最新のデプロイの「...」メニュー > Redeploy）

#### Vercel CLIで設定する場合

```bash
# Vercel CLIがインストールされていない場合
npm i -g vercel

# 環境変数を追加（対話形式）
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add SMTP_FROM
vercel env add CONTACT_EMAIL
```

### 動作確認

1. Vercelにデプロイ後、`https://your-domain/contact/` にアクセス
2. フォームからテストメッセージを送信
3. `CONTACT_EMAIL`に指定したアドレスでメールが届くことを確認

### ポートについて

- **587**（推奨）: STARTTLS。`secure: false`で接続後にTLSへアップグレードされます
- **465**: SSL/TLS。`secure: true`で最初からTLS接続します

APIルート（`app/api/contact/route.ts`）はポート番号に応じて`secure`オプションを自動切り替えします。

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

> Vercelでは`NODE_ENV`はデフォルトで`production`に設定されるため、追加設定は不要です。

### さくらインターネット固有の問題

#### 認証エラー（535 Authentication failed）

- `SMTP_USER`にメールアドレス全体（`user@example.com`）を指定しているか確認
- さくらインターネットのコントロールパネルでメールアカウントのパスワードが正しいか確認
- メールアカウントが有効であることを確認

#### 接続タイムアウト

- `SMTP_HOST`が初期ドメイン（`xxx.sakura.ne.jp`）になっているか確認。独自ドメインでは接続できない場合があります
- ポート番号が正しいか確認（587 または 465）

#### メールが迷惑メールに振り分けられる

- `SMTP_FROM`と`SMTP_USER`が同一のメールアドレスか確認
- さくらインターネットで独自ドメインのSPFレコードが設定されているか確認（DNSに `v=spf1 a:www<数字>.sakura.ne.jp mx ~all` のようなTXTレコードを追加）

## 参考リンク

- [Mailpit GitHub](https://github.com/axllent/mailpit)
- [Mailpit ドキュメント](https://mailpit.axllent.org/)
- [Nodemailer ドキュメント](https://nodemailer.com/)
- [さくらインターネット メール設定](https://help.sakura.ad.jp/mail/)
