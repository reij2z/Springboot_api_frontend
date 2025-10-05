# Next.js メモ帳アプリ（フロントエンド）

**Spring Boot + PostgreSQL API** と連携するメモ帳アプリのフロントエンドです。  
Next.js を使用し、ブラウザ上でメモの作成・表示・更新・削除・検索を行えます。

---

## 特長

- **Next.js 14 (App Router構成)**
- **fetch API** によるバックエンド通信
- **環境変数で API 接続先を切り替え**
- **メモの一覧・追加・編集・削除・検索**
- **CORS 対応済み（Spring Boot 側の WebConfig設定）**

---

## 動作環境

| 項目 | 推奨バージョン |
|------|----------------|
| Node.js | 18 以上 |
| npm | 9 以上 |
| バックエンド | Spring Boot + PostgreSQL |
| OS | Windows / macOS / Linux |

---

## セットアップ手順

### 1. クローン

git clone https://github.com/reij2z/Springboot_api_frontend.git
cd Springboot_api_frontend

---

### 2. 依存関係のインストール

```bash
npm install
```

---

### 3. 環境変数の設定

プロジェクト直下に `.env.local` を作成し、バックエンドAPIのURLを指定します。

```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

バックエンドが別ポートで動作している場合は適宜変更してください。
例：`http://localhost:8081`

---

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで以下を開いてください：
[http://localhost:3000](http://localhost:3000)

---

## アプリの使い方

### 一覧表示

起動直後にバックエンドの `/notes` API から全メモを取得して一覧表示します。

### メモの追加

上部の入力フォームに内容を入力して「追加」をクリックすると、
`POST /notes` が呼び出され、PostgreSQL にメモが保存されます。

### 編集

各メモ右側の「編集」ボタンをクリック → 内容変更後に「保存」で `PUT /notes/{id}` を送信。

### 削除

「削除」ボタンをクリックすると `DELETE /notes/{id}` が実行されます。

### 検索

検索欄にキーワードを入力して「検索」ボタンを押すと
`GET /notes/search?keyword=xxx` が呼び出されます。

---

## プロジェクト構成

```
Springboot_api_frontend/
├─ app/
│  ├─ page.js              # メイン画面（一覧・検索・登録）
│  ├─ globals.css          # 全体スタイル
│  └─ layout.js            # ページレイアウト
├─ public/
│  └─ favicon.ico
├─ .env.local              # 環境変数（API接続URL）
├─ package.json
├─ next.config.mjs
└─ README.md
```

---

## バックエンド連携

バックエンド（Spring Boot + PostgreSQL）
[https://github.com/reij2z/Springboot_api_demo](https://github.com/reij2z/Springboot_api_demo)

**利用しているAPIエンドポイント**

| 操作   | メソッド   | エンドポイント                  | 内容       |
| ---- | ------ | ------------------------ | -------- |
| 一覧取得 | GET    | `/notes`                 | 全メモを取得   |
| 新規作成 | POST   | `/notes`                 | 新しいメモを登録 |
| 更新   | PUT    | `/notes/{id}`            | 指定メモを更新  |
| 削除   | DELETE | `/notes/{id}`            | 指定メモを削除  |
| 検索   | GET    | `/notes/search?keyword=` | キーワード検索  |

---

## よくあるエラーと対処

| エラー                          | 原因                   | 対処                                 |
| ---------------------------- | -------------------- | ---------------------------------- |
| `TypeError: Failed to fetch` | APIサーバーが未起動またはURL不一致 | `NEXT_PUBLIC_API_BASE` を確認         |
| `CORS policy` エラー            | バックエンド側でCORS設定がない    | Spring Boot の `WebConfig.java` を確認 |
| 画面が真っ白                       | JSONパースエラーなど         | ブラウザコンソールを確認                       |

---

## 作者

**越智 玲仁（Reiji Ochi）**
GitHub: [reij2z](https://github.com/reij2z)

---

## ライセンス

MIT License