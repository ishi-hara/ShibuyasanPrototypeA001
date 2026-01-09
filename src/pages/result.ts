/**
 * 結果表示画面
 * 生成された画像の表示、ダウンロード、共有機能
 */

import { Context } from 'hono'

export const resultPage = (c: Context) => {
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
}
