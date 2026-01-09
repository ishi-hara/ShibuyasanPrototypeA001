/**
 * チャット画面用CSSスタイル
 */

export const chatStyles = `
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
`;
