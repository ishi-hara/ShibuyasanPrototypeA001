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
    function handleStart() {
      localStorage.setItem('lpSeen', 'true');
      window.location.href = '/chat';
    }
  </script>
</body>
</html>
  `)
})

// チャット画面（LINE風）
app.get('/chat', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>ゆめまち - チャット</title>
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
      background: #e8e8ed;
      display: flex;
      flex-direction: column;
      height: 100dvh;
    }

    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 480px;
      width: 100%;
      margin: 0 auto;
      background: #e8e8ed;
      height: 100%;
      overflow: hidden;
    }

    /* ヘッダー */
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #ffffff;
      border-bottom: 1px solid #d1d1d6;
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #007aff;
      font-size: 1rem;
      cursor: pointer;
      padding: 8px;
      margin: -8px;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .header-left:hover {
      background: rgba(0, 122, 255, 0.1);
    }

    .header-left:active {
      background: rgba(0, 122, 255, 0.2);
    }

    .header-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1c1c1e;
    }

    .header-right {
      font-size: 0.85rem;
      color: #8e8e93;
      cursor: pointer;
      padding: 8px;
      margin: -8px;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .header-right:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .header-right:active {
      background: rgba(0, 0, 0, 0.1);
    }

    /* チャットログエリア */
    .chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      -webkit-overflow-scrolling: touch;
    }

    .message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 18px;
      font-size: 0.95rem;
      line-height: 1.5;
      word-break: break-word;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.bot {
      align-self: flex-start;
      background: #ffffff;
      color: #1c1c1e;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .message.user {
      align-self: flex-end;
      background: #34c759;
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }

    /* 入力エリア（下部固定） */
    .input-area {
      padding: 12px 16px;
      padding-bottom: max(12px, env(safe-area-inset-bottom));
      background: #f2f2f7;
      border-top: 1px solid #d1d1d6;
      flex-shrink: 0;
    }

    /* テキスト入力 */
    .text-input-wrapper {
      display: flex;
      gap: 10px;
      align-items: flex-end;
    }

    .text-input {
      flex: 1;
      padding: 10px 16px;
      font-size: 1rem;
      border: 1px solid #d1d1d6;
      border-radius: 20px;
      outline: none;
      background: #ffffff;
      resize: none;
      min-height: 40px;
      max-height: 120px;
      line-height: 1.4;
      transition: border-color 0.2s;
    }

    .text-input:focus {
      border-color: #007aff;
    }

    .text-input::placeholder {
      color: #8e8e93;
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: #007aff;
      color: #ffffff;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.15s, opacity 0.15s, background 0.15s;
    }

    .send-btn:hover {
      background: #0056b3;
    }

    .send-btn:active {
      transform: scale(0.92);
    }

    .send-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* ボタン選択 */
    .button-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .option-btn {
      width: 100%;
      padding: 14px 20px;
      font-size: 1rem;
      font-weight: 500;
      color: #007aff;
      background: #ffffff;
      border: 1.5px solid #007aff;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      min-height: 50px;
    }

    .option-btn:hover {
      background: rgba(0, 122, 255, 0.08);
    }

    .option-btn:active {
      transform: scale(0.98);
      background: rgba(0, 122, 255, 0.15);
    }

    .option-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      border: none;
      font-weight: 600;
    }

    .option-btn.primary:hover {
      opacity: 0.9;
    }

    .option-btn.skip {
      background: transparent;
      border: 1px solid #8e8e93;
      color: #8e8e93;
      font-size: 0.9rem;
      min-height: 44px;
    }

    .option-btn.skip:hover {
      background: rgba(0, 0, 0, 0.03);
    }

    /* ボタン行（横並び） */
    .button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .button-row .option-btn {
      flex: 1 1 calc(50% - 4px);
      min-width: 120px;
      padding: 12px 16px;
      font-size: 0.9rem;
    }

    /* 生成ボタン */
    .generate-btn {
      width: 100%;
      padding: 16px 24px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 14px;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      min-height: 54px;
    }

    .generate-btn:hover {
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    .generate-btn:active {
      transform: scale(0.98);
    }

    /* 非表示 */
    .hidden {
      display: none !important;
    }

    /* スクロールバー */
    .chat-messages::-webkit-scrollbar {
      width: 4px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <!-- ヘッダー -->
    <header class="chat-header">
      <div class="header-left" onclick="goBack()">
        <span>‹</span>
        <span>戻る</span>
      </div>
      <div class="header-title">ゆめまち</div>
      <div class="header-right" onclick="resetChat()">やり直し</div>
    </header>

    <!-- チャットログ -->
    <div class="chat-messages" id="messages"></div>

    <!-- 入力エリア -->
    <div class="input-area" id="inputArea">
      <!-- 動的に切り替え -->
    </div>
  </div>

  <script>
    // ========== 状態管理 ==========
    const draft = {
      mode: '',
      placeText: '',
      userText: '',
      options: {
        users: [],
        atmosphere: [],
        viewpoint: '',
        style: ''
      }
    };

    let stepIndex = 0;
    let currentMode = '';
    const messages = [];

    // ========== DOM要素 ==========
    const messagesContainer = document.getElementById('messages');
    const inputArea = document.getElementById('inputArea');

    // ========== 初期化 ==========
    function init() {
      // Step0: 初回メッセージ
      addBotMessage('こんにちは！"夢のまち"を一緒に描こう。');
      setTimeout(() => {
        addBotMessage('まず作り方を選んでね。');
        showModeSelection();
      }, 600);
    }

    // ========== メッセージ追加 ==========
    function addBotMessage(text) {
      messages.push({ role: 'bot', text });
      renderMessage('bot', text);
    }

    function addUserMessage(text) {
      messages.push({ role: 'user', text });
      renderMessage('user', text);
    }

    function renderMessage(role, text) {
      const div = document.createElement('div');
      div.className = 'message ' + role;
      div.textContent = text;
      messagesContainer.appendChild(div);
      scrollToBottom();
    }

    function scrollToBottom() {
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 50);
    }

    // ========== 入力UI ==========
    function showModeSelection() {
      stepIndex = 1;
      inputArea.innerHTML = \`
        <div class="button-options">
          <button class="option-btn" onclick="selectMode('dreamer')">①お任せ（かんたん）</button>
          <button class="option-btn" onclick="selectMode('arranger')">②ちょい足し（少しこだわる）</button>
        </div>
      \`;
    }

    function showPlaceInput() {
      stepIndex = 2;
      inputArea.innerHTML = \`
        <div class="text-input-wrapper">
          <input type="text" class="text-input" id="placeInput" placeholder="例：川西能勢口駅前、池田市役所周辺" autocomplete="off">
          <button class="send-btn" onclick="submitPlace()">➤</button>
        </div>
        <div style="margin-top: 10px;">
          <button class="option-btn skip" onclick="skipPlace()">スキップ</button>
        </div>
      \`;
      const input = document.getElementById('placeInput');
      input.focus();
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitPlace();
      });
    }

    function showIdeaInput() {
      stepIndex = 3;
      inputArea.innerHTML = \`
        <div class="text-input-wrapper">
          <textarea class="text-input" id="ideaInput" rows="3" placeholder="80〜200文字くらいで教えてね（短くてもOK）"></textarea>
          <button class="send-btn" onclick="submitIdea()">➤</button>
        </div>
      \`;
      const textarea = document.getElementById('ideaInput');
      textarea.focus();
      textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitIdea();
        }
      });
      // 自動リサイズ
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      });
    }

    function showUsersSelection() {
      stepIndex = 4;
      const options = ['こども', 'ティーン', '大人', '高齢者', '家族', '全世代'];
      inputArea.innerHTML = \`
        <div class="button-options">
          <div class="button-row">
            \${options.map(o => \`<button class="option-btn" onclick="selectUsers('\${o}')">\${o}</button>\`).join('')}
          </div>
        </div>
      \`;
    }

    function showAtmosphereSelection() {
      stepIndex = 5;
      const options = ['ナチュラル', 'カラフル', '落ち着いた', 'にぎやか', 'レトロ', '先進的'];
      inputArea.innerHTML = \`
        <div class="button-options">
          <div class="button-row">
            \${options.map(o => \`<button class="option-btn" onclick="selectAtmosphere('\${o}')">\${o}</button>\`).join('')}
          </div>
        </div>
      \`;
    }

    function showViewpointSelection() {
      stepIndex = 6;
      const options = ['目の高さ', '鳥の目', 'ななめ上'];
      inputArea.innerHTML = \`
        <div class="button-options">
          <div class="button-row">
            \${options.map(o => \`<button class="option-btn" onclick="selectViewpoint('\${o}')">\${o}</button>\`).join('')}
          </div>
        </div>
      \`;
    }

    function showStyleSelection() {
      stepIndex = 7;
      const options = ['リアル写真風', 'イラスト風', '水彩画風', 'アニメ風'];
      inputArea.innerHTML = \`
        <div class="button-options">
          <div class="button-row">
            \${options.map(o => \`<button class="option-btn" onclick="selectStyle('\${o}')">\${o}</button>\`).join('')}
          </div>
        </div>
      \`;
    }

    function showGenerateButton() {
      stepIndex = 99;
      inputArea.innerHTML = \`
        <button class="generate-btn" onclick="generate()">生成する</button>
      \`;
    }

    // ========== 選択ハンドラ ==========
    function selectMode(mode) {
      currentMode = mode;
      draft.mode = mode;
      const label = mode === 'dreamer' ? '①お任せ（かんたん）' : '②ちょい足し（少しこだわる）';
      addUserMessage(label);

      setTimeout(() => {
        addBotMessage('場所はどこにする？（未入力でもOK）');
        showPlaceInput();
      }, 400);
    }

    function submitPlace() {
      const input = document.getElementById('placeInput');
      const value = input.value.trim();
      draft.placeText = value;
      
      if (value) {
        addUserMessage(value);
      } else {
        addUserMessage('（未入力）');
      }

      setTimeout(() => {
        addBotMessage('どんな"夢のまち"にしたい？自由に教えてね');
        showIdeaInput();
      }, 400);
    }

    function skipPlace() {
      draft.placeText = '';
      addUserMessage('スキップ');

      setTimeout(() => {
        addBotMessage('どんな"夢のまち"にしたい？自由に教えてね');
        showIdeaInput();
      }, 400);
    }

    function submitIdea() {
      const textarea = document.getElementById('ideaInput');
      const value = textarea.value.trim();

      if (!value) {
        alert('1行でもいいので入力してね');
        textarea.focus();
        return;
      }

      draft.userText = value;
      addUserMessage(value);

      setTimeout(() => {
        if (currentMode === 'arranger') {
          // モード②: 追加オプション
          addBotMessage('だれ向けのまち？');
          showUsersSelection();
        } else {
          // モード①: 生成へ
          addBotMessage('いいね！画像をつくるよ。');
          showGenerateButton();
        }
      }, 400);
    }

    function selectUsers(value) {
      draft.options.users = [value];
      addUserMessage(value);

      setTimeout(() => {
        addBotMessage('どんな雰囲気？');
        showAtmosphereSelection();
      }, 400);
    }

    function selectAtmosphere(value) {
      draft.options.atmosphere = [value];
      addUserMessage(value);

      setTimeout(() => {
        addBotMessage('どこから見たい？');
        showViewpointSelection();
      }, 400);
    }

    function selectViewpoint(value) {
      draft.options.viewpoint = value;
      addUserMessage(value);

      setTimeout(() => {
        addBotMessage('どんな絵のテイスト？');
        showStyleSelection();
      }, 400);
    }

    function selectStyle(value) {
      draft.options.style = value;
      addUserMessage(value);

      setTimeout(() => {
        addBotMessage('いいね！画像をつくるよ。');
        showGenerateButton();
      }, 400);
    }

    // ========== 生成 ==========
    async function generate() {
      const btn = document.querySelector('.generate-btn');
      btn.disabled = true;
      btn.textContent = '送信中...';

      const payload = {
        mode: draft.mode,
        placeText: draft.placeText,
        userText: draft.userText,
        options: draft.options
      };

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('API Error');

        const data = await res.json();
        
        // 結果を保存して遷移
        sessionStorage.setItem('generateRequest', JSON.stringify(payload));
        sessionStorage.setItem('generateResult', JSON.stringify(data));
        window.location.href = '/loading';

      } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.textContent = '生成する';
        addBotMessage('ごめんね、エラーが起きたみたい。もう一度試してね。');
      }
    }

    // ========== ナビゲーション ==========
    function goBack() {
      window.location.href = '/';
    }

    function resetChat() {
      if (confirm('最初からやり直しますか？')) {
        // リセット
        draft.mode = '';
        draft.placeText = '';
        draft.userText = '';
        draft.options = { users: [], atmosphere: [], viewpoint: '', style: '' };
        stepIndex = 0;
        currentMode = '';
        messages.length = 0;
        messagesContainer.innerHTML = '';
        init();
      }
    }

    // ========== 開始 ==========
    init();
  </script>
</body>
</html>
  `)
})

