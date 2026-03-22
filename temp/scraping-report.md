# Arte Refact スクレイピング作業レポート

## 概要

Arte Refact の菊池司担当作品ページをスクレイピングし、nische の `_works` 形式のマークダウンファイルを生成した。

- **対象URL**: https://www.arte-refact.com/works/?cst&query-77-taxQuery-creators%5B0%5D=25
- **対象クリエイター**: 菊池 司（creator ID: 25）
- **実施日**: 2026-03-22

## スクレイピング方法

### データソース

一覧ページはJavaScriptで動的レンダリングされるため、WordPress REST API を使用してデータを取得した。

```
GET https://www.arte-refact.com/wp-json/wp/v2/works?creators=25&per_page=100&page={1-5}&_embed
```

- `_embed` パラメータにより、アイキャッチ画像のURL・サイズ情報、タクソノミー（works_category, creators）を一括取得
- 全5ページ（100件/ページ）、合計448件

### 取得データ項目

REST API レスポンスから以下を抽出:

| 項目 | API フィールド |
|---|---|
| タイトル | `title.rendered` |
| 公開日 | `date` |
| 本文HTML | `content.rendered` |
| アイキャッチ画像URL | `_embedded.wp:featuredmedia[0].source_url` |
| 画像サイズ | `_embedded.wp:featuredmedia[0].media_details.width/height` |
| カテゴリー | `_embedded.wp:term` (works_category) |
| クリエイター | `_embedded.wp:term` (creators) |

### 本文HTMLからのパース

`content.rendered` のHTML構造から以下を抽出:

- **トラックリスト**: `<p><strong>01.タイトル</strong></p>` 形式の番号付きリスト
- **菊池司の担当クレジット**: 以下3パターンで判定
  1. ブロック単位: `<strong>` 内に `Mix：菊池` がある場合、同ブロック内のトラックを対象
  2. 個別指定: `M01, 03, 05のミックスを菊池` パターンで特定トラックを対象
  3. 全曲対象: `収録曲のミックスを菊池` や、他のパターンに該当しない場合のフォールバック
- **クレジット種別**: ミックス/Mix → Mixing, レコーディング → Recording, マスタリング → Mastering
- **YouTube埋め込み**: `<iframe src="https://www.youtube.com/embed/...">` を抽出・整形
- **リンク**: `wp-block-button` 内の `<a>` タグから href と テキストを抽出

### URLスラグ生成

英単語ベース・ハイフン区切りの命名規則を採用。以下の多段処理で生成:

1. **Phase 0**: `第X話` → `ep-X`、`第X部` → `part-X`、`X期生` → `X-gen` 等の数値パターン変換
2. **Phase 1**: 包括的な日本語→英語辞書による置換（最長一致順）
   - フランチャイズ名: あんさんぶるスターズ → ensemble-stars 等
   - アーティスト名: 古川慎 → furukawa-makoto 等
   - 音楽用語: キャラクターソング → character-song 等
3. **Phase 2**: 残存する日本語文字を `pykakasi` でローマ字変換
4. **Phase 3**: 英数字+ハイフンに正規化
5. **Phase 4**: 連続重複語の除去（例: vspo-vspo → vspo）

重複スラグにはサフィックス `-2`, `-3` を付与（4件該当）。

#### Before / After 比較

| タイトル | Before（ローマ字変換） | After（英単語ベース） |
|---|---|---|
| あんさんぶるスターズ！！ ... 「Dear World」 | ansanburu-sutaazu-bright-me-up-... | ensemble-stars-bright-me-up-... |
| 『エリオスライジングヒーローズ』第5部主題歌... | eriosuraijinguhiiroozu-dai-5-bu-shudaika-... | helios-rising-heroes-part-5-theme-song-... |
| TVアニメ『ばっどがーる』天狼群 1st Single... | tv-anime-baddogaaru-tenrou-gun-... | tv-anime-bad-girl-tenrou-gun-... |
| IXIS デビューミニアルバム「Roots of」 | ixis-debyuuminiarubamu-roots-of | ixis-debut-mini-album-roots-of |
| TVアニメ『推しの子』キャラクターソング入りサウンドトラック | tv-anime-oshi-no-ko-kyarakutaasongu-iri-saundotorakku | tv-anime-oshi-no-ko-character-song-soundtrack |
| 舞台『あんさんぶるスターズ！エクストラ・ステージ』... | butai-ansanburu-sutaazu-ekusutora-suteeji-... | stage-ensemble-stars-extra-stage-... |
| 古川慎 8th Single「そこに有る灯り」 | furukawa-shin-8th-single-... | furukawa-makoto-8th-single-... |
| TVアニメ『スパイ教室』スペシャルエンディングテーマ... | tv-anime-supai-kyoushitsu-supesharuendinguteema-... | tv-anime-spy-classroom-special-ending-theme-... |
| 夢限大みゅーたいぷ 1st Album「プログレス サイン」 | yume-gen-oomi-yuutaipu-1st-album-puroguresu-sain | mugendai-mewtype-1st-album-progress-sign |

