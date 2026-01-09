/**
 * ゆめまち - メインエントリーポイント
 * 
 * アプリケーション構成:
 * - LP画面（/）: 入口、「はじめる」ボタン
 * - チャット画面（/chat）: LINE風UI、ユーザー情報収集→モード選択→入力
 * - ローディング画面（/loading）: 画像生成中の表示
 * - 結果画面（/result）: 生成された画像の表示
 * - 生成API（/api/generate）: DALL-E 3による画像生成
 */

import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'

// ページ
import { lpPage } from './pages/lp'
import { chatPage } from './pages/chat'
import { loadingPage } from './pages/loading'
import { resultPage } from './pages/result'

// API
import { generateApi } from './api/generate'

// 環境変数の型定義
type Bindings = {
  OPENAI_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// 静的ファイル配信
app.use('/static/*', serveStatic())

// ========== ページルーティング ==========
app.get('/', lpPage)
app.get('/chat', chatPage)
app.get('/loading', loadingPage)
app.get('/result', resultPage)

// ========== APIルーティング ==========
app.post('/api/generate', generateApi)

export default app
