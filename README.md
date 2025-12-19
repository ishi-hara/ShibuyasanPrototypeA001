# 夢のまちを描こう

AIと一緒に、あなたの夢のまちを描くWebアプリケーション

## Project Overview

- **Name**: 夢のまちを描こう（Dream Town）
- **Goal**: ユーザーがAIと対話しながら、理想のまちを描いていく体験を提供
- **Features**: 
  - シンプルなLP（入口）画面
  - チャットベースのインタラクション

## URLs

- **Preview**: https://3000-io4rv84gp3le19u3ispdo-ad490db5.sandbox.novita.ai
- **LP画面**: `/`
- **チャット画面**: `/chat`

## 完成した機能

### 画面① LP（入口）
- ✅ キャッチコピー「AIと一緒に、夢のまちをえがこう。」
- ✅ 「はじめる」ボタン（画面幅85%、タップしやすいサイズ）
- ✅ グラデーション背景（#667eea → #764ba2）
- ✅ タップ時のリップルエフェクト
- ✅ スケールアニメーション
- ✅ スマートフォン最適化（100dvh対応）
- ✅ PC表示でも崩れないレスポンシブ対応
- ✅ localStorage による訪問記録（2回目以降スキップ機能準備済）

### 画面② チャット（プレースホルダー）
- ✅ チャットUI基本レイアウト
- ✅ メッセージ入力・送信機能（仮実装）
- ✅ ボットからの初期メッセージ

## 未実装機能

- [ ] AI連携（実際のチャット応答）
- [ ] まちの画像生成機能
- [ ] 生成結果の保存・共有
- [ ] ユーザー認証

## Tech Stack

- **Framework**: Hono
- **Runtime**: Cloudflare Workers / Pages
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS（インラインスタイル）

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Start development server
pm2 start ecosystem.config.cjs

# Check logs
pm2 logs --nostream
```

## Project Structure

```
webapp/
├── src/
│   └── index.tsx          # メインアプリケーション（LP + チャット画面）
├── public/
│   └── static/            # 静的ファイル
├── dist/                  # ビルド出力
├── ecosystem.config.cjs   # PM2設定
├── wrangler.jsonc         # Cloudflare設定
├── vite.config.ts         # Vite設定
└── package.json
```

## Deployment

```bash
# Build and deploy to Cloudflare Pages
npm run deploy
```

## デザイン仕様

### カラーパレット
- **Primary Gradient**: #667eea → #764ba2
- **Background**: グラデーション
- **Text**: #ffffff（LP）, #333333（チャット）
- **Button**: #ffffff（LP）

### フォント
- システムフォント（-apple-system, Hiragino Sans等）

## 次のステップ

1. チャット画面の実装（AI連携）
2. まち描画・生成機能の追加
3. 結果の保存・共有機能

## Last Updated

2024-12-19