### 画像ダウンロード

`_embedded.wp:featuredmedia` の `source_url` からオリジナルサイズの画像をダウンロード。
ファイル名はスラグ名 + 元の拡張子。

## タイトル解析ロジック

APIタイトルから `holder`（権利元/作品名）、`artist`（アーティスト）、`title`（楽曲/アルバム名）を分離:

| パターン | 例 | holder | artist | title |
|---|---|---|---|---|
| `Holder / Artist「Title」` | `ぶいすぽっ！ / 胡桃のあ「秒針を重ねて」` | ぶいすぽっ！ | 胡桃のあ | 秒針を重ねて |
| `『Holder』... 「Title」` | `『ガルパン』第7話ED「いいえ！...」` | ガルパン | (空) | いいえ！... |
| `Artist Album「Title」` | `IXIS デビューミニアルバム「Roots of」` | (空) | IXIS | Roots of |

`「」` を `『』` より優先してタイトルを抽出。

## 出力結果

### ファイル配置

| 種別 | パス | 件数 |
|---|---|---|
| マークダウン | `temp/works/*.md` | 448 |
| 画像 | `temp/media/*` | 448 |

### 統計

| 項目 | 値 |
|---|---|
| 総処理件数 | 448 |
| エラー | 0 |
| タグ: mix | 441 |
| タグ: mastering | 14 |
| スラグ重複（サフィックス解決） | 4 |
| 画像合計サイズ | 239MB |

### スラグ重複の詳細

| スラグ | 作品 (ID) |
|---|---|
| `ensemble-stars-bright-me-up-mellow-dear-us-dear-world` | Dear World (29383) / Dear World (28354) |
| `ensemble-stars-bright-me-up-mellow-dear-us-mellow-addiction` | Mellow Addiction (29386) / Mellow Addiction (28357) |
| `stage-ensemble-stars-extra-stage-memory-of-marionette` | Memory of Marionette (9787) / (9401) |
| `the-vampire-dies-in-no-time-character-song-soundtrack` | サウンドトラック② (15758) / ① (14920) |

2件目以降にはスラグ末尾に `-2` を付与。

### カテゴリー分布（Arte Refact側）

| カテゴリー | ID |
|---|---|
| Anime | 6 |
| Game | 7 |
| Artist | 8 |
| Comic | 27 |
| 劇伴/BGM | 26 |
| 遊技機 | 30 |
| 舞台 | 34 |
| Vtuber | 47 |

## 生成ファイルのフォーマット

```markdown
---
published: true
date: YYYY-MM-DD
holder: "権利元/作品名"
artist: "アーティスト名"
title: "楽曲/アルバム名"
url: "url-slug"
tag:
  - mix
layout: "square"
image: "/temp/media/url-slug.jpg"
---

##### Tracklist

| Track number | Title | Credit |
| ------------ | ----- | ------ |
| 01 | 楽曲名 | Mixing |

##### Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/..." ...></iframe>

##### Links

- <a data-type="button" href="https://..." target="_blank">リンクテキスト</a>
```

## 使用ツール・ライブラリ

- **データ取得**: WordPress REST API v2 (`urllib.request`)
- **日本語→英語辞書**: `/tmp/slug_dict.py`（フランチャイズ名、アーティスト名、音楽用語の包括的マッピング）
- **日本語ローマ字変換（フォールバック）**: `pykakasi`
- **HTMLパース**: Python 標準 `re` モジュール
- **スクリプト**: `/tmp/scrape_work.py`

## 本番反映時の注意

- `temp/works/*.md` → `_works/` にコピー
- `temp/media/*` → `public/works/media/` にコピー
- 各ファイルの `image` パスを `/temp/media/` → `/works/media/` に変更
- 既存の `_works/` ファイルとの重複確認が必要（同一作品が異なるスラグで存在する可能性あり）
- `holder`、`artist` が空の作品は手動補完が望ましい
- Tracklist/Video が取得できなかった作品（APIコンテンツに記載なし）は手動追加が必要
