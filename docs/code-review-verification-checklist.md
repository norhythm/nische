# Code Review Verification Checklist

コードレビュー Round 1 + Round 2 の修正を開発環境で検証するチェックリスト。
`pnpm dev` でdevサーバーを起動してから確認を開始してください。

---

## 1. セキュリティ

> 対象: CR-C1, CR-C2, CR2-C1, CR2-C2, CR2-I1

### ブラウザ確認

- [ ] Works詳細ページを開き、markdownコンテンツが正常にレンダリングされている
- [ ] YouTube埋め込みがあるページで、iframe が正しく表示される
- [ ] Contact form: 全フィールド空のまま送信 → バリデーションエラーが返る
- [ ] Contact form: メールアドレスに `abc` など不正値を入力して送信 → エラーが返る
- [ ] Contact form: 全フィールドを正しく入力して送信 → 成功メッセージが表示される

### コード確認

- [ ] `lib/markdownToHtml.ts`: rehype パイプラインに `rehype-sanitize` が含まれている
- [ ] `lib/markdownToHtml.ts`: iframe の src が許可ドメイン（youtube.com, youtube-nocookie.com, soundcloud.com, spotify.com, music.apple.com）に制限されている
- [ ] `lib/markdownToHtml.ts`: `"*"` ワイルドカードの attributes に `style` が含まれていない
- [ ] `app/api/contact/route.ts`: リクエストボディが Zod スキーマでバリデーションされている
- [ ] `app/api/contact/route.ts`: rate limiter が実装されている
- [ ] `app/api/contact/route.ts`: `smtpConfig` が `SMTPTransport.Options` 等で正しく型付けされている（`any` でない）
- [ ] `app/api/contact/route.ts`: rateLimitMap のエントリが一定条件で削除される（メモリリーク防止）

---

## 2. ナビゲーション & インタラクション

> 対象: CR-I1, CR-I2, CR-I3, CR-I10

### ブラウザ確認

- [ ] Works詳細ページ: 左矢印キー → 前の作品へ遷移する
- [ ] Works詳細ページ: 右矢印キー → 次の作品へ遷移する
- [ ] Works詳細ページ: DevToolsでスクリーンリーダー用テキストを確認し、左が「前」、右が「次」になっている
- [ ] Contact form: input にフォーカスした状態で左右矢印キー → ページ遷移が**発生しない**
- [ ] DevTools モバイルモード: Works詳細ページで縦方向にスクロール → 横ナビゲーションが**発火しない**
- [ ] DevTools モバイルモード: Works詳細ページで明確に横スワイプ → 前後のworkに遷移する

### コード確認

- [ ] `components/keyboard-navigation.tsx`: `handleKeyDown` に input/textarea/contentEditable のガード処理がある
- [ ] `components/keyboard-navigation.tsx`: タッチ判定に `Math.abs(diffX) > 2 * Math.abs(diffY)` 相当の水平判定がある

---

## 3. Works詳細ページ & 表示

> 対象: CR-I4, CR2-I5, CR2-I9, CR2-M1, CR-M1

### ブラウザ確認

- [ ] トップページ: 複数のwork画像が全て正しくクリッピング表示されている（一部だけ画像が欠けたりしていない）
- [ ] トップページ: work画像にマウスホバーした際のtiltエフェクトがスムーズに動作する（カクつきがない）
- [ ] Works詳細ページ: DevToolsのElementsで `<h1>` タグが **1つだけ** であることを確認

### コード確認

- [ ] `components/tiltImage.tsx`: clipPath の ID が `useId()` で生成されている
- [ ] `components/tiltImage.tsx`: mousemove ハンドラが ref 経由の DOM 操作で実装されている（`setState` / `setTransform` を使っていない）
- [ ] `components/tiltImage.tsx`: `blendMode` / `setBlendMode` の state が存在しない

---

## 4. アクセシビリティ

> 対象: CR-I5, CR2-I6, CR2-I7

### ブラウザ確認

