/**
 * チャット画面（LINE風）
 * ユーザー情報収集 → モード選択 → 夢のまち入力 → 生成
 */

import { Context } from 'hono'
import { kawanishiData, ikedaData } from '../lib/places'

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
      min-width: 100px;
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
    
    /* 地図スタイル */
    .map-container {
      width: 100%;
      height: 280px;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 12px;
      border: 1px solid #d1d1d6;
    }
    #placeMap {
      width: 100%;
      height: 100%;
    }
    .place-list {
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 12px;
    }
    .place-item {
      padding: 12px 16px;
      background: #ffffff;
      border: 1px solid #d1d1d6;
      border-radius: 10px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .place-item:hover { background: rgba(0, 122, 255, 0.08); border-color: #007aff; }
    .place-item:active { transform: scale(0.98); }
    .place-item-name { font-weight: 600; color: #1c1c1e; margin-bottom: 4px; }
    .place-item-desc { font-size: 0.85rem; color: #8e8e93; }
    .selected-place {
      background: rgba(52, 199, 89, 0.1);
      border-color: #34c759;
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 12px;
    }
    .selected-place-label { font-size: 0.85rem; color: #8e8e93; margin-bottom: 4px; }
    .selected-place-name { font-weight: 600; color: #34c759; }
    
    /* マップマーカーのカスタムスタイル */
    .custom-marker {
      background: #007aff;
      border: 2px solid #ffffff;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .custom-marker.landmark { background: #ff9500; }
    .custom-marker.public { background: #007aff; }
    
    .leaflet-popup-content-wrapper {
      border-radius: 10px;
    }
    .leaflet-popup-content {
      margin: 10px 14px;
      font-family: inherit;
    }
    .popup-name { font-weight: 600; margin-bottom: 4px; }
    .popup-desc { font-size: 0.85rem; color: #666; margin-bottom: 8px; }
    .popup-select-btn {
      background: #007aff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      width: 100%;
    }
    .popup-select-btn:hover { background: #0056b3; }
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
    ${placesDataScript}
    
    // ========== 状態管理 ==========
    const draft = {
      userInfo: { age: '', gender: '', aiImageExp: '', aiVideoExp: '' },
      mode: '',
      placeText: '',
      selectedCity: '',    // 選択された市
      selectionMethod: '', // 選択方法
      userText: '',
      options: { users: [], atmosphere: [], viewpoint: '', style: '' }
    };
    let currentMode = '';
    let mapInstance = null;
    let selectedPlaceFromMap = null;
    
    const messagesContainer = document.getElementById('messages');
    const inputArea = document.getElementById('inputArea');

    // ========== 初期化 ==========
    function init() {
      addBotMessage('こんにちは！"夢のまち"を一緒に描こう。');
      setTimeout(() => {
        addBotMessage('あなたのことを教えてください。');
        setTimeout(() => {
          addBotMessage('年代を教えてね。');
          showAgeSelection();
        }, 400);
      }, 600);
    }

    // ========== メッセージ ==========
    function addBotMessage(text) { renderMessage('bot', text); }
    function addUserMessage(text) { renderMessage('user', text); }
    function renderMessage(role, text) {
      const div = document.createElement('div');
      div.className = 'message ' + role;
      div.textContent = text;
      messagesContainer.appendChild(div);
      setTimeout(() => { messagesContainer.scrollTop = messagesContainer.scrollHeight; }, 50);
    }

    // ========== ユーザー情報入力 ==========
    function showAgeSelection() {
      const options = ['10代', '20代', '30代', '40代', '50代', '60代', '70歳以上'];
      inputArea.innerHTML = \`
        <div class="button-options">
          <div class="button-row">
            \${options.map(o => \`<button class="option-btn" onclick="selectAge('\${o}')">\${o}</button>\`).join('')}
          </div>
        </div>
      \`;
    }

    function selectAge(value) {
      draft.userInfo.age = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('性別を教えてね。'); showGenderSelection(); }, 400);
    }

    function showGenderSelection() {
      const options = ['男性', '女性', '回答しない'];
      inputArea.innerHTML = \`
        <div class="button-options">
          <div class="button-row">
            \${options.map(o => \`<button class="option-btn" onclick="selectGender('\${o}')">\${o}</button>\`).join('')}
          </div>
        </div>
      \`;
    }

    function selectGender(value) {
      draft.userInfo.gender = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('AI画像生成は使ったことある？'); showAiImageExpSelection(); }, 400);
    }

    function showAiImageExpSelection() {
      const options = ['使ったことがない', 'たまに使う', 'よく使う'];
      inputArea.innerHTML = \`
        <div class="button-options">
          \${options.map(o => \`<button class="option-btn" onclick="selectAiImageExp('\${o}')">\${o}</button>\`).join('')}
        </div>
      \`;
    }

    function selectAiImageExp(value) {
      draft.userInfo.aiImageExp = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('AI動画生成は使ったことある？'); showAiVideoExpSelection(); }, 400);
    }

    function showAiVideoExpSelection() {
      const options = ['使ったことがない', 'たまに使う', 'よく使う'];
      inputArea.innerHTML = \`
        <div class="button-options">
          \${options.map(o => \`<button class="option-btn" onclick="selectAiVideoExp('\${o}')">\${o}</button>\`).join('')}
        </div>
      \`;
    }

    function selectAiVideoExp(value) {
      draft.userInfo.aiVideoExp = value;
      addUserMessage(value);
      setTimeout(() => {
        addBotMessage('ありがとう！それじゃあ始めよう。');
        setTimeout(() => { addBotMessage('まず作り方を選んでね。'); showModeSelection(); }, 400);
      }, 400);
    }

    // ========== 生成フロー ==========
    function showModeSelection() {
      inputArea.innerHTML = \`
        <div class="button-options">
          <button class="option-btn" onclick="selectMode('dreamer')">①お任せ（かんたん）</button>
          <button class="option-btn" onclick="selectMode('arranger')">②ちょい足し（少しこだわる）</button>
        </div>
      \`;
    }

    function selectMode(mode) {
      currentMode = mode;
      draft.mode = mode;
      addUserMessage(mode === 'dreamer' ? '①お任せ（かんたん）' : '②ちょい足し（少しこだわる）');
      
      setTimeout(() => {
        if (mode === 'arranger') {
          // ちょい足しモード: 市の選択から始める
          addBotMessage('どの市の"夢のまち"を描く？');
          showCitySelection();
        } else {
          // お任せモード: 従来のテキスト入力
          addBotMessage('場所はどこにする？（未入力でもOK）');
          showPlaceInput();
        }
      }, 400);
    }

    // ========== ちょい足しモード: 場所選択フロー ==========
    
    // Step 1: 市の選択
    function showCitySelection() {
      inputArea.innerHTML = \`
        <div class="button-options">
          <button class="option-btn" onclick="selectCity('川西市')">川西市</button>
          <button class="option-btn" onclick="selectCity('池田市')">池田市</button>
        </div>
      \`;
    }

    function selectCity(city) {
      draft.selectedCity = city;
      addUserMessage(city);
      setTimeout(() => {
        addBotMessage('場所の選び方を教えてね。');
        showSelectionMethod();
      }, 400);
    }

    // Step 2: 選択方法
    function showSelectionMethod() {
      inputArea.innerHTML = \`
        <div class="button-options">
          <button class="option-btn" onclick="selectMethod('map')">🗺️ 地図から選択する</button>
          <button class="option-btn" onclick="selectMethod('public')">🏛️ 公共施設から選択する</button>
          <button class="option-btn" onclick="selectMethod('landmark')">⭐ 名所から選択する</button>
        </div>
      \`;
    }

    function selectMethod(method) {
      draft.selectionMethod = method;
      const methodLabels = { map: '地図から選択', public: '公共施設から選択', landmark: '名所から選択' };
      addUserMessage(methodLabels[method]);
      
      setTimeout(() => {
        if (method === 'map') {
          addBotMessage('地図で場所をタップしてね。');
          showMapSelection();
        } else if (method === 'public') {
          addBotMessage('公共施設を選んでね。');
          showPlaceList('public');
        } else {
          addBotMessage('名所を選んでね。');
          showPlaceList('landmark');
        }
      }, 400);
    }

    // Step 3a: 地図から選択
    function showMapSelection() {
      const cityData = draft.selectedCity === '川西市' ? PLACES_DATA.kawanishi : PLACES_DATA.ikeda;
      selectedPlaceFromMap = null;
      
      inputArea.innerHTML = \`
        <div class="map-container">
          <div id="placeMap"></div>
        </div>
        <div id="selectedPlaceInfo"></div>
        <button class="option-btn" id="confirmPlaceBtn" style="display: none;" onclick="confirmMapSelection()">この場所を選択</button>
        <button class="option-btn skip" onclick="skipPlace()">スキップ</button>
      \`;
      
      // 地図の初期化（少し遅延させてDOM描画を待つ）
      setTimeout(() => {
        initMap(cityData);
      }, 100);
    }

    function initMap(cityData) {
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
      
      mapInstance = L.map('placeMap').setView([cityData.center.lat, cityData.center.lng], cityData.zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);
      
      // マーカーを追加
      cityData.places.forEach(place => {
        const markerColor = place.type === 'landmark' ? '#ff9500' : '#007aff';
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: \`<div style="background: \${markerColor}; border: 2px solid #fff; border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>\`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        const marker = L.marker([place.lat, place.lng], { icon }).addTo(mapInstance);
        
        const popupContent = \`
          <div class="popup-name">\${place.name}</div>
          <div class="popup-desc">\${place.description || ''}</div>
          <button class="popup-select-btn" onclick="selectPlaceFromMap('\${place.id}', '\${place.name.replace(/'/g, "\\\\'")}')">選択する</button>
        \`;
        
        marker.bindPopup(popupContent);
      });
      
      // 地図のサイズ調整
      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 200);
    }

    function selectPlaceFromMap(placeId, placeName) {
      selectedPlaceFromMap = { id: placeId, name: placeName };
      
      document.getElementById('selectedPlaceInfo').innerHTML = \`
        <div class="selected-place">
          <div class="selected-place-label">選択中の場所</div>
          <div class="selected-place-name">\${placeName}</div>
        </div>
      \`;
      
      document.getElementById('confirmPlaceBtn').style.display = 'block';
      
      // ポップアップを閉じる
      if (mapInstance) {
        mapInstance.closePopup();
      }
    }

    function confirmMapSelection() {
      if (selectedPlaceFromMap) {
        draft.placeText = selectedPlaceFromMap.name;
        addUserMessage(selectedPlaceFromMap.name);
        
        // 地図をクリーンアップ
        if (mapInstance) {
          mapInstance.remove();
          mapInstance = null;
        }
        
        setTimeout(() => {
          addBotMessage('どんな"夢のまち"にしたい？自由に教えてね');
          showIdeaInput();
        }, 400);
      }
    }

    // Step 3b: リストから選択（公共施設/名所）
    function showPlaceList(type) {
      const cityData = draft.selectedCity === '川西市' ? PLACES_DATA.kawanishi : PLACES_DATA.ikeda;
      const places = cityData.places.filter(p => p.type === type);
      
      inputArea.innerHTML = \`
        <div class="place-list">
          \${places.map(p => \`
            <div class="place-item" onclick="selectPlaceFromList('\${p.name.replace(/'/g, "\\\\'")}')">
              <div class="place-item-name">\${p.name}</div>
              <div class="place-item-desc">\${p.description || ''}</div>
            </div>
          \`).join('')}
        </div>
        <button class="option-btn skip" onclick="skipPlace()">スキップ</button>
      \`;
    }

    function selectPlaceFromList(placeName) {
      draft.placeText = placeName;
      addUserMessage(placeName);
      setTimeout(() => {
        addBotMessage('どんな"夢のまち"にしたい？自由に教えてね');
        showIdeaInput();
      }, 400);
    }

    // ========== お任せモード: テキスト入力 ==========
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

    function submitPlace() {
      const value = document.getElementById('placeInput').value.trim();
      draft.placeText = value;
      addUserMessage(value || '（未入力）');
      setTimeout(() => { addBotMessage('どんな"夢のまち"にしたい？自由に教えてね'); showIdeaInput(); }, 400);
    }

    function skipPlace() {
      draft.placeText = '';
      addUserMessage('スキップ');
      
      // 地図をクリーンアップ
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
      
      setTimeout(() => { addBotMessage('どんな"夢のまち"にしたい？自由に教えてね'); showIdeaInput(); }, 400);
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

    // ========== モード②追加オプション ==========
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

    function selectUsers(value) {
      draft.options.users = [value];
      addUserMessage(value);
      setTimeout(() => { addBotMessage('どんな雰囲気？'); showAtmosphereSelection(); }, 400);
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

    function selectAtmosphere(value) {
      draft.options.atmosphere = [value];
      addUserMessage(value);
      setTimeout(() => { addBotMessage('どこから見たい？'); showViewpointSelection(); }, 400);
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

    function selectViewpoint(value) {
      draft.options.viewpoint = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('どんな絵のテイスト？'); showStyleSelection(); }, 400);
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

    function selectStyle(value) {
      draft.options.style = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('いいね！画像をつくるよ。'); showGenerateButton(); }, 400);
    }

    // ========== 生成 ==========
    function showGenerateButton() {
      inputArea.innerHTML = \`<button class="generate-btn" onclick="generate()">生成する</button>\`;
    }

    async function generate() {
      const btn = document.querySelector('.generate-btn');
      btn.disabled = true;
      btn.textContent = '生成中...';

      const payload = {
        userInfo: draft.userInfo,
        mode: draft.mode,
        placeText: draft.placeText,
        selectedCity: draft.selectedCity,
        selectionMethod: draft.selectionMethod,
        userText: draft.userText,
        options: draft.options
      };

      sessionStorage.setItem('generateRequest', JSON.stringify(payload));
      window.location.href = '/loading';
    }

    // ========== ナビゲーション ==========
    function goBack() { window.location.href = '/'; }

    function resetChat() {
      if (confirm('最初からやり直しますか？')) {
        // 地図をクリーンアップ
        if (mapInstance) {
          mapInstance.remove();
          mapInstance = null;
        }
        
        draft.userInfo = { age: '', gender: '', aiImageExp: '', aiVideoExp: '' };
        draft.mode = '';
        draft.placeText = '';
        draft.selectedCity = '';
        draft.selectionMethod = '';
        draft.userText = '';
        draft.options = { users: [], atmosphere: [], viewpoint: '', style: '' };
        currentMode = '';
        selectedPlaceFromMap = null;
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
}
