# OCR Web App

> !> [!NOTE]
> READMEはAI生成です

ブラウザ上で動作する高機能OCRアプリケーション。画像ファイルやカメラからのリアルタイム映像内の文字を認識し、特にレシート情報の抽出に特化しています。

## 主な機能

- **画像からの文字認識**: アップロードした画像ファイルから文字を抽出します。
- **レシート情報抽出**: Gemini APIを利用して、認識したテキストから店舗名、日付、合計金額などのレシート情報を構造化データとして抽出します。

## 技術スタック

- **フロントエンド**: Next.js (App Router), React, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **フォーム**: React Hook Form, Zod
- **テスト**: Vitest, Storybook
- **OCR**:
    - Google Cloud Vision API
    - Tesseract.js
- **LLM**: Google Gemini
- **API (BFF)**: Hono
- **コード品質**: ESLint, Prettier, lint-staged, husky, oxlint

## 環境変数

プロジェクトのルートに`.env`ファイルを作成し、以下の環境変数を設定してください。

- `GEMINI_API_KEY`: Gemini APIのAPIキー
- `CLOUD_VISION_API_KEY`: Cloud Vision APIのAPIキー

## セットアップと実行方法

### 1. 依存関係のインストール

このプロジェクトでは`pnpm`を使用します。

```bash
pnpm install
```

### 2. 開発サーバーの起動

以下のコマンドで開発サーバーを起動します。

```bash
pnpm dev
```

ブラウザで [https://localhost:3000](https://localhost:3000) を開いてください。

## ファイル構成

このプロジェクトの主要なファイルとディレクトリの構造は以下の通りです。

```
.
├───.editorconfig
├───.gitignore
├───.lintstagedrc.yaml
├───.oxlintrc.json
├───.prettierignore
├───.prettierrc.yaml
├───components.json
├───eslint.config.mjs
├───next.config.ts
├───package.json
├───pnpm-lock.yaml
├───pnpm-workspace.yaml
├───postcss.config.mjs
├───README.md
├───tsconfig.json
├───vitest.config.ts
├───vitest.shims.d.ts
├───.git/
├───.husky/
├───.next/
├───.storybook/
├───.vscode/
├───certificates/
├───node_modules/
├───public/
└───src/
    ├───app/
    ├───components/
    ├───hooks/
    ├───lib/
    ├───schemas/
    └───stories/
```

### 主要なファイルとディレクトリの役割

- **`/` (ルート)**
    - `next.config.ts`: Next.jsの設定ファイル
    - `package.json`: プロジェクトの依存関係とスクリプトを定義
    - `tsconfig.json`: TypeScriptの設定ファイル
    - `eslint.config.mjs`, `.prettierrc.yaml`, etc.: コードの品質とフォーマットに関する設定ファイル
- **`/src`**: ソースコードのメインディレクトリ
    - **`/src/app`**: Next.jsのApp Routerに対応するディレクトリ
        - `layout.tsx`: 全ページ共通のレイアウト
        - `page.tsx`: トップページのコンポーネント
        - `globals.css`: グローバルなスタイルシート
        - **`/src/app/_components`**: ページ固有のコンポーネント
            - `ReceiptDataField.tsx`: レシートデータのフィールドを表示するコンポーネント
            - `ReceiptForm.tsx`: レシート情報を表示・編集するフォーム
        - **`/src/app/api`**: APIルート
            - `[[...route]]/route.ts`: Honoを使ったAPIエンドポイント
    - **`/src/components`**: 共有コンポーネント
        - **`/src/components/Camera`**: カメラ機能に関連するコンポーネント(コード内では使用していない)
            - `index.tsx`: カメラのUI
            - `useCamera.ts`: カメラ操作のためのカスタムフック
        - **`/src/components/RealtimeOCR`**: リアルタイムOCR機能のコンポーネント
        - **`/src/components/ui`**: UIコンポーネント (shadcn/uiなど)
    - **`/src/hooks`**: カスタムフック
        - `useNumericInput.ts`: 数値入力のためのカスタムフック
    - **`/src/lib`**: ライブラリ、ユーティリティ関数
        - `db.ts`: Dexie.js (IndexedDB) の設定
        - `image2ReceiptData.ts`: Geminiを使用して画像からレシートデータを生成する処理
        - `parseReceiptData.ts`: レシートデータから特定の情報を抽出する処理
        - `recognizeText.ts`: Google Cloud Vision API を使ったOCR処理
        - `recognizeTextWithTesseract.ts`: Tesseract.js を使ったOCR処理
        - `utils.ts`: 汎用的なユーティリティ関数
    - **`/src/schemas`**: Zodスキーマ定義
        - `imageUploadSchema.ts`: 画像アップロード時のバリデーションスキーマ
        - `receiptSchema.ts`: レシートデータのバリデーションスキーマ
    - **`/src/stories`**: Storybookのストーリーファイル
- **`/public`**: 静的ファイル (画像など)
- **`/certificates`**: ローカル開発用のSSL証明書
