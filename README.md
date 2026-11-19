# 前者後者.com

心屋仁之助さん発の「前者後者論」と、管理人オリジナルの「脳タイプ9」を解説する診断・コラムサイトの再構築版です。
旧サイト（Jimdo）: https://www.zenshakousha.com/

## 技術構成
- プレーンな HTML / CSS / JS（ビルド不要）
- 共通ヘッダー・フッターは `partials/` を `assets/js/common.js` が fetch して差し込む構成
- 前者後者の簡易診断は、外部サービス SelectType のフォームを `/shindan/` にそのまま埋め込み（判定ロジックは外部サービス側が保持）

## ディレクトリ
- 各ページはディレクトリ + `index.html`（例: `/what/index.html` → `/what/`）
- `assets/` 共通CSS・JS
- `partials/` 共通ヘッダー・フッター
- `content/` 旧サイトから抽出した原文Markdown（制作時の参照用）

## デプロイ
Vercelで静的サイトとしてデプロイ（ビルドコマンドなし、Output Directory はリポジトリ直下）。

## ローカル確認
```
python3 -m http.server 8000
```
