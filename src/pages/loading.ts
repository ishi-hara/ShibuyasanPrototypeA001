/**
 * ローディング画面
 * 画像生成APIを呼び出し、完了後に結果画面へ遷移
 */

import { Context } from 'hono'

export const loadingPage = (c: Context) => {
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
}
