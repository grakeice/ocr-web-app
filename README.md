This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## ENVs

- `GEMINI_API_KEY`\
  GeminiのAPIキー
- `CLOUD_VISION_API_KEY`\
  Cloud Vision APIのAPIキー

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
        - **`/src/components/Camera`**: カメラ機能に関連するコンポーネント
            - `index.tsx`: カメラのUI
            - `useCamera.ts`: カメラ操作のためのカスタムフック
        - **`/src/components/RealtimeOCR`**: リアルタイムOCR機能のコンポーネント
        - **`/src/components/ui`**: UIコンポーネント (shadcn/uiなど)
    - **`/src/hooks`**: カスタムフック
        - `useImageParser2Receipt.ts`: 画像からレシート情報を解析する処理のカスタムフック
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