- [ ] Works詳細ページ: Tag（recording/mixing/mastering）を右クリック → 「新しいタブで開く」が正常に動作する
- [ ] Works詳細ページ: prev/next ナビの隠しテキストが DevTools で `sr-only` クラスを持っている（`hidden` でない）

### コード確認

- [ ] `components/Tag.tsx`: `onClick` ハンドラと `useRouter` が存在しない。`<Link>` のみでナビゲーションしている
- [ ] `components/back-component.tsx`: フルスクリーンクリックオーバーレイに `aria-hidden="true"` がある
- [ ] `app/works/[slug]/page.tsx`: prev/next ナビの `<span>` が `className="sr-only"` を持っている

---

## 5. Contact Form

> 対象: CR-M5, CR2-M9

### ブラウザ確認

- [ ] Contact form: 送信成功時と送信失敗時で異なるビジュアル表示（色の違いなど）がある

### コード確認

- [ ] `app/contact/contact-form.tsx`: フォームデータのインターフェース名が `ContactFormData`（`FormData` でない）

---

## 6. コード品質 & 設定

> 対象: CR-I6, CR-I7, CR-I8, CR-I11, CR-I12, CR2-I2, CR2-I4, CR2-I8, CR2-M2, CR2-M3, CR2-M5, CR2-M6, CR2-M7, CR2-M8, CR-M2, CR-M4, CR-M7, CR-M8, CR-M11, CR-M12

### ブラウザ確認

- [ ] devサーバー起動後、ブラウザコンソールに `[ScrollRestoration]` のデバッグログが**出力されない**
- [ ] Tailwind safelist のクラス（`md:pt-10`, `md:w-6/12` 等）を使用しているページで、スタイルが正しく適用されている
- [ ] 存在しないURL（例: `/nonexistent`）にアクセスし、not-found ページのボーダーが正しく表示される
- [ ] 各ページの初回読み込み時にレイアウトのフラッシュ（一瞬のちらつき）がない

### コード確認

- [ ] `package.json`: `"name"` が `"nische"` である
- [ ] `package.json`: 以下のパッケージが dependencies に**含まれていない**:
  - `date-fns`
  - `class-variance-authority`
  - `remark-html`
  - `remark-parse`
  - `rehype-prism`
  - `next-themes`
  - `clsx`
  - `tailwind-merge`
- [ ] `next.config.mjs`: `experimental.scrollRestoration` が**存在しない**
- [ ] `lib/api.ts`: `getPostSlugs` 関数が**存在しない**
- [ ] `lib/api.ts`: `validatePostData` 関数が存在し、フロントマターの必須フィールドをチェックしている
- [ ] `lib/api.ts`: `getAllPosts` の結果がモジュールレベルでキャッシュされている
- [ ] `lib/utils.ts`: `tagName` 関数がここに定義されている（`top.tsx` や `Tag.tsx` に重複がない）
- [ ] `lib/utils.ts`: `cn()` 関数が**存在しない**
- [ ] `tailwind.config.ts`: safelist のエントリに `.`（ドット）で始まる項目がない
- [ ] `components/mobile-touch-cursor.tsx`: touch イベントリスナーが `{ passive: true }` で登録されている
- [ ] `components/back-component.tsx`: `handleBack` が `useCallback` でラップされている
- [ ] `lib/url-state.ts`: 先頭に `"use client"` ディレクティブがある
- [ ] `lib/url-state.ts`: `useRouter` のインポートが**ない**
- [ ] `components/work-nav-link.tsx` が**存在しない**（削除済み）
- [ ] `app/biography/biography.tsx`: `equipmentsGroup` が `any` 型でない

---

## Deferred Items（対象外）

以下は意図的に deferred された項目のため、このチェックリストの対象外:

| ID | 内容 | 理由 |
|----|------|------|
| CR-M3 | Google Fonts → next/font 移行 | レイアウト全体のリファクタリングが必要 |
| CR-M9 | TypeScript build errors ignored | 意図的なプロジェクト設定 |
| CR2-M4 | Tailwind config shadcn/ui boilerplate | 広範なクリーンアップ評価が必要 |
