/**
 * ユーザー情報入力フロー
 * 年代・性別・AI経験を収集
 */

export const userInfoScript = `
// ========== ユーザー情報入力 ==========
function showAgeSelection() {
  const options = ['10代', '20代', '30代', '40代', '50代', '60代', '70歳以上'];
  inputArea.innerHTML = \\\`
    <div class="button-options">
      <div class="button-row">
        \\\${options.map(o => \\\`<button class="option-btn" onclick="selectAge('\\\${o}')">\\\${o}</button>\\\`).join('')}
      </div>
    </div>
  \\\`;
}

function selectAge(value) {
  draft.userInfo.age = value;
  addUserMessage(value);
  setTimeout(() => { addBotMessage('性別を教えてね。'); showGenderSelection(); }, 400);
}

function showGenderSelection() {
  const options = ['男性', '女性', '回答しない'];
  inputArea.innerHTML = \\\`
    <div class="button-options">
      <div class="button-row">
        \\\${options.map(o => \\\`<button class="option-btn" onclick="selectGender('\\\${o}')">\\\${o}</button>\\\`).join('')}
      </div>
    </div>
  \\\`;
}

function selectGender(value) {
  draft.userInfo.gender = value;
  addUserMessage(value);
  setTimeout(() => { addBotMessage('AI画像生成は使ったことある？'); showAiImageExpSelection(); }, 400);
}

function showAiImageExpSelection() {
  const options = ['使ったことがない', 'たまに使う', 'よく使う'];
  inputArea.innerHTML = \\\`
    <div class="button-options">
      \\\${options.map(o => \\\`<button class="option-btn" onclick="selectAiImageExp('\\\${o}')">\\\${o}</button>\\\`).join('')}
    </div>
  \\\`;
}

function selectAiImageExp(value) {
  draft.userInfo.aiImageExp = value;
  addUserMessage(value);
  setTimeout(() => { addBotMessage('AI動画生成は使ったことある？'); showAiVideoExpSelection(); }, 400);
}

function showAiVideoExpSelection() {
  const options = ['使ったことがない', 'たまに使う', 'よく使う'];
  inputArea.innerHTML = \\\`
    <div class="button-options">
      \\\${options.map(o => \\\`<button class="option-btn" onclick="selectAiVideoExp('\\\${o}')">\\\${o}</button>\\\`).join('')}
    </div>
  \\\`;
}

function selectAiVideoExp(value) {
  draft.userInfo.aiVideoExp = value;
  addUserMessage(value);
  setTimeout(() => {
    addBotMessage('ありがとう！それじゃあ始めよう。');
    setTimeout(() => { addBotMessage('まず作り方を選んでね。'); showModeSelection(); }, 400);
  }, 400);
}
`;
