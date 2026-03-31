---
marp: true
theme: default
paginate: true
style: |
  :root {
    --color-fg: #222;
    --color-fg-secondary: #888;
    --color-bg: #fff;
    font-family: 'Noto Sans JP', 'Helvetica Neue', sans-serif;
  }
  section {
    background: var(--color-bg);
    color: var(--color-fg);
    padding: 60px 80px;
  }
  h1 {
    color: var(--color-fg);
    font-weight: 600;
    border-bottom: 2px solid #222;
    padding-bottom: 12px;
  }
  h2 {
    color: var(--color-fg);
    font-weight: 500;
    font-size: 1.3em;
  }
  code {
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 0.9em;
  }
  .placeholder {
    border: 2px dashed #bbb;
    background: #fafafa;
    padding: 40px;
    text-align: center;
    color: #999;
    font-size: 0.85em;
    border-radius: 8px;
    margin: 20px 0;
  }
  .warn {
    background: #fff3f3;
    border-left: 4px solid #e55;
    padding: 12px 20px;
    margin: 16px 0;
    border-radius: 0 4px 4px 0;
  }
  .tip {
    background: #f3f8ff;
    border-left: 4px solid #58a;
    padding: 12px 20px;
    margin: 16px 0;
    border-radius: 0 4px 4px 0;
  }
  table {
    font-size: 0.85em;
  }
  strong {
    color: #111;
  }
---

<!-- _paginate: false -->

# nische.jp 運用ガイド

**菊地司 ポートフォリオサイト**

サイトの仕組みと、作品の追加・管理方法

---

# このガイドでわかること

1. **全体像** — サイトがどういう仕組みで動いているか
2. **GitHub** — ファイル置き場の使い方
3. **Vercel** — サイトの反映状況の確認方法
4. **Pages CMS** — 作品の追加・編集（おさらい）
5. **作品データの構造** — 各項目の意味
6. **DNS・メール** — 触ってはいけない設定
7. **困ったとき** — よくあるトラブルと連絡先

---

# 1. 全体像 — サイトの仕組み

```
   GitHub                  Vercel                nische.jp
 (ファイル置き場)    →    (自動で反映)    →    (公開サイト)

  作品データや画像を       ファイルが更新されると      訪問者が見る
  保存・管理する場所       自動でサイトを再構築        ウェブサイト
```

**ポイント:** GitHubにファイルを置くだけで、自動的にサイトに反映されます。
FTPなどの手動アップロードは不要です。

---

# 1. 各サービスの役割

| サービス | 役割 | 例えるなら |
|---------|------|----------|
| **GitHub** | 作品データ・画像の保管場所 | ファイルサーバー |
| **Vercel** | サイトを公開・表示するサービス | レンタルサーバー |
| **Pages CMS** | 作品データを編集する画面 | 管理画面 |
| **さくらインターネット** | ドメイン (nische.jp) とメール | ドメイン管理 |

<div class="tip">
普段の作品追加・編集は <strong>Pages CMS</strong> だけで完結します。<br>
GitHub と Vercel は「たまに確認する」程度で大丈夫です。
</div>

---

# 2. GitHub — ファイル置き場

## ログインとトップ画面

<div class="placeholder">
<strong>[スクリーンショット]</strong><br><br>
撮影: GitHub にログイン後、nische リポジトリのトップページ<br>
URL: github.com/(菊地さんのアカウント名)/nische<br>
表示内容: フォルダ一覧 (_works, app, components, data, public 等) が見える状態
</div>

ここがサイトの全ファイルが入っている場所です。

---

# 2. フォルダ構成 — 触るところ / 触らないところ

| フォルダ | 中身 | 触る？ |
|---------|------|-------|
| `_works/` | 作品のテキストファイル | **触る** — 作品の追加・編集 |
| `public/works/media/` | 作品の画像ファイル | **触る** — 画像の追加 |
| `data/` | プロフィール・機材・連絡先 | たまに触る |
| `app/` `components/` `lib/` | サイトのプログラム | **触らない** |
| `package.json` 等 | 設定ファイル | **触らない** |

<div class="tip">
基本的に <code>_works/</code> と <code>public/works/media/</code> だけ覚えておけばOKです。
</div>

---

# 2. ファイルの中身を見る

<div class="placeholder">
<strong>[スクリーンショット]</strong><br><br>
撮影: _works/ フォルダ内の任意の .md ファイルを開いた状態<br>
例: _works/hoshimachi-suisei-primadonna.md のプレビュー画面<br>
表示内容: frontmatter (---で囲まれた部分) と本文が見える状態
</div>

クリックするとファイルの中身が表示されます。
上部の `---` で囲まれた部分が作品情報、その下が本文です。

---

# 2. ファイルの編集（緊急時用）

<div class="placeholder">
<strong>[スクリーンショット]</strong><br><br>
撮影: .md ファイルの編集モード (鉛筆アイコンクリック後)<br>
+ 「Commit changes」ダイアログが表示された状態
</div>

1. ファイルを開いて右上の鉛筆アイコンをクリック
2. 内容を編集
3. 右上の「Commit changes...」→「Commit changes」で保存
4. 自動でサイトに反映される（数分かかります）

<div class="tip">
通常は Pages CMS から操作するので、ここは「Pages CMS が使えない時」の予備手段です。
</div>

---

# 3. Vercel — サイトの公開

## ダッシュボード

<div class="placeholder">
<strong>[スクリーンショット]</strong><br><br>
撮影: Vercel ダッシュボードの nische プロジェクトページ<br>
表示内容: プロジェクト名、「Ready」の表示、最新のデプロイ状況
</div>

