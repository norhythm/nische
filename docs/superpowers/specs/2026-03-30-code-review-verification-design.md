# Code Review Verification Checklist Design

## Overview

Round 1 (26件) + Round 2 (20件) のコードレビュー修正を開発環境で検証するためのチェックリスト。ブラウザ操作確認 + コードレベル確認の両面で構成。機能領域別に6セクションにグループ化し、同じページを何度も開き直す非効率を避ける。

## 成果物

`docs/code-review-verification-checklist.md` — markdownチェックリスト（`- [ ]` 形式）

## チェックリスト構成

### 1. セキュリティ (CR-C1, CR-C2, CR2-C1, CR2-C2, CR2-I1)

**ブラウザ確認:**
- Works詳細ページでmarkdownコンテンツが正常に表示されるか（YouTube/SoundCloud埋め込み含む）
- Contact formで空送信 → バリデーションエラーが返るか
- Contact formで不正なメールアドレス → エラーが返るか
- Contact formで正常送信 → 成功メッセージが表示されるか

**コード確認:**
- `lib/markdownToHtml.ts`: `rehype-sanitize`がパイプラインに入っているか
- 同ファイル: iframeのsrcが許可ドメイン（youtube, soundcloud, spotify等）に制限されているか
- 同ファイル: `style`属性が`*`ワイルドカードから除外されているか
- `app/api/contact/route.ts`: Zodバリデーション、rate limiter、SMTPConfigの型が適切か
- 同ファイル: rateLimitMapのクリーンアップ処理があるか

### 2. ナビゲーション & インタラクション (CR-I1, CR-I2, CR-I3, CR-I10)

**ブラウザ確認:**
- Works詳細ページで左矢印 = 前の作品、右矢印 = 次の作品になっているか（スクリーンリーダーまたはDOM確認）
- Contact formのinput内で矢印キー → ページ遷移が発生しないことを確認
- Works詳細ページでスマホ/DevTools: 縦スクロール中に横ナビが発火しないことを確認
- 同: 明確な横スワイプで前後ナビが動作するか

**コード確認:**
- `components/keyboard-navigation.tsx`: input/textarea/contentEditableのガードがあるか
- 同ファイル: `Math.abs(diffX) > 2 * Math.abs(diffY)` の水平判定があるか

### 3. Works詳細ページ & 表示 (CR-I4, CR2-I5, CR2-I9, CR2-M1, CR-M1)

**ブラウザ確認:**
- トップページで複数のwork画像が全て正しくクリッピングされているか（clipPath ID衝突の修正確認）
- work画像ホバー時のtiltエフェクトがスムーズか（mousemove re-render修正の確認）
- Works詳細ページのHTMLに`<h1>`が1つだけか（DevTools確認）

**コード確認:**
- `components/tiltImage.tsx`: `useId()`でclipPath IDが生成されているか
- 同ファイル: mousemoveがref経由のDOM操作で、setStateを使っていないか
- 同ファイル: `blendMode` stateが削除されているか

### 4. アクセシビリティ (CR-I5, CR2-I6, CR2-I7)

**ブラウザ確認:**
- Tagコンポーネント（recording/mixing/mastering）: 右クリック → 「新しいタブで開く」が動作するか
- Works詳細ページのprev/next: スクリーンリーダーテキストがDOM上で`sr-only`クラスか（`hidden`でないか）

**コード確認:**
- `components/Tag.tsx`: `onClick`ハンドラと`useRouter`が除去され、`<Link>`のみか
- `components/back-component.tsx`: オーバーレイに`aria-hidden="true"`があるか
- `app/works/[slug]/page.tsx`: ナビ要素の隠しテキストが`sr-only`クラスか

### 5. Contact Form (CR-M5, CR2-M9)

**ブラウザ確認:**
- フォーム送信成功時と失敗時で異なるビジュアル（色など）が表示されるか

**コード確認:**
- `app/contact/contact-form.tsx`: インターフェース名が`ContactFormData`か（`FormData`でないか）

### 6. コード品質 & 設定 (残りの項目)

**ブラウザ確認:**
- devサーバー起動時にコンソールにデバッグログ(`[ScrollRestoration]`)が出ないことを確認
- Tailwind safelistのクラス（`md:pt-10`, `md:w-6/12`等）が実際に適用されているか
- `not-found.tsx`のボーダーが正しく表示されるか（`/nonexistent`にアクセス）
- path-aware-containerのハイドレーション: ページ初回読み込み時にレイアウトフラッシュがないか

**コード確認:**
- `package.json`: name が `nische` か
- `package.json`: `date-fns`, `class-variance-authority`, `remark-html`, `remark-parse`, `rehype-prism`, `next-themes`, `clsx`, `tailwind-merge` が依存に含まれていないこと
- `next.config.mjs`: `experimental.scrollRestoration` がないこと
- `lib/api.ts`: `getPostSlugs`が存在しないこと、`validatePostData`が存在すること
- `lib/api.ts`: `getAllPosts`のモジュールレベルキャッシュがあるか
- `lib/utils.ts`: `tagName`関数が一箇所にまとまっているか、`cn()`が削除されているか
- `tailwind.config.ts`: safelistに`.`（ドット）付きの項目がないこと
- `components/mobile-touch-cursor.tsx`: touchリスナーが`passive: true`か

## Deferred Items (対象外)

以下は意図的にdeferredされた項目のため、このチェックリストの対象外:
- CR-M3: Google Fonts → next/font 移行
- CR-M9: TypeScript build errors ignored（意図的な設定）
- CR2-M4: Tailwind config shadcn/ui boilerplate
