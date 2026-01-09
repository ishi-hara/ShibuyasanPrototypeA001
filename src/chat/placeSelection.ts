/**
 * 場所選択フロー（ちょい足しモード用）
 * 市選択 → 方法選択 → 地図/リスト選択
 */

export const placeSelectionScript = `
// ========== ちょい足しモード: 場所選択フロー ==========

// Step 1: 市の選択
function showCitySelection() {
  inputArea.innerHTML = \\\`
    <div class="button-options">
      <button class="option-btn" onclick="selectCity('川西市')">川西市</button>
      <button class="option-btn" onclick="selectCity('池田市')">池田市</button>
    </div>
  \\\`;
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
  inputArea.innerHTML = \\\`
    <div class="button-options">
      <button class="option-btn" onclick="selectMethod('map')">🗺️ 地図から選択する</button>
      <button class="option-btn" onclick="selectMethod('public')">🏛️ 公共施設から選択する</button>
      <button class="option-btn" onclick="selectMethod('landmark')">⭐ 名所から選択する</button>
    </div>
  \\\`;
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
  
  inputArea.innerHTML = \\\`
    <div class="map-container">
      <div id="placeMap"></div>
    </div>
    <div id="selectedPlaceInfo"></div>
    <button class="option-btn" id="confirmPlaceBtn" style="display: none;" onclick="confirmMapSelection()">この場所を選択</button>
    <button class="option-btn skip" onclick="skipPlace()">スキップ</button>
  \\\`;
  
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
      html: \\\`<div style="background: \\\${markerColor}; border: 2px solid #fff; border-radius: 50%; width: 24px; height: 24px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>\\\`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    const marker = L.marker([place.lat, place.lng], { icon }).addTo(mapInstance);
    
    const popupContent = \\\`
      <div class="popup-name">\\\${place.name}</div>
      <div class="popup-desc">\\\${place.description || ''}</div>
      <button class="popup-select-btn" onclick="selectPlaceFromMap('\\\${place.id}', '\\\${place.name.replace(/'/g, "\\\\\\\\'")}')">選択する</button>
    \\\`;
    
    marker.bindPopup(popupContent);
  });
  
  // 地図のサイズ調整
  setTimeout(() => {
    mapInstance.invalidateSize();
  }, 200);
}

function selectPlaceFromMap(placeId, placeName) {
  selectedPlaceFromMap = { id: placeId, name: placeName };
  
  document.getElementById('selectedPlaceInfo').innerHTML = \\\`
    <div class="selected-place">
      <div class="selected-place-label">選択中の場所</div>
      <div class="selected-place-name">\\\${placeName}</div>
    </div>
  \\\`;
  
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
  
  inputArea.innerHTML = \\\`
    <div class="place-list">
      \\\${places.map(p => \\\`
        <div class="place-item" onclick="selectPlaceFromList('\\\${p.name.replace(/'/g, "\\\\\\\\'")}')">
          <div class="place-item-name">\\\${p.name}</div>
          <div class="place-item-desc">\\\${p.description || ''}</div>
        </div>
      \\\`).join('')}
    </div>
    <button class="option-btn skip" onclick="skipPlace()">スキップ</button>
  \\\`;
}

function selectPlaceFromList(placeName) {
  draft.placeText = placeName;
  addUserMessage(placeName);
  setTimeout(() => {
    addBotMessage('どんな"夢のまち"にしたい？自由に教えてね');
    showIdeaInput();
  }, 400);
}
`;
