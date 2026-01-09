/**
 * チャット画面（LINE風）
 * ユーザー情報収集 → モード選択 → 夢のまち入力 → 生成
 * 
 * 分割構成:
 * - styles/chat.ts: CSSスタイル
 * - chat/core.ts: 状態管理・メッセージ・ナビゲーション
 * - chat/userInfo.ts: ユーザー情報入力フロー
 * - chat/placeSelection.ts: 場所選択フロー（ちょい足しモード）
 * - chat/generateFlow.ts: 生成フロー（モード選択・オプション・生成）
 */

import { Context } from 'hono'
import { kawanishiData, ikedaData } from '../lib/places'
import { chatStyles } from '../styles/chat'
import { chatCoreScript } from '../chat/core'
import { userInfoScript } from '../chat/userInfo'
import { placeSelectionScript } from '../chat/placeSelection'
import { generateFlowScript } from '../chat/generateFlow'

// 場所データをJSON形式で埋め込み
const placesDataScript = `
const PLACES_DATA = {
  kawanishi: ${JSON.stringify(kawanishiData)},
  ikeda: ${JSON.stringify(ikedaData)}
};
`;

export const chatPage = (c: Context) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>ゆめまち - チャット</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>${chatStyles}</style>
</head>
<body>
  <div class="chat-container">
    <header class="chat-header">
      <div class="header-left" onclick="goBack()">
        <span>‹</span>
        <span>戻る</span>
      </div>
      <div class="header-title">ゆめまち</div>
      <div class="header-right" onclick="resetChat()">やり直し</div>
    </header>
    <div class="chat-messages" id="messages"></div>
    <div class="input-area" id="inputArea"></div>
  </div>

  <script>
    ${placesDataScript}
    ${chatCoreScript}
    ${userInfoScript}
    ${placeSelectionScript}
    ${generateFlowScript}
    
    // ========== 開始 ==========
    init();
  </script>
</body>
</html>
  `)
}
