import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'

const app = new Hono()

// 静的ファイル配信
app.use('/static/*', serveStatic())

// LP画面（入口）
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>夢のまちを描こう</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', Meiryo, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100dvh;
      padding: 20px;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 480px;
      gap: 48px;
      transform: translateY(-10%);
    }

    .catchcopy {
      color: #ffffff;
      font-size: clamp(1.5rem, 6vw, 2rem);
      font-weight: 600;
      text-align: center;
      line-height: 1.6;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
      letter-spacing: 0.05em;
    }

    .start-button {
      width: 85%;
      min-width: 280px;
      max-width: 400px;
      padding: 18px 32px;
      font-size: 1.25rem;
      font-weight: 600;
      color: #667eea;
      background: #ffffff;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .start-button:hover {
      transform: scale(1.03);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
    }

    .start-button:active {
      transform: scale(0.97);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    /* リップルエフェクト */
    .start-button {
      position: relative;
      overflow: hidden;
    }

    .start-button::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(102, 126, 234, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.4s ease, height 0.4s ease;
    }

    .start-button:active::after {
      width: 300px;
      height: 300px;
    }

    /* アクセシビリティ */
    .start-button:focus {
      outline: 3px solid rgba(255, 255, 255, 0.5);
      outline-offset: 4px;
    }

    @media (prefers-reduced-motion: reduce) {
      .start-button {
        transition: none;
      }
      .start-button::after {
        display: none;
      }
    }
  </style>
</head>
<body>
  <main class="container">
    <h1 class="catchcopy">AIと一緒に、<br>夢のまちをえがこう。</h1>
    <button class="start-button" onclick="handleStart()">はじめる</button>
  </main>

  <script>
    // 初回訪問チェック（オプション機能）
    function checkFirstVisit() {
      const lpSeen = localStorage.getItem('lpSeen');
      if (lpSeen === 'true') {
        // 2回目以降はスキップ可能（今回は無効）
        // window.location.href = '/chat';
      }
    }

    function handleStart() {
      localStorage.setItem('lpSeen', 'true');
      window.location.href = '/chat';
    }

    // ページロード時にチェック
    // checkFirstVisit();
  </script>
</body>
</html>
  `)
})

// チャット画面（画面②のプレースホルダー）
app.get('/chat', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>チャット - 夢のまちを描こう</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
      width: 100%;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', Meiryo, sans-serif;
      background: #f5f5f7;
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }

    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 480px;
      width: 100%;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
    }

    .chat-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-align: center;
      font-size: 1rem;
      font-weight: 600;
    }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .message.bot {
      align-self: flex-start;
      background: #f0f0f5;
      color: #333;
      border-bottom-left-radius: 4px;
    }

    .chat-input-area {
      padding: 16px 20px;
      border-top: 1px solid #e5e5e5;
      background: #ffffff;
    }

    .chat-input-wrapper {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .chat-input {
      flex: 1;
      padding: 12px 16px;
      font-size: 1rem;
      border: 2px solid #e5e5e5;
      border-radius: 24px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .chat-input:focus {
      border-color: #667eea;
    }

    .send-button {
      width: 48px;
      height: 48px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }

    .send-button:hover {
      transform: scale(1.05);
    }

    .send-button:active {
      transform: scale(0.95);
    }

    .send-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <header class="chat-header">
      夢のまちをえがこう
    </header>
    
    <div class="chat-messages" id="messages">
      <div class="message bot">
        こんにちは！どんなまちを描いてみたいですか？🏠✨
      </div>
    </div>
    
    <div class="chat-input-area">
      <div class="chat-input-wrapper">
        <input 
          type="text" 
          class="chat-input" 
          id="chatInput"
          placeholder="あなたの夢のまちを教えてね..."
          autocomplete="off"
        >
        <button class="send-button" id="sendButton">
          ➤
        </button>
      </div>
    </div>
  </div>

  <script>
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const messagesContainer = document.getElementById('messages');

    // 送信ボタンクリック
    sendButton.addEventListener('click', sendMessage);

    // Enterキーで送信
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      // ユーザーメッセージを追加
      addMessage(message, 'user');
      chatInput.value = '';

      // プレースホルダー応答（後で実装）
      setTimeout(() => {
        addMessage('素敵なアイデアですね！画面②の実装でチャット機能を追加していきます。', 'bot');
      }, 500);
    }

    function addMessage(text, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message ' + type;
      messageDiv.textContent = text;
      
      if (type === 'user') {
        messageDiv.style.alignSelf = 'flex-end';
        messageDiv.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        messageDiv.style.color = '#ffffff';
        messageDiv.style.borderBottomRightRadius = '4px';
      }
      
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  </script>
</body>
</html>
  `)
})

export default app
