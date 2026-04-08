# Playwright E2E Tests + a11y / SEO / AI可読性修正 Design

## Overview

コードレビュー修正の検証と、新たに発見したアクセシビリティ / SEO / AI可読性の問題を修正・テストする。Playwright を導入し、ブラウザ上で検証可能な項目を自動化する。

## 対象外

- メール送信の確認（手動）
- タッチスワイプの実機確認（手動）
- tiltエフェクトのスムーズさ（手動・主観）
- コード確認30項目（手動またはgrep）
- 色コントラスト修正（デザイン判断が必要、別途対応）

## 実装順序

1. Playwright 導入（インフラ）
2. DOM構造の修正を先に全て行う
3. 修正後の構造に対してテストを書く

テストは `getByRole` / `getByLabel` / `getByText` 等のセマンティックセレクタを基本とし、DOM構造のパスに依存しない。

---

## セクション 1: Playwright インフラ

- `@playwright/test` を devDependencies に追加
- `playwright.config.ts`: baseURL `http://localhost:3000`、`webServer` で `pnpm dev` を自動起動
- `package.json` に `"test:e2e": "playwright test"` スクリプト追加
- テストは `e2e/` ディレクトリに配置

---

## セクション 2: コードレビュー検証テスト

**ファイル: `e2e/code-review-verification.spec.ts`**

### ブラウザ確認項目

| テスト | 確認内容 | 対象CR |
|--------|----------|--------|
| Works詳細 markdown表示 | コンテンツがレンダリングされている | CR-C1 |
| YouTube iframe表示 | iframe が許可ドメインのsrcで表示される | CR2-C1 |
| input内の矢印キー | input フォーカス中にページ遷移しない | CR-I2 |
| 矢印キーで前後遷移 | Works詳細で左右キーが動作する | CR-I1 |
| prev/nextラベル | sr-onlyテキストが正しい方向 | CR-I1, CR2-I7 |
| clipPath ID一意性 | 複数画像のclipPath IDが全て異なる | CR-I4 |
| h1が1つだけ（Works詳細） | h1要素が1つ | CR2-M1 |
| TagがLinkコンポーネント | Tagが`<a>`タグ | CR-I5 |
| back overlay aria-hidden | `aria-hidden="true"`存在 | CR2-I6 |
| デバッグログなし | コンソールに`[ScrollRestoration]`なし | CR-I8 |
| 404ページ表示 | not-foundが表示されボーダーが見える | CR-M2 |
| フォーム成功/失敗の視覚区別 | ステータス表示の色が異なる | CR2-M9 |

### 追加a11yチェック

| テスト | 確認内容 |
|--------|----------|
| フォームのlabel関連付け | 各inputに`<label>`または`aria-label`がある |
| 画像のalt属性 | work画像に全て空でないaltがある |
| nav要素の存在 | headerナビゲーションが`<nav>` |
| lang属性 | `<html lang="ja">`が設定 |
| フォーカス可視性 | インタラクティブ要素のフォーカスにoutlineがある |

---

## セクション 3: a11y / SEO / AI可読性 — 修正 + テスト

**ファイル: `e2e/accessibility-seo.spec.ts`**

### Critical修正

| ID | 修正ファイル | 修正内容 | テスト |
|----|-------------|----------|--------|
| C1 | `components/header.tsx` | `<h1>` を条件分岐: ホームページのみ `<h1>`、他ページは `<span>` | 各ページで `<h1>` が1つだけ |
| C2 | `app/top.tsx` | visually hidden `<h1>` を追加（例: "Works by Tsukasa Kikuchi"） | トップページに `<h1>` が存在 |
| C3 | `app/top.tsx` | フィルターボタンに `role="toolbar"` + 各ボタンに `aria-pressed` | アクティブフィルターに `aria-pressed="true"` |
| C4 | `app/contact/contact-form.tsx` | ステータスメッセージに `role="alert"` 追加 | `role="alert"` が存在 |
| C5 | `app/layout.tsx` | skip-to-content リンク追加 + `<main id="main-content">` | `#main-content` へのスキップリンクが存在 |

### Important修正

| ID | 修正ファイル | 修正内容 | テスト |
|----|-------------|----------|--------|
| I1 | `app/layout.tsx` | `<Header>` `<Footer>` を `<main>` の外に移動 | `<main>` 内に `<header>` `<footer>` がない |
| I2 | `components/header.tsx`, `app/works/[slug]/page.tsx` | 各 `<nav>` に異なる `aria-label` 追加 | 各 `<nav>` に異なる `aria-label` |
| I3 | `app/works/[slug]/page.tsx` | `generateMetadata` に description 追加 | `<meta name="description">` が空でない |
| I4 | `app/layout.tsx` | metadata に `alternates.canonical` 追加 | `<link rel="canonical">` が存在 |
| I5 | `app/layout.tsx` | robots meta の状態をドキュメントと一致させる | robots meta が設定と一致 |
| I6 | `app/layout.tsx`, `app/works/[slug]/page.tsx` | JSON-LD 追加（Person / CreativeWork） | `<script type="application/ld+json">` が存在しパース可能 |
| I7 | `app/top.tsx` | work grid item に sr-only タイトル追加 | 各work linkに空でないaccessible name |

### Minor修正（影響大）

| ID | 修正ファイル | 修正内容 | テスト |
|----|-------------|----------|--------|
| M6 | `app/contact/contact-form.tsx` | `autocomplete` 属性追加 | name/email に `autocomplete` がある |
| M7 | `app/biography/biography.tsx` | 英語セクションに `lang="en"` | biography内の英語divに `lang="en"` |
| M11 | `app/top.tsx` | フィルターを `<nav aria-label="Filter by category">` で囲む | フィルターが nav landmark 内 |
| M14 | `app/top.tsx` | work grid item を `<article>` で囲む | 各workが `<article>` 内 |

### 対象外（別途対応）

| ID | 理由 |
|----|------|
| M1 | markdownコンテンツ側の問題 |
| M2 | hr role — 軽微 |
| M3/M4 | SVG/canvas aria-hidden — 視覚影響なし |
| M5 | 色コントラスト — デザイン判断が必要 |
| M8/M9 | I3修正でカバーされる範囲 |
| M10 | 既にsr-onlyテキストあり |
| M12 | biography全体のリファクタが必要 |
| M13 | preconnect crossOrigin — 軽微 |

---

## テスト内の手動確認マーキング

テストファイル内に手動確認が必要な項目をコメントで明記:

```typescript
// MANUAL: tiltエフェクトのスムーズさを目視確認
// MANUAL: メール送信の成功確認（SMTP接続が必要）
// MANUAL: モバイル実機でのタッチスワイプ動作
// MANUAL: 色コントラストの目視確認
```

---

## 修正対象ファイル一覧

| ファイル | 修正内容 |
|----------|----------|
| `app/layout.tsx` | skip-to-content追加、main id追加、header/footer移動、canonical、robots、JSON-LD |
| `app/top.tsx` | h1追加、フィルターnav+toolbar+aria-pressed、work item article化、sr-onlyタイトル |
| `app/works/[slug]/page.tsx` | generateMetadata description追加、nav aria-label、JSON-LD |
| `app/contact/contact-form.tsx` | role="alert"、autocomplete属性 |
| `app/biography/biography.tsx` | 英語セクション lang="en" |
| `components/header.tsx` | h1条件分岐、nav aria-label |
