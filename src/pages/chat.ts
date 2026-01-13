/**
 * チャット画面（LINE風）
 * ユーザー情報収集 → モード選択 → 夢のまち入力 → 生成
 */

import { Context } from 'hono'
import { kawanishiData, ikedaData } from '../lib/places'
import { chatStyles } from '../styles/chat'

export const chatPage = (c: Context) => {
  // 場所データをJSON形式で埋め込み
  const placesDataJson = JSON.stringify({
    kawanishi: kawanishiData,
    ikeda: ikedaData
  });

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
    const PLACES_DATA = ${placesDataJson};
    
    // ========== 状態管理 ==========
    const draft = {
      userInfo: { age: '', gender: '', aiImageExp: '', aiVideoExp: '' },
      mode: '',
      placeText: '',
      selectedCity: '',
      selectionMethod: '',
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
      inputArea.innerHTML = '<div class="button-options"><div class="button-row">' +
        options.map(o => '<button class="option-btn" onclick="selectAge(\\'' + o + '\\')">' + o + '</button>').join('') +
        '</div></div>';
    }

    function selectAge(value) {
      draft.userInfo.age = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('性別を教えてね。'); showGenderSelection(); }, 400);
    }

    function showGenderSelection() {
      const options = ['男性', '女性', '回答しない'];
      inputArea.innerHTML = '<div class="button-options"><div class="button-row">' +
        options.map(o => '<button class="option-btn" onclick="selectGender(\\'' + o + '\\')">' + o + '</button>').join('') +
        '</div></div>';
    }

    function selectGender(value) {
      draft.userInfo.gender = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('AI画像生成は使ったことある？'); showAiImageExpSelection(); }, 400);
    }

    function showAiImageExpSelection() {
      const options = ['使ったことがない', 'たまに使う', 'よく使う'];
      inputArea.innerHTML = '<div class="button-options">' +
        options.map(o => '<button class="option-btn" onclick="selectAiImageExp(\\'' + o + '\\')">' + o + '</button>').join('') +
        '</div>';
    }

    function selectAiImageExp(value) {
      draft.userInfo.aiImageExp = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('AI動画生成は使ったことある？'); showAiVideoExpSelection(); }, 400);
    }

    function showAiVideoExpSelection() {
      const options = ['使ったことがない', 'たまに使う', 'よく使う'];
      inputArea.innerHTML = '<div class="button-options">' +
        options.map(o => '<button class="option-btn" onclick="selectAiVideoExp(\\'' + o + '\\')">' + o + '</button>').join('') +
        '</div>';
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
      inputArea.innerHTML = '<div class="button-options">' +
        '<button class="option-btn" onclick="selectMode(\\'dreamer\\')">①お任せ（かんたん）</button>' +
        '<button class="option-btn" onclick="selectMode(\\'arranger\\')">②ちょい足し（少しこだわる）</button>' +
        '</div>';
    }

    function selectMode(mode) {
      currentMode = mode;
      draft.mode = mode;
      addUserMessage(mode === 'dreamer' ? '①お任せ（かんたん）' : '②ちょい足し（少しこだわる）');
      
      setTimeout(() => {
        if (mode === 'arranger') {
          addBotMessage('どの市の"夢のまち"を描く？');
          showCitySelection();
        } else {
          addBotMessage('場所はどこにする？（未入力でもOK）');
          showPlaceInput();
        }
      }, 400);
    }

    // ========== ちょい足しモード: 場所選択フロー ==========
    function showCitySelection() {
      inputArea.innerHTML = '<div class="button-options">' +
        '<button class="option-btn" onclick="selectCity(\\'川西市\\')">川西市</button>' +
        '<button class="option-btn" onclick="selectCity(\\'池田市\\')">池田市</button>' +
        '</div>';
    }

    function selectCity(city) {
      draft.selectedCity = city;
      addUserMessage(city);
      setTimeout(() => {
        addBotMessage('場所の選び方を教えてね。');
        showSelectionMethod();
      }, 400);
    }

    function showSelectionMethod() {
      inputArea.innerHTML = '<div class="button-options">' +
        '<button class="option-btn" onclick="selectMethod(\\'map\\')">🗺️ 地図から選択する</button>' +
        '<button class="option-btn" onclick="selectMethod(\\'public\\')">🏛️ 公共施設から選択する</button>' +
        '<button class="option-btn" onclick="selectMethod(\\'landmark\\')">⭐ 名所から選択する</button>' +
        '</div>';
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

    function showMapSelection() {
      const cityData = draft.selectedCity === '川西市' ? PLACES_DATA.kawanishi : PLACES_DATA.ikeda;
      selectedPlaceFromMap = null;
      
      inputArea.innerHTML = '<div class="map-container"><div id="placeMap"></div></div>' +
        '<div id="selectedPlaceInfo"></div>' +
        '<button class="option-btn" id="confirmPlaceBtn" style="display: none;" onclick="confirmMapSelection()">この場所を選択</button>' +
        '<button class="option-btn skip" onclick="skipPlace()">スキップ</button>';
      
      setTimeout(() => { initMap(cityData); }, 100);
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
      
      cityData.places.forEach(place => {
        const markerColor = place.type === 'landmark' ? '#ff9500' : '#007aff';
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: '<div style="background: ' + markerColor + '; border: 2px solid #fff; border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        const marker = L.marker([place.lat, place.lng], { icon }).addTo(mapInstance);
        const escapedName = place.name.replace(/'/g, "\\\\'");
        const popupContent = '<div class="popup-name">' + place.name + '</div>' +
          '<div class="popup-desc">' + (place.description || '') + '</div>' +
          '<button class="popup-select-btn" onclick="selectPlaceFromMap(\\'' + place.id + '\\', \\'' + escapedName + '\\')">選択する</button>';
        
        marker.bindPopup(popupContent);
      });
      
      setTimeout(() => { mapInstance.invalidateSize(); }, 200);
    }

    function selectPlaceFromMap(placeId, placeName) {
      selectedPlaceFromMap = { id: placeId, name: placeName };
      
      document.getElementById('selectedPlaceInfo').innerHTML =
        '<div class="selected-place"><div class="selected-place-label">選択中の場所</div>' +
        '<div class="selected-place-name">' + placeName + '</div></div>';
      
      document.getElementById('confirmPlaceBtn').style.display = 'block';
      if (mapInstance) { mapInstance.closePopup(); }
    }

    function confirmMapSelection() {
      if (selectedPlaceFromMap) {
        draft.placeText = selectedPlaceFromMap.name;
        addUserMessage(selectedPlaceFromMap.name);
        
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

    function showPlaceList(type) {
      const cityData = draft.selectedCity === '川西市' ? PLACES_DATA.kawanishi : PLACES_DATA.ikeda;
      const places = cityData.places.filter(p => p.type === type);
      
      let html = '<div class="place-list">';
      places.forEach(p => {
        const escapedName = p.name.replace(/'/g, "\\\\'");
        html += '<div class="place-item" onclick="selectPlaceFromList(\\'' + escapedName + '\\')">' +
          '<div class="place-item-name">' + p.name + '</div>' +
          '<div class="place-item-desc">' + (p.description || '') + '</div></div>';
      });
      html += '</div><button class="option-btn skip" onclick="skipPlace()">スキップ</button>';
      inputArea.innerHTML = html;
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
      inputArea.innerHTML = '<div class="text-input-wrapper">' +
        '<input type="text" class="text-input" id="placeInput" placeholder="例：川西能勢口駅前、池田市役所周辺" autocomplete="off">' +
        '<button class="send-btn" onclick="submitPlace()">➤</button></div>' +
        '<div style="margin-top: 10px;"><button class="option-btn skip" onclick="skipPlace()">スキップ</button></div>';
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
      if (mapInstance) { mapInstance.remove(); mapInstance = null; }
      setTimeout(() => { addBotMessage('どんな"夢のまち"にしたい？自由に教えてね'); showIdeaInput(); }, 400);
    }

    function showIdeaInput() {
      inputArea.innerHTML = '<div class="text-input-wrapper">' +
        '<textarea class="text-input" id="ideaInput" rows="3" placeholder="80〜200文字くらいで教えてね（短くてもOK）"></textarea>' +
        '<button class="send-btn" onclick="submitIdea()">➤</button></div>';
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
      inputArea.innerHTML = '<div class="button-options"><div class="button-row">' +
        options.map(o => '<button class="option-btn" onclick="selectUsers(\\'' + o + '\\')">' + o + '</button>').join('') +
        '</div></div>';
    }

    function selectUsers(value) {
      draft.options.users = [value];
      addUserMessage(value);
      setTimeout(() => { addBotMessage('どんな雰囲気？'); showAtmosphereSelection(); }, 400);
    }

    function showAtmosphereSelection() {
      const options = ['ナチュラル', 'カラフル', '落ち着いた', 'にぎやか', 'レトロ', '先進的'];
      inputArea.innerHTML = '<div class="button-options"><div class="button-row">' +
        options.map(o => '<button class="option-btn" onclick="selectAtmosphere(\\'' + o + '\\')">' + o + '</button>').join('') +
        '</div></div>';
    }

    function selectAtmosphere(value) {
      draft.options.atmosphere = [value];
      addUserMessage(value);
      setTimeout(() => { addBotMessage('どこから見たい？'); showViewpointSelection(); }, 400);
    }

    function showViewpointSelection() {
      const options = ['目の高さ', '鳥の目', 'ななめ上'];
      inputArea.innerHTML = '<div class="button-options"><div class="button-row">' +
        options.map(o => '<button class="option-btn" onclick="selectViewpoint(\\'' + o + '\\')">' + o + '</button>').join('') +
        '</div></div>';
    }

    function selectViewpoint(value) {
      draft.options.viewpoint = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('どんな絵のテイスト？'); showStyleSelection(); }, 400);
    }

    function showStyleSelection() {
      const options = ['リアル写真風', 'イラスト風', '水彩画風', 'アニメ風'];
      inputArea.innerHTML = '<div class="button-options"><div class="button-row">' +
        options.map(o => '<button class="option-btn" onclick="selectStyle(\\'' + o + '\\')">' + o + '</button>').join('') +
        '</div></div>';
    }

    function selectStyle(value) {
      draft.options.style = value;
      addUserMessage(value);
      setTimeout(() => { addBotMessage('いいね！画像をつくるよ。'); showGenerateButton(); }, 400);
    }

    // ========== 生成 ==========
    function showGenerateButton() {
      inputArea.innerHTML = '<button class="generate-btn" onclick="generate()">生成する</button>';
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
        if (mapInstance) { mapInstance.remove(); mapInstance = null; }
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
