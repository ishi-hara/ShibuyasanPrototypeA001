import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'

// 環境変数の型定義
type Bindings = {
  OPENAI_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// 静的ファイル配信
app.use('/static/*', serveStatic())

// ========== プロンプト生成ロジック ==========
function generatePrompt(input: {
  mode: string
  placeText: string
  userText: string
  options: {
    users: string[]
    atmosphere: string[]
    viewpoint: string
    style: string
  }
}): string {
  const { mode, placeText, userText, options } = input

  // 基本プロンプト
  let prompt = `A beautiful illustration of a dream town/city scene. `

  // ユーザーのアイデアを追加
  prompt += `The scene depicts: ${userText}. `

  // 場所が指定されている場合
  if (placeText) {
    prompt += `Location inspiration: ${placeText} area in Japan. `
  }

  // モード②の追加オプション
  if (mode === 'arranger' && options) {
    // 利用者
    if (options.users && options.users.length > 0) {
      const userMap: Record<string, string> = {
        'こども': 'children playing',
        'ティーン': 'teenagers hanging out',
        '大人': 'adults relaxing',
        '高齢者': 'elderly people enjoying',
        '家族': 'families with children',
        '全世代': 'people of all ages'
      }
      const userDesc = options.users.map(u => userMap[u] || u).join(', ')
      prompt += `The scene includes ${userDesc}. `
    }

    // 雰囲気
    if (options.atmosphere && options.atmosphere.length > 0) {
      const atmosphereMap: Record<string, string> = {
        'ナチュラル': 'natural and organic atmosphere with greenery',
        'カラフル': 'colorful and vibrant atmosphere',
        '落ち着いた': 'calm and peaceful atmosphere',
        'にぎやか': 'lively and bustling atmosphere',
        'レトロ': 'retro and nostalgic atmosphere',
        '先進的': 'futuristic and modern atmosphere'
      }
      const atmDesc = options.atmosphere.map(a => atmosphereMap[a] || a).join(', ')
      prompt += `${atmDesc}. `
    }

    // 視点
    if (options.viewpoint) {
      const viewpointMap: Record<string, string> = {
        '目の高さ': 'eye-level perspective, street view',
        '鳥の目': 'bird\'s eye view, aerial perspective',
        'ななめ上': 'elevated angle, 45-degree perspective from above'
      }
      prompt += `${viewpointMap[options.viewpoint] || options.viewpoint}. `
    }

    // 作風
    if (options.style) {
      const styleMap: Record<string, string> = {
        'リアル写真風': 'photorealistic, high detail photograph style',
        'イラスト風': 'digital illustration style, clean lines',
        '水彩画風': 'watercolor painting style, soft edges',
        'アニメ風': 'anime style, Japanese animation aesthetic'
      }
      prompt += `Art style: ${styleMap[options.style] || options.style}. `
    }
  } else {
    // モード①のデフォルトスタイル
    prompt += `Art style: warm and inviting digital illustration, soft lighting, cheerful atmosphere. `
  }

  // 共通の品質指示
  prompt += `High quality, detailed, beautiful composition, warm colors, inviting atmosphere.`

  return prompt
}

// ========== LP画面（入口） ==========
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>夢のまちを描こう</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; width: 100%; overflow: hidden; }
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
      position: relative;
      overflow: hidden;
    }
    .start-button:hover { transform: scale(1.03); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25); }
    .start-button:active { transform: scale(0.97); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
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
    .start-button:active::after { width: 300px; height: 300px; }
    .start-button:focus { outline: 3px solid rgba(255, 255, 255, 0.5); outline-offset: 4px; }
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

// ========== チャット画面（LINE風） ==========
app.get('/chat', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>ゆめまち - チャット</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; width: 100%; overflow: hidden; }
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
    .header-left:hover { background: rgba(0, 122, 255, 0.1); }
    .header-left:active { background: rgba(0, 122, 255, 0.2); }
    .header-title { font-size: 1.1rem; font-weight: 600; color: #1c1c1e; }
    .header-right {
      font-size: 0.85rem;
      color: #8e8e93;
      cursor: pointer;
      padding: 8px;
      margin: -8px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .header-right:hover { background: rgba(0, 0, 0, 0.05); }
    .header-right:active { background: rgba(0, 0, 0, 0.1); }
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
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
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
    .input-area {
      padding: 12px 16px;
      padding-bottom: max(12px, env(safe-area-inset-bottom));
      background: #f2f2f7;
      border-top: 1px solid #d1d1d6;
      flex-shrink: 0;
    }
    .text-input-wrapper { display: flex; gap: 10px; align-items: flex-end; }
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
    .text-input:focus { border-color: #007aff; }
    .text-input::placeholder { color: #8e8e93; }
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
    .send-btn:hover { background: #0056b3; }
    .send-btn:active { transform: scale(0.92); }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .button-options { display: flex; flex-direction: column; gap: 10px; }
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
    .option-btn:hover { background: rgba(0, 122, 255, 0.08); }
    .option-btn:active { transform: scale(0.98); background: rgba(0, 122, 255, 0.15); }
    .option-btn.skip {
      background: transparent;
      border: 1px solid #8e8e93;
      color: #8e8e93;
      font-size: 0.9rem;
      min-height: 44px;
    }
    .option-btn.skip:hover { background: rgba(0, 0, 0, 0.03); }
    .button-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .button-row .option-btn {
      flex: 1 1 calc(50% - 4px);
      min-width: 120px;
      padding: 12px 16px;
      font-size: 0.9rem;
    }
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
    .generate-btn:hover { box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5); }
    .generate-btn:active { transform: scale(0.98); }
    .generate-btn:disabled { opacity: 0.7; cursor: not-allowed; }
    .chat-messages::-webkit-scrollbar { width: 4px; }
    .chat-messages::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2); border-radius: 2px; }
  </style>
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
    const draft = {
      mode: '',
      placeText: '',
      userText: '',
      options: { users: [], atmosphere: [], viewpoint: '', style: '' }
    };
    let currentMode = '';
    const messagesContainer = document.getElementById('messages');
    const inputArea = document.getElementById('inputArea');

    function init() {
      addBotMessage('こんにちは！"夢のまち"を一緒に描こう。');
      setTimeout(() => {
        addBotMessage('まず作り方を選んでね。');
        showModeSelection();
      }, 600);
    }

    function addBotMessage(text) {
      renderMessage('bot', text);
    }

    function addUserMessage(text) {
      renderMessage('user', text);
    }

    function renderMessage(role, text) {
      const div = document.createElement('div');
      div.className = 'message ' + role;
      div.textContent = text;
      messagesContainer.appendChild(div);
      setTimeout(() => { messagesContainer.scrollTop = messagesContainer.scrollHeight; }, 50);
    }

    function showModeSelection() {
      inputArea.innerHTML = \`
        <div class="button-options">
          <button class="option-btn" onclick="selectMode('dreamer')">①お任せ（かんたん）</button>
          <button class="option-btn" onclick="selectMode('arranger')">②ちょい足し（少しこだわる）</button>
        </div>
      \`;
    }

    function showPlaceInput() {
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
      input.addEventListener('keypress', (e) => { if (e.key === 'Enter') submitPlace(); });
    }

    function showIdeaInput() {
      inputArea.innerHTML = \`
        <div class="text-input-wrapper">
          <textarea class="text-input" id="ideaInput" rows="3" placeholder="80〜200文字くらいで教えてね（短くてもOK）"></textarea>
          <button class="send-btn" onclick="submitIdea()">➤</button>
        </div>
      \`;
      const textarea = document.getElementById('ideaInput');
      textarea.focus();
      textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitIdea(); }
      });
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      });
    }

    function showUsersSelection() {
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
      inputArea.innerHTML = \`<button class="generate-btn" onclick="generate()">生成する</button>\`;
    }

    function selectMode(mode) {
      currentMode = mode;
      draft.mode = mode;
      addUserMessage(mode === 'dreamer' ? '①お任せ（かんたん）' : '②ちょい足し（少しこだわる）');
      setTimeout(() => { addBotMessage('場所はどこにする？（未入力でもOK）'); showPlaceInput(); }, 400);
    }

    function submitPlace() {
      const value = document.getElementById('placeInput').value.trim();
      draft.placeText = value;
      addUserMessage(value || '（未入力）');
      setTimeout(() => { addBotMessage('どんな"夢のまち"にしたい？自由に教えてね'); showIdeaInput(); }, 400);
    }

    function skipPlace() {
      draft.placeText = '';
      addUserMessage('スキップ');
      setTimeout(() => { addBotMessage('どんな"夢のまち"にしたい？自由に教えてね'); showIdeaInput(); }, 400);
    }

    function submitIdea() {
      const value = document.getElementById('ideaInput').value.trim();
      if (!value) { alert('1行でもいいので入力してね'); return; }
      draft.userText = value;
      addUserMessage(value);
      setTimeout(() => {
        if (currentMode === 'arranger') {
          addBotMessage('だれ向けのまち？');
          showUsersSelection();
        } else {
          addBotMessage('いいね！画像をつくるよ。');
          showGenerateButton();
        }
      }, 400);
    }

    function selectUsers(value) {
      draft.options.users = [value];
      addUserMessage(value);
      setTimeout(() => { addBotMessage('どんな雰囲気？'); showAtmosphereSelection(); }, 400);
    }

    function selectAtmosphere(value) {
      draft.options.atmosphere = [value];
      addUserMessage(value);
      setTimeout(() => { addBotMessage('どこから見たい？'); showViewpointSelection(); }, 400);
    }

    function selectViewpoint(value) {
      draft.options.viewpoint = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('どんな絵のテイスト？'); showStyleSelection(); }, 400);
    }

    function selectStyle(value) {
      draft.options.style = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('いいね！画像をつくるよ。'); showGenerateButton(); }, 400);
    }

    async function generate() {
      const btn = document.querySelector('.generate-btn');
      btn.disabled = true;
      btn.textContent = '生成中...';

      const payload = {
        mode: draft.mode,
        placeText: draft.placeText,
        userText: draft.userText,
        options: draft.options
      };

      // リクエストを保存してローディング画面へ遷移
      sessionStorage.setItem('generateRequest', JSON.stringify(payload));
      window.location.href = '/loading';
    }

    function goBack() { window.location.href = '/'; }

    function resetChat() {
      if (confirm('最初からやり直しますか？')) {
        draft.mode = '';
        draft.placeText = '';
        draft.userText = '';
        draft.options = { users: [], atmosphere: [], viewpoint: '', style: '' };
        currentMode = '';
        messagesContainer.innerHTML = '';
        init();
      }
    }

    init();
  </script>
</body>
</html>
  `)
})

// ========== ローディング画面（画像生成実行） ==========
app.get('/loading', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>生成中... - ゆめまち</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; width: 100%; overflow: hidden; }
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
    @keyframes spin { to { transform: rotate(360deg); } }
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
    .progress-dots { display: flex; gap: 8px; margin-top: 16px; }
    .progress-dot {
      width: 10px;
      height: 10px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }
    .progress-dot:nth-child(2) { animation-delay: 0.2s; }
    .progress-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    .error-container {
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      text-align: center;
    }
    .error-icon { font-size: 48px; }
    .error-text { color: #ffffff; font-size: 1.1rem; line-height: 1.6; }
    .retry-btn {
      padding: 14px 32px;
      font-size: 1rem;
      font-weight: 600;
      color: #667eea;
      background: #ffffff;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      transition: transform 0.15s;
    }
    .retry-btn:hover { transform: scale(1.05); }
    .retry-btn:active { transform: scale(0.98); }
  </style>
</head>
<body>
  <div class="loading-container" id="loadingContainer">
    <div class="spinner"></div>
    <div>
      <div class="loading-text" id="loadingText">夢のまちを描いています...</div>
      <div class="loading-sub" id="loadingSub">AIが画像を生成中です（20〜30秒ほどかかります）</div>
    </div>
    <div class="progress-dots">
      <div class="progress-dot"></div>
      <div class="progress-dot"></div>
      <div class="progress-dot"></div>
    </div>
  </div>

  <div class="error-container" id="errorContainer">
    <div class="error-icon">😢</div>
    <div class="error-text" id="errorText">画像の生成に失敗しました</div>
    <button class="retry-btn" onclick="retry()">もう一度試す</button>
    <button class="retry-btn" onclick="goBack()" style="background: transparent; color: white; border: 2px solid white;">戻る</button>
  </div>

  <script>
    const request = sessionStorage.getItem('generateRequest');
    
    if (!request) {
      window.location.href = '/chat';
    } else {
      generateImage(JSON.parse(request));
    }

    async function generateImage(payload) {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || '画像生成に失敗しました');
        }

        // 成功：結果を保存して結果画面へ
        sessionStorage.setItem('generateResult', JSON.stringify(data));
        window.location.href = '/result';

      } catch (err) {
        console.error('Generation error:', err);
        showError(err.message);
      }
    }

    function showError(message) {
      document.getElementById('loadingContainer').style.display = 'none';
      document.getElementById('errorContainer').style.display = 'flex';
      document.getElementById('errorText').textContent = message || '画像の生成に失敗しました';
    }

    function retry() {
      document.getElementById('errorContainer').style.display = 'none';
      document.getElementById('loadingContainer').style.display = 'flex';
      const request = sessionStorage.getItem('generateRequest');
      if (request) {
        generateImage(JSON.parse(request));
      }
    }

    function goBack() {
      window.location.href = '/chat';
    }
  </script>
