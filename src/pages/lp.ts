/**
 * LP画面（入口）
 * シンプルなキャッチコピーと「はじめる」ボタンのみ
 */

import { Context } from 'hono'

export const lpPage = (c: Context) => {
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
}
