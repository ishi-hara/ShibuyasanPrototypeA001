/**
 * 川西市・池田市の名所・公共施設データ
 */

export interface Location {
  id: string
  name: string
  type: 'facility' | 'landmark'  // 公共施設 or 名所
  lat: number
  lng: number
  description?: string
}

export interface CityData {
  name: string
  center: { lat: number; lng: number }
  zoom: number
  locations: Location[]
}

export const cities: Record<string, CityData> = {
  kawanishi: {
    name: '川西市',
    center: { lat: 34.8297, lng: 135.4156 },
    zoom: 14,
    locations: [
      // 公共施設
      { id: 'kw-1', name: '川西市役所', type: 'facility', lat: 34.8264, lng: 135.4158, description: '市の行政の中心' },
      { id: 'kw-2', name: '川西能勢口駅', type: 'facility', lat: 34.8297, lng: 135.4156, description: '阪急・能勢電鉄の主要駅' },
      { id: 'kw-3', name: 'アステ川西', type: 'facility', lat: 34.8293, lng: 135.4162, description: '駅直結の商業施設' },
      { id: 'kw-4', name: '川西市文化会館', type: 'facility', lat: 34.8275, lng: 135.4180, description: '文化・芸術の拠点' },
      { id: 'kw-5', name: 'パルティK2', type: 'facility', lat: 34.8285, lng: 135.4145, description: '複合商業施設' },
      { id: 'kw-6', name: '川西市中央図書館', type: 'facility', lat: 34.8270, lng: 135.4165, description: '市立図書館' },
      { id: 'kw-7', name: 'キセラ川西', type: 'facility', lat: 34.8180, lng: 135.4100, description: '大型複合施設エリア' },
      // 名所
      { id: 'kw-l1', name: '多田神社', type: 'landmark', lat: 34.8550, lng: 135.3890, description: '源氏ゆかりの神社' },
      { id: 'kw-l2', name: '一庫ダム', type: 'landmark', lat: 34.9100, lng: 135.3700, description: '知明湖のダム' },
      { id: 'kw-l3', name: '妙見山', type: 'landmark', lat: 34.9200, lng: 135.4700, description: '能勢妙見山' },
      { id: 'kw-l4', name: '満願寺', type: 'landmark', lat: 34.8450, lng: 135.3950, description: '古刹・紅葉の名所' },
      { id: 'kw-l5', name: '猪名川渓谷', type: 'landmark', lat: 34.8400, lng: 135.4000, description: '自然豊かな渓谷' },
    ]
  },
  ikeda: {
    name: '池田市',
    center: { lat: 34.8219, lng: 135.4286 },
    zoom: 14,
    locations: [
      // 公共施設
      { id: 'ik-1', name: '池田市役所', type: 'facility', lat: 34.8219, lng: 135.4286, description: '市の行政の中心' },
      { id: 'ik-2', name: '池田駅', type: 'facility', lat: 34.8205, lng: 135.4360, description: '阪急宝塚線の駅' },
      { id: 'ik-3', name: '石橋阪大前駅', type: 'facility', lat: 34.8050, lng: 135.4420, description: '阪急宝塚線・箕面線の駅' },
      { id: 'ik-4', name: '池田市民文化会館', type: 'facility', lat: 34.8230, lng: 135.4270, description: 'アゼリアホール' },
      { id: 'ik-5', name: '池田市立図書館', type: 'facility', lat: 34.8215, lng: 135.4280, description: '市立図書館' },
      { id: 'ik-6', name: 'サンシティ池田', type: 'facility', lat: 34.8200, lng: 135.4350, description: '駅前商業施設' },
      // 名所
      { id: 'ik-l1', name: 'カップヌードルミュージアム', type: 'landmark', lat: 34.8177, lng: 135.4293, description: 'インスタントラーメン発祥の地' },
      { id: 'ik-l2', name: '五月山公園', type: 'landmark', lat: 34.8280, lng: 135.4200, description: '桜と紅葉の名所・動物園' },
      { id: 'ik-l3', name: '池田城跡公園', type: 'landmark', lat: 34.8260, lng: 135.4230, description: '歴史公園・展望台' },
      { id: 'ik-l4', name: '久安寺', type: 'landmark', lat: 34.8650, lng: 135.4350, description: '関西花の寺・あじさい' },
      { id: 'ik-l5', name: '落語みゅーじあむ', type: 'landmark', lat: 34.8210, lng: 135.4340, description: '上方落語の資料館' },
      { id: 'ik-l6', name: '逸翁美術館', type: 'landmark', lat: 34.8190, lng: 135.4310, description: '小林一三コレクション' },
    ]
  }
}

// 公共施設のみ取得
export function getFacilities(cityId: string): Location[] {
  return cities[cityId]?.locations.filter(l => l.type === 'facility') || []
}

// 名所のみ取得
export function getLandmarks(cityId: string): Location[] {
  return cities[cityId]?.locations.filter(l => l.type === 'landmark') || []
}

// 全ての場所を取得
export function getAllLocations(cityId: string): Location[] {
  return cities[cityId]?.locations || []
}
