# ゆめまち - 夢のまちを描こう

AIと一緒に、あなたの夢のまちを描くWebアプリケーション

## Project Overview

- **Name**: ゆめまち（Dream Town）
- **Goal**: ユーザーがAIと対話しながら、理想のまちを描いていく体験を提供
- **Features**: 
  - シンプルなLP（入口）画面
  - LINE風チャットベースのインタラクション
  - 2つのモード（お任せ/ちょい足し）

## URLs

- **Preview**: https://3000-io4rv84gp3le19u3ispdo-ad490db5.sandbox.novita.ai
- **LP画面**: `/`
- **チャット画面**: `/chat`
- **ローディング画面**: `/loading`
- **生成API**: `POST /api/generate`

## 完成した機能

### 画面① LP（入口）
- ✅ キャッチコピー「AIと一緒に、夢のまちをえがこう。」
- ✅ 「はじめる」ボタン（画面幅85%、タップしやすいサイズ）
- ✅ グラデーション背景（#667eea → #764ba2）
- ✅ タップ時のリップルエフェクト
- ✅ スマートフォン最適化（100dvh対応）

### 画面② チャット入力（LINE風）
- ✅ ヘッダー（戻る / タイトル「ゆめまち」 / やり直し）
- ✅ LINE風チャットログ（左:ボット吹き出し、右:ユーザー吹き出し）
- ✅ 自動スクロール（新規メッセージ追加時）
- ✅ 1画面1質問のステップ方式

#### 入力フロー
| Step | 内容 | UI |
|------|------|-----|
| 0 | 初回メッセージ | - |
| 1 | モード選択 | ボタン2つ |
| 2 | 場所入力（任意） | テキスト入力 + スキップ |
| 3 | アイデア入力（必須） | テキストエリア |
| 4 | 利用者（モード②のみ） | ボタン選択 |
| 5 | 雰囲気（モード②のみ） | ボタン選択 |
| 6 | 視点（モード②のみ） | ボタン選択 |
| 7 | 作風（モード②のみ） | ボタン選択 |
| 99 | 生成する | 大きなボタン |

#### モード
- **①お任せ（かんたん）**: 場所→アイデア→生成
- **②ちょい足し（少しこだわる）**: 場所→アイデア→4つの追加質問→生成

### 画面③ ローディング
- ✅ スピナーアニメーション
- ✅ プログレスドット
- ✅ sessionStorageから生成リクエスト/結果を読み取り

### API
- ✅ `POST /api/generate` - 画像生成リクエスト受付

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

**レスポンス:**
```json
{
  "success": true,
  "requestId": "uuid",
  "input": { ... },
  "message": "画像生成リクエストを受け付けました"
}
```

## 未実装機能

- [ ] 実際のAI画像生成連携
- [ ] 結果表示画面（/result）
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
│   └── index.tsx          # メインアプリケーション
│       ├── GET /          # LP画面
│       ├── GET /chat      # チャット画面
│       ├── GET /loading   # ローディング画面
│       └── POST /api/generate  # 生成API
├── public/
│   └── static/            # 静的ファイル
├── dist/                  # ビルド出力
├── ecosystem.config.cjs   # PM2設定
├── wrangler.jsonc         # Cloudflare設定
└── package.json
```

## デザイン仕様

### カラーパレット
- **Primary Gradient**: #667eea → #764ba2
- **Chat Background**: #e8e8ed（LINE風グレー）
- **Bot Bubble**: #ffffff
- **User Bubble**: #34c759（LINE風グリーン）
- **Accent**: #007aff（iOS Blue）

### UI特徴
- LINE風チャットインターフェース
- 大きなタップターゲット（48px以上）
- スマートフォンファースト設計
- 100dvh対応（モバイルブラウザ対応）

## 次のステップ

1. AI画像生成APIの連携
2. 結果表示画面（/result）の実装
3. 画像の保存・共有機能

## Last Updated

2024-12-19
