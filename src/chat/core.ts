/**
 * チャットコア機能（状態管理・メッセージ・ナビゲーション）
 */

export const chatCoreScript = `
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
`;
