## Next.js（フロントエンド）README

```md
# Next.js Frontend for Spring Boot API

Spring Boot + PostgreSQL バックエンドと連携する  
簡易メッセージ管理（CRUD）フロントアプリです。

---

## 技術構成

* **Next.js 14（App Router）**
* **fetch API** で Spring Boot と通信
* **POST / PUT / DELETE** に対応
* **エラー時 alert 表示**（404 / ネットワーク異常など）

---

## 動作環境

| 要件 | 内容 |
|------|------|
| Node.js | 20 以上（LTS） |
| npm | 10 以上 |
| API | `http://localhost:8080` |
| ポート | フロント: `3000` |

---

## セットアップ & 起動

```bash
# 新規作成（初回のみ）
npx create-next-app@latest springboot-api-frontend --use-npm --js --eslint

# プロジェクトへ移動
cd springboot-api-frontend

# 環境変数設定
echo NEXT_PUBLIC_API_BASE=http://localhost:8080 > .env.local

# 起動
npm run dev
````

アクセス：
[http://localhost:3000](http://localhost:3000)

---

## 主な機能

| 機能        | 内容                      |
| --------- | ----------------------- |
| メッセージ一覧   | GET `/messages`         |
| 新規登録      | POST `/messages`        |
| 編集        | PUT `/messages/{id}`    |
| 削除        | DELETE `/messages/{id}` |
| バリデーション   | 空文字は送信不可                |
| エラーハンドリング | ネットワークエラー時に alert 表示    |

---

## ディレクトリ構成

```
springboot-api-frontend/
├─ app/
│   └─ page.js        # UI + CRUD ロジック
├─ .env.local          # API_BASE 設定
├─ package.json
└─ README.md
```

---

## 仕組み概要

1. `fetch()` で Spring Boot の API（8080番）を呼び出し
2. `POST` 時に JSON を送信 → API → DB 保存
3. `GET` で一覧を取得してレンダリング
4. `PUT`／`DELETE` で更新・削除

---

## 今後の拡張

### Step 1（完了）

* Spring Boot API との CRUD 連携（POST / PUT / DELETE）

### Step 2（開発予定）

* メモ帳アプリへ発展

  * タイトル・本文・作成日時の入力フォーム追加
  * 検索・並び替え機能

---

### 作者

越智 玲仁（Reiji Ochi）
Next.js × Spring Boot × PostgreSQL 連携デモ

```