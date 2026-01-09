/**
 * 生成フロー（モード選択・アイデア入力・オプション選択・生成）
 */

export const generateFlowScript = `
// ========== 生成フロー ==========
function showModeSelection() {
  inputArea.innerHTML = \\\`
    <div class="button-options">
      <button class="option-btn" onclick="selectMode('dreamer')">①お任せ（かんたん）</button>
      <button class="option-btn" onclick="selectMode('arranger')">②ちょい足し（少しこだわる）</button>
    </div>
  \\\`;
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

// ========== お任せモード: テキスト入力 ==========
function showPlaceInput() {
  inputArea.innerHTML = \\\`
    <div class="text-input-wrapper">
      <input type="text" class="text-input" id="placeInput" placeholder="例：川西能勢口駅前、池田市役所周辺" autocomplete="off">
      <button class="send-btn" onclick="submitPlace()">➤</button>
    </div>
    <div style="margin-top: 10px;">
      <button class="option-btn skip" onclick="skipPlace()">スキップ</button>
    </div>
  \\\`;
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
  inputArea.innerHTML = \\\`
    <div class="text-input-wrapper">
      <textarea class="text-input" id="ideaInput" rows="3" placeholder="80〜200文字くらいで教えてね（短くてもOK）"></textarea>
      <button class="send-btn" onclick="submitIdea()">➤</button>
    </div>
  \\\`;
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
  inputArea.innerHTML = \\\`
    <div class="button-options">
      <div class="button-row">
        \\\${options.map(o => \\\`<button class="option-btn" onclick="selectUsers('\\\${o}')">\\\${o}</button>\\\`).join('')}
      </div>
    </div>
  \\\`;
}

function selectUsers(value) {
  draft.options.users = [value];
  addUserMessage(value);
  setTimeout(() => { addBotMessage('どんな雰囲気？'); showAtmosphereSelection(); }, 400);
}

function showAtmosphereSelection() {
  const options = ['ナチュラル', 'カラフル', '落ち着いた', 'にぎやか', 'レトロ', '先進的'];
  inputArea.innerHTML = \\\`
    <div class="button-options">
      <div class="button-row">
        \\\${options.map(o => \\\`<button class="option-btn" onclick="selectAtmosphere('\\\${o}')">\\\${o}</button>\\\`).join('')}
      </div>
    </div>
  \\\`;
}

function selectAtmosphere(value) {
  draft.options.atmosphere = [value];
  addUserMessage(value);
  setTimeout(() => { addBotMessage('どこから見たい？'); showViewpointSelection(); }, 400);
}

function showViewpointSelection() {
  const options = ['目の高さ', '鳥の目', 'ななめ上'];
  inputArea.innerHTML = \\\`
    <div class="button-options">
      <div class="button-row">
        \\\${options.map(o => \\\`<button class="option-btn" onclick="selectViewpoint('\\\${o}')">\\\${o}</button>\\\`).join('')}
      </div>
    </div>
  \\\`;
}

function selectViewpoint(value) {
  draft.options.viewpoint = value;
  addUserMessage(value);
  setTimeout(() => { addBotMessage('どんな絵のテイスト？'); showStyleSelection(); }, 400);
}

function showStyleSelection() {
  const options = ['リアル写真風', 'イラスト風', '水彩画風', 'アニメ風'];
  inputArea.innerHTML = \\\`
    <div class="button-options">
      <div class="button-row">
        \\\${options.map(o => \\\`<button class="option-btn" onclick="selectStyle('\\\${o}')">\\\${o}</button>\\\`).join('')}
      </div>
    </div>
  \\\`;
}

function selectStyle(value) {
  draft.options.style = value;
  addUserMessage(value);
  setTimeout(() => { addBotMessage('いいね！画像をつくるよ。'); showGenerateButton(); }, 400);
}

// ========== 生成 ==========
function showGenerateButton() {
  inputArea.innerHTML = \\\`<button class="generate-btn" onclick="generate()">生成する</button>\\\`;
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
`;