**「Ready」** と表示されていれば、サイトは正常に動いています。

---

# 3. 反映の確認

<div class="placeholder">
<strong>[スクリーンショット]</strong><br><br>
撮影: Vercel の Deployments タブ<br>
表示内容: 成功したデプロイ (緑のチェック) が複数並んでいる状態
</div>

GitHub にファイルを保存するたびに、ここに新しい行が追加されます。

| 表示 | 意味 |
|------|------|
| 緑のチェック | 反映成功 |
| 赤いバツ | 反映失敗 |
| 黄色の丸 | 反映中... (数分で完了します) |

---

# 3. 失敗したとき

赤いバツが出た場合:

1. **慌てない** — 前の正常な状態のサイトがそのまま表示されています
2. **自分で直そうとしなくてOK**
3. 開発者に連絡してください

<div class="warn">
赤いバツが出ても、サイトは前の状態で動き続けています。<br>
訪問者には影響ありません。焦って操作する必要はありません。
</div>

---

# 4. Pages CMS — 作品の管理

## 作品一覧画面

<div class="placeholder">
<strong>[スクリーンショット]</strong><br><br>
撮影: Pages CMS にログイン後、_works のファイル一覧画面<br>
表示内容: 作品ファイルが一覧で並んでいる状態
</div>

ここから作品の追加・編集・公開設定ができます。

---

# 4. 作品の追加・編集

**新しい作品を追加するとき:**
1. 「New」ボタンをクリック
2. 各項目を入力 (タイトル、アーティスト名、日付、タグ等)
3. 画像を media フォルダにアップロード
4. 「Save」で保存 → 自動でサイトに反映

**既存の作品を編集するとき:**
1. 作品をクリック
2. 内容を変更
3. 「Save」で保存

---

# 4. 公開 / 非公開の切り替え

| 設定 | サイトでの表示 |
|------|--------------|
| `published: true` | サイトに表示される |
| `published: false` | サイトに表示されない（下書き状態） |

<div class="tip">
作品を一時的に非表示にしたい場合は <code>published</code> を <code>false</code> にしてください。<br>
データは消えません。<code>true</code> に戻せば再表示されます。
</div>

---

# 5. 作品データの構造

各作品ファイルの先頭にある「作品情報ヘッダー」の項目:

```
title: 作品名
artist: アーティスト名
holder: 権利者・レーベル名
date: 発売日 (例: 2025-07-15)
image: 画像ファイル名 (例: album-cover.jpg)
tag: [rec, mix, master] から選択
published: true または false
url: ページのURL (英語、ハイフン区切り)
lang: ja (日本語の場合)
```

---

# 5. タグの意味

サイト上のフィルタリングに使われます。複数指定可能です。

| タグ | 意味 | サイト上の表示 |
|------|------|--------------|
| `rec` | レコーディング | recording |
| `mix` | ミキシング | mixing |
| `master` | マスタリング | mastering |

**例:** レコーディングとミキシングを担当した作品
```
tag: [rec, mix]
```

---

# 5. 画像の配置

- **置き場所:** `public/works/media/` フォルダ
- **ファイル名:** 作品情報ヘッダーの `image:` と一致させる
- **推奨:** JPG形式、横幅512px以上

```
作品情報ヘッダー:
  image: album-cover.jpg

画像ファイル:
  public/works/media/album-cover.jpg
                     ↑ ここが一致していること
```

---

# 6. DNS・メール — 触らない設定

<div class="warn">
<strong>さくらインターネットの管理画面で、以下のレコードは絶対に変更しないでください。</strong><br>
変更するとメールが届かなくなります。
</div>

| 設定名 | 値 | 役割 |
|-------|-----|------|
| **MXレコード** (メールの宛先設定) | `10 www3493.sakura.ne.jp.` | メールの配送先 |
| **Aレコード** (ウェブサイトの宛先設定) | `216.150.1.1` | サイトの表示先 |

<div class="placeholder">
<strong>[スクリーンショット]</strong><br><br>
撮影: さくらインターネットの DNS ゾーン編集画面<br>
表示内容: MXレコードとAレコードが見える状態<br>
※ 「ここを触らない」と示す矢印やマーキングがあると分かりやすい
</div>

---

# 6. メールが届かなくなったら

1. さくらの管理画面を開く
2. MXレコードが `10 www3493.sakura.ne.jp.` になっているか確認
3. 変わっていた場合 → 元に戻す
4. **わからない場合 → すぐ開発者に連絡**

<div class="warn">
DNS設定の変更が必要な場合は、必ず事前に開発者に相談してください。<br>
自己判断で変更すると、サイトやメールが停止する可能性があります。
</div>

---

# 7. よくあるトラブル

| 症状 | 確認すること |
|------|------------|
| サイトに作品が反映されない | Vercel の Deployments で赤いバツが出ていないか確認。数分待っても反映されなければ連絡 |
| 画像が表示されない | ファイル名と作品情報ヘッダーの `image:` が一致しているか確認 |
| ページが404 (見つかりません) | `published: true` になっているか確認。`url:` が正しいか確認 |
| メールが届かない | さくらのDNS設定を確認 (前ページ参照)。わからなければ即連絡 |

---

# 7. 連絡先

何か困ったことがあれば、遠慮なく連絡してください。

**連絡先:** [開発者の連絡先をここに記入]

<div class="tip">
「壊れたかも」と思ったら、自分で直そうとするより先に連絡してください。<br>
早めに連絡してもらえれば、すぐ対応できます。
</div>

---

<!-- _paginate: false -->

# おわり

このガイドはいつでも見返せるように手元に保管してください。

サイトの更新作業で不明な点があれば、いつでも相談してください。