</body>
</html>
  `)
})

// ========== 結果表示画面 ==========
app.get('/result', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>完成！ - ゆめまち</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; width: 100%; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', Meiryo, sans-serif;
      background: #f5f5f7;
      min-height: 100dvh;
    }
    .result-container {
      max-width: 480px;
      width: 100%;
      margin: 0 auto;
      background: #ffffff;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
    }
    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
    }
    .header-back {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #ffffff;
      font-size: 1rem;
      cursor: pointer;
      padding: 8px;
      margin: -8px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .header-back:hover { background: rgba(255, 255, 255, 0.2); }
    .header-title { font-size: 1.1rem; font-weight: 600; }
    .header-spacer { width: 60px; }
    .result-content {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .result-image-container {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      background: #e8e8ed;
    }
    .result-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .result-title {
      font-size: 1.3rem;
      font-weight: 600;
      color: #1c1c1e;
      text-align: center;
    }
    .result-description {
      font-size: 0.95rem;
      color: #666;
      line-height: 1.6;
      text-align: center;
    }
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 20px;
      padding-bottom: max(20px, env(safe-area-inset-bottom));
      background: #ffffff;
      border-top: 1px solid #e5e5e5;
    }
    .action-btn {
      width: 100%;
      padding: 16px 24px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 14px;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      border: none;
    }
    .action-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    .action-btn.primary:hover { box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5); }
    .action-btn.secondary {
      background: #ffffff;
      color: #667eea;
      border: 2px solid #667eea;
    }
    .action-btn.secondary:hover { background: rgba(102, 126, 234, 0.05); }
    .action-btn:active { transform: scale(0.98); }
    .prompt-section {
      background: #f8f8f8;
      border-radius: 12px;
      padding: 16px;
    }
    .prompt-label {
      font-size: 0.8rem;
      color: #8e8e93;
      margin-bottom: 8px;
    }
    .prompt-text {
      font-size: 0.85rem;
      color: #666;
      line-height: 1.5;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <div class="result-container">
    <header class="result-header">
      <div class="header-back" onclick="goToChat()">
        <span>‹</span>
        <span>戻る</span>
      </div>
      <div class="header-title">完成！</div>
      <div class="header-spacer"></div>
    </header>

    <div class="result-content" id="resultContent">
      <div class="result-image-container">
        <img class="result-image" id="resultImage" src="" alt="生成された画像">
      </div>
      <h1 class="result-title">あなたの夢のまち</h1>
      <p class="result-description" id="resultDescription"></p>
      <div class="prompt-section">
        <div class="prompt-label">使用したプロンプト</div>
        <div class="prompt-text" id="promptText"></div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-btn primary" onclick="downloadImage()">画像を保存</button>
      <button class="action-btn secondary" onclick="createNew()">もう一度つくる</button>
    </div>
  </div>

  <script>
    const result = sessionStorage.getItem('generateResult');
    const request = sessionStorage.getItem('generateRequest');

    if (!result) {
      window.location.href = '/chat';
    } else {
      displayResult(JSON.parse(result), JSON.parse(request || '{}'));
    }

    function displayResult(data, requestData) {
      document.getElementById('resultImage').src = data.imageUrl;
      document.getElementById('resultDescription').textContent = requestData.userText || '';
      document.getElementById('promptText').textContent = data.prompt || '';
    }

    function downloadImage() {
      const result = JSON.parse(sessionStorage.getItem('generateResult') || '{}');
      if (result.imageUrl) {
        const link = document.createElement('a');
        link.href = result.imageUrl;
        link.download = 'yumemachi-' + Date.now() + '.png';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    function createNew() {
      sessionStorage.removeItem('generateRequest');
      sessionStorage.removeItem('generateResult');
      window.location.href = '/chat';
    }

    function goToChat() {
      window.location.href = '/chat';
    }
  </script>
</body>
</html>
  `)
})

// ========== 画像生成API ==========
app.post('/api/generate', async (c) => {
  try {
    const body = await c.req.json()
    const { mode, placeText, userText, options } = body

    // バリデーション
    if (!mode || !userText) {
      return c.json({ error: 'mode と userText は必須です', success: false }, 400)
    }

    // プロンプト生成
    const prompt = generatePrompt({ mode, placeText, userText, options })

    // OpenAI API Key
    const apiKey = c.env.OPENAI_API_KEY
    if (!apiKey) {
      return c.json({ error: 'OpenAI API Keyが設定されていません', success: false }, 500)
    }

    // DALL-E 3 API呼び出し
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}))
      console.error('OpenAI API Error:', errorData)
      
      // エラーメッセージの整形
      let errorMessage = '画像生成に失敗しました'
      if (errorData.error?.message) {
        if (errorData.error.message.includes('content_policy')) {
          errorMessage = 'コンテンツポリシーに抵触しました。別の内容で試してください。'
        } else if (errorData.error.message.includes('rate_limit')) {
          errorMessage = 'APIの利用制限に達しました。しばらく待ってから再試行してください。'
        } else if (errorData.error.message.includes('invalid_api_key')) {
          errorMessage = 'APIキーが無効です。'
        }
      }
      
      return c.json({ error: errorMessage, success: false }, 500)
    }

    const openaiData = await openaiResponse.json() as {
      data: Array<{ url: string; revised_prompt?: string }>
    }

    // 成功レスポンス
    const imageUrl = openaiData.data[0]?.url
    const revisedPrompt = openaiData.data[0]?.revised_prompt

    return c.json({
      success: true,
      requestId: crypto.randomUUID(),
      imageUrl: imageUrl,
      prompt: prompt,
      revisedPrompt: revisedPrompt,
      input: { mode, placeText, userText, options }
    })

  } catch (error) {
    console.error('Generate API Error:', error)
    return c.json({ 
      error: 'サーバーエラーが発生しました', 
      success: false 
    }, 500)
  }
})

export default app