// ローディング画面（画像生成中）
app.get('/loading', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>生成中... - ゆめまち</title>
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
      text-align: center;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .loading-text {
      color: #ffffff;
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.6;
    }

    .loading-sub {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      margin-top: 8px;
    }

    .progress-dots {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .progress-dot {
      width: 10px;
      height: 10px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .progress-dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .progress-dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.4;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
    }
  </style>
</head>
<body>
  <div class="loading-container">
    <div class="spinner"></div>
    <div>
      <div class="loading-text">夢のまちを描いています...</div>
      <div class="loading-sub">少々お待ちください</div>
    </div>
    <div class="progress-dots">
      <div class="progress-dot"></div>
      <div class="progress-dot"></div>
      <div class="progress-dot"></div>
    </div>
  </div>

  <script>
    // 生成リクエストの確認
    const request = sessionStorage.getItem('generateRequest');
    const result = sessionStorage.getItem('generateResult');

    if (!request) {
      // リクエストがない場合はチャットに戻す
      window.location.href = '/chat';
    } else if (result) {
      // 結果がある場合は結果画面へ（今後実装）
      // window.location.href = '/result';
      console.log('Result:', JSON.parse(result));
    }

    // デモ用: 3秒後にアラート
    setTimeout(() => {
      const data = JSON.parse(result || '{}');
      alert('生成完了！\\n\\n' + JSON.stringify(data, null, 2));
    }, 2000);
  </script>
</body>
</html>
  `)
})

// 生成API
app.post('/api/generate', async (c) => {
  try {
    const body = await c.req.json()
    
    const { mode, placeText, userText, options } = body

    // バリデーション
    if (!mode || !userText) {
      return c.json({ error: 'mode と userText は必須です' }, 400)
    }

    // ここで実際の画像生成処理を行う（今後実装）
    // 現時点ではモックレスポンス
    const response = {
      success: true,
      requestId: crypto.randomUUID(),
      input: {
        mode,
        placeText,
        userText,
        options
      },
      message: '画像生成リクエストを受け付けました',
      // 今後: imageUrl, prompt などを返す
    }

    return c.json(response)
  } catch (error) {
    console.error('Generate API Error:', error)
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

export default app
