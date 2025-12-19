# ゆめまち - 夢のまちを描こう

AIと一緒に、あなたの夢のまちを描くWebアプリケーション

## Project Overview

- **Name**: ゆめまち（Dream Town）
- **Goal**: ユーザーがAIと対話しながら、理想のまちを描いていく体験を提供
- **Features**: 
  - シンプルなLP（入口）画面
  - LINE風チャットベースのインタラクション
  - OpenAI DALL-E 3による画像生成
  - 2つのモード（お任せ/ちょい足し）

## URLs

- **Preview**: https://3000-io4rv84gp3le19u3ispdo-ad490db5.sandbox.novita.ai
- **LP画面**: `/`
- **チャット画面**: `/chat`
- **ローディング画面**: `/loading`
- **結果画面**: `/result`
- **生成API**: `POST /api/generate`

## 完成した機能

### 画面① LP（入口）
- ✅ キャッチコピー「AIと一緒に、夢のまちをえがこう。」
- ✅ 「はじめる」ボタン
- ✅ グラデーション背景
- ✅ スマートフォン最適化

### 画面② チャット入力（LINE風）
- ✅ ヘッダー（戻る / タイトル / やり直し）
- ✅ LINE風チャットログ
- ✅ 1画面1質問のステップ方式
- ✅ モード選択（お任せ/ちょい足し）

### 画面③ ローディング
- ✅ スピナーアニメーション
- ✅ エラーハンドリング（リトライボタン）
- ✅ 実際のAPI呼び出し

### 画面④ 結果表示
- ✅ 生成された画像の表示
- ✅ 使用したプロンプトの表示
- ✅ 画像保存ボタン
- ✅ もう一度つくるボタン

### API
- ✅ `POST /api/generate` - OpenAI DALL-E 3による画像生成

## 環境変数

### 開発環境（.dev.vars）
```
OPENAI_API_KEY=your-openai-api-key
```

### 本番環境（Cloudflare）
```bash
npx wrangler pages secret put OPENAI_API_KEY
```

## API仕様

### POST /api/generate

**リクエスト:**
```json
{
  "mode": "dreamer" | "arranger",
  "placeText": "川西能勢口駅前",
  "userText": "駅前に木の広場と遊具があって...",
  "options": {
    "users": ["家族"],
    "atmosphere": ["ナチュラル"],
    "viewpoint": "目の高さ",
    "style": "リアル写真風"
  }
}
```

**レスポンス（成功）:**
```json
{
  "success": true,
  "requestId": "uuid",
  "imageUrl": "https://oaidalleapiprodscus.blob.core.windows.net/...",
  "prompt": "生成に使用したプロンプト",
  "revisedPrompt": "DALL-Eが調整したプロンプト",
  "input": { ... }
}
```

**レスポンス（エラー）:**
```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

## プロンプト生成ロジック

### モード①（お任せ）
- ユーザーのアイデア + 場所情報
- デフォルトスタイル（warm illustration）

### モード②（ちょい足し）
- ユーザーのアイデア + 場所情報
- 利用者（こども/ティーン/大人/高齢者/家族/全世代）
- 雰囲気（ナチュラル/カラフル/落ち着いた/にぎやか/レトロ/先進的）
- 視点（目の高さ/鳥の目/ななめ上）
- 作風（リアル写真風/イラスト風/水彩画風/アニメ風）

## Tech Stack

- **Framework**: Hono
- **Runtime**: Cloudflare Workers / Pages
- **AI**: OpenAI DALL-E 3
- **Language**: TypeScript
- **Build Tool**: Vite

## Development

```bash
# Install dependencies
npm install

# Create .dev.vars with your API key
echo "OPENAI_API_KEY=your-key-here" > .dev.vars

# Build
npm run build

# Start development server
pm2 start ecosystem.config.cjs

# Check logs
pm2 logs --nostream
```

## Deployment

```bash
# Set API key as secret
npx wrangler pages secret put OPENAI_API_KEY

# Build and deploy
npm run deploy
```

## Project Structure

```
webapp/
├── src/
│   └── index.tsx          # メインアプリケーション
│       ├── GET /          # LP画面
│       ├── GET /chat      # チャット画面
│       ├── GET /loading   # ローディング画面
│       ├── GET /result    # 結果画面
│       └── POST /api/generate  # 画像生成API
├── public/
│   └── static/
├── .dev.vars              # 開発用環境変数（gitignore）
├── ecosystem.config.cjs   # PM2設定
├── wrangler.jsonc         # Cloudflare設定
└── package.json
```

## 次のステップ

- [ ] 生成結果の共有機能
- [ ] 履歴保存機能（Cloudflare D1）
- [ ] ユーザー認証

## Last Updated

2024-12-19
