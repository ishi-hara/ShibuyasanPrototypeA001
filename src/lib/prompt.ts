/**
 * プロンプト生成ロジック
 * ユーザー入力からDALL-E 3用の英語プロンプトを生成
 */

export interface GenerateInput {
  mode: string
  placeText: string
  userText: string
  options: {
    users: string[]
    atmosphere: string[]
    viewpoint: string
    style: string
  }
}

export function generatePrompt(input: GenerateInput): string {
  const { mode, placeText, userText, options } = input

  // 基本プロンプト
  let prompt = `A beautiful illustration of a dream town/city scene. `

  // ユーザーのアイデアを追加
  prompt += `The scene depicts: ${userText}. `

  // 場所が指定されている場合
  if (placeText) {
    prompt += `Location inspiration: ${placeText} area in Japan. `
  }

  // モード②の追加オプション
  if (mode === 'arranger' && options) {
    // 利用者
    if (options.users && options.users.length > 0) {
      const userMap: Record<string, string> = {
        'こども': 'children playing',
        'ティーン': 'teenagers hanging out',
        '大人': 'adults relaxing',
        '高齢者': 'elderly people enjoying',
        '家族': 'families with children',
        '全世代': 'people of all ages'
      }
      const userDesc = options.users.map(u => userMap[u] || u).join(', ')
      prompt += `The scene includes ${userDesc}. `
    }

    // 雰囲気
    if (options.atmosphere && options.atmosphere.length > 0) {
      const atmosphereMap: Record<string, string> = {
        'ナチュラル': 'natural and organic atmosphere with greenery',
        'カラフル': 'colorful and vibrant atmosphere',
        '落ち着いた': 'calm and peaceful atmosphere',
        'にぎやか': 'lively and bustling atmosphere',
        'レトロ': 'retro and nostalgic atmosphere',
        '先進的': 'futuristic and modern atmosphere'
      }
      const atmDesc = options.atmosphere.map(a => atmosphereMap[a] || a).join(', ')
      prompt += `${atmDesc}. `
    }

    // 視点
    if (options.viewpoint) {
      const viewpointMap: Record<string, string> = {
        '目の高さ': 'eye-level perspective, street view',
        '鳥の目': 'bird\'s eye view, aerial perspective',
        'ななめ上': 'elevated angle, 45-degree perspective from above'
      }
      prompt += `${viewpointMap[options.viewpoint] || options.viewpoint}. `
    }

    // 作風
    if (options.style) {
      const styleMap: Record<string, string> = {
        'リアル写真風': 'photorealistic, high detail photograph style',
        'イラスト風': 'digital illustration style, clean lines',
        '水彩画風': 'watercolor painting style, soft edges',
        'アニメ風': 'anime style, Japanese animation aesthetic'
      }
      prompt += `Art style: ${styleMap[options.style] || options.style}. `
    }
  } else {
    // モード①のデフォルトスタイル
    prompt += `Art style: warm and inviting digital illustration, soft lighting, cheerful atmosphere. `
  }

  // 共通の品質指示
  prompt += `High quality, detailed, beautiful composition, warm colors, inviting atmosphere.`

  return prompt
}
