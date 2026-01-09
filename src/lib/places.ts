/**
 * 川西市・池田市の場所データ（名所・公共施設）
 */

export interface Place {
  id: string;
  name: string;
  type: 'landmark' | 'public';  // 名所 or 公共施設
  lat: number;
  lng: number;
  description?: string;
}

export interface CityData {
  name: string;
  center: { lat: number; lng: number };
  zoom: number;
  places: Place[];
}

// 川西市のデータ
export const kawanishiData: CityData = {
  name: '川西市',
  center: { lat: 34.8297, lng: 135.4158 },
  zoom: 14,
  places: [
    // 名所
    { id: 'kn-l1', name: '川西能勢口駅前', type: 'landmark', lat: 34.8267, lng: 135.4164, description: '阪急・能勢電鉄の主要駅' },
    { id: 'kn-l2', name: '一庫ダム', type: 'landmark', lat: 34.8982, lng: 135.3811, description: '知明湖を擁する多目的ダム' },
    { id: 'kn-l3', name: '多田神社', type: 'landmark', lat: 34.8497, lng: 135.3897, description: '清和源氏発祥の地' },
    { id: 'kn-l4', name: '満願寺', type: 'landmark', lat: 34.8192, lng: 135.3831, description: '紅葉の名所' },
    { id: 'kn-l5', name: '猪名川河川敷', type: 'landmark', lat: 34.8231, lng: 135.4261, description: '水辺の自然空間' },
    { id: 'kn-l6', name: 'キセラ川西', type: 'landmark', lat: 34.8312, lng: 135.4098, description: '新しい都市エリア' },
    { id: 'kn-l7', name: '妙見山', type: 'landmark', lat: 34.9242, lng: 135.4231, description: '北摂の名峰' },
    { id: 'kn-l8', name: '黒川の里山', type: 'landmark', lat: 34.9121, lng: 135.4012, description: '日本一の里山' },
    // 公共施設
    { id: 'kn-p1', name: '川西市役所', type: 'public', lat: 34.8275, lng: 135.4092, description: '市の行政中心' },
    { id: 'kn-p2', name: 'みつなかホール', type: 'public', lat: 34.8289, lng: 135.4102, description: '文化芸術の発信拠点' },
    { id: 'kn-p3', name: 'パレットかわにし', type: 'public', lat: 34.8262, lng: 135.4148, description: '市民活動センター' },
    { id: 'kn-p4', name: '川西市中央図書館', type: 'public', lat: 34.8318, lng: 135.4087, description: 'キセラ川西内の図書館' },
    { id: 'kn-p5', name: '川西市文化会館', type: 'public', lat: 34.8241, lng: 135.4215, description: '大・小ホールを備えた施設' },
    { id: 'kn-p6', name: '総合体育館', type: 'public', lat: 34.8352, lng: 135.3921, description: 'スポーツ施設' },
    { id: 'kn-p7', name: '川西市郷土館', type: 'public', lat: 34.8487, lng: 135.3723, description: '歴史・文化の展示施設' },
    { id: 'kn-p8', name: '東谷公民館', type: 'public', lat: 34.8621, lng: 135.3812, description: '地域のコミュニティ施設' },
  ]
};

// 池田市のデータ
export const ikedaData: CityData = {
  name: '池田市',
  center: { lat: 34.8220, lng: 135.4361 },
  zoom: 14,
  places: [
    // 名所
    { id: 'ik-l1', name: '池田城跡公園', type: 'landmark', lat: 34.8289, lng: 135.4298, description: '池田城の跡地を整備した公園' },
    { id: 'ik-l2', name: '五月山公園', type: 'landmark', lat: 34.8342, lng: 135.4312, description: '動物園と展望台がある公園' },
    { id: 'ik-l3', name: '池田駅前', type: 'landmark', lat: 34.8196, lng: 135.4381, description: '阪急宝塚線の主要駅' },
    { id: 'ik-l4', name: '久安寺', type: 'landmark', lat: 34.8621, lng: 135.4187, description: 'あじさいの名所' },
    { id: 'ik-l5', name: '呉服神社', type: 'landmark', lat: 34.8187, lng: 135.4298, description: '織姫伝説の神社' },
    { id: 'ik-l6', name: '猪名川河川敷（池田側）', type: 'landmark', lat: 34.8198, lng: 135.4452, description: '川沿いの緑地' },
    { id: 'ik-l7', name: '五月山ドライブウェイ', type: 'landmark', lat: 34.8412, lng: 135.4298, description: '夜景スポット' },
    { id: 'ik-l8', name: 'カップヌードルミュージアム', type: 'landmark', lat: 34.8178, lng: 135.4342, description: 'インスタントラーメン発明記念館' },
    // 公共施設
    { id: 'ik-p1', name: '池田市役所', type: 'public', lat: 34.8231, lng: 135.4312, description: '市の行政中心' },
    { id: 'ik-p2', name: '池田市立図書館', type: 'public', lat: 34.8241, lng: 135.4287, description: '市民の学習拠点' },
    { id: 'ik-p3', name: 'アゼリアホール', type: 'public', lat: 34.8265, lng: 135.4321, description: '文化会館大ホール' },
    { id: 'ik-p4', name: '池田市民文化会館', type: 'public', lat: 34.8252, lng: 135.4298, description: '複合文化施設' },
    { id: 'ik-p5', name: '五月山体育館', type: 'public', lat: 34.8321, lng: 135.4276, description: 'スポーツ施設' },
    { id: 'ik-p6', name: '池田市立歴史民俗資料館', type: 'public', lat: 34.8298, lng: 135.4265, description: '歴史・文化の展示' },
    { id: 'ik-p7', name: '中央公民館', type: 'public', lat: 34.8218, lng: 135.4352, description: '地域活動の拠点' },
    { id: 'ik-p8', name: '石橋プラザ', type: 'public', lat: 34.8062, lng: 135.4421, description: '石橋地区の複合施設' },
  ]
};

// 全データを取得
export const getAllCities = () => [kawanishiData, ikedaData];

// 市名から取得
export const getCityData = (cityName: string): CityData | undefined => {
  if (cityName === '川西市') return kawanishiData;
  if (cityName === '池田市') return ikedaData;
  return undefined;
};

// 場所タイプで絞り込み
export const getPlacesByType = (city: CityData, type: 'landmark' | 'public'): Place[] => {
  return city.places.filter(p => p.type === type);
};
