/**
 * 画像生成API
 * OpenAI DALL-E 3を使用して画像を生成
 */

import { Context } from 'hono'
import { generatePrompt } from '../lib/prompt'

// 環境変数の型定義
type Bindings = {
  OPENAI_API_KEY: string
}

export const generateApi = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json()
    const { mode, placeText, userText, options } = body

    // バリデーション
    if (!mode || !userText) {
      return c.json({ error: 'mode と userText は必須です', success: false }, 400)
    }

    // プロンプト生成
    const prompt = generatePrompt({ mode, placeText, userText, options })

    // OpenAI API Key
    const apiKey = c.env.OPENAI_API_KEY
    if (!apiKey) {
      return c.json({ error: 'OpenAI API Keyが設定されていません', success: false }, 500)
    }

    // DALL-E 3 API呼び出し
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({})) as { error?: { message?: string } }
      console.error('OpenAI API Error:', errorData)
      
      // エラーメッセージの整形
      let errorMessage = '画像生成に失敗しました'
      if (errorData.error?.message) {
        if (errorData.error.message.includes('content_policy')) {
          errorMessage = 'コンテンツポリシーに抵触しました。別の内容で試してください。'
        } else if (errorData.error.message.includes('rate_limit')) {
          errorMessage = 'APIの利用制限に達しました。しばらく待ってから再試行してください。'
        } else if (errorData.error.message.includes('invalid_api_key')) {
          errorMessage = 'APIキーが無効です。'
        }
      }
      
      return c.json({ error: errorMessage, success: false }, 500)
    }

    const openaiData = await openaiResponse.json() as {
      data: Array<{ url: string; revised_prompt?: string }>
    }

    // 成功レスポンス
    const imageUrl = openaiData.data[0]?.url
    const revisedPrompt = openaiData.data[0]?.revised_prompt

    return c.json({
      success: true,
      requestId: crypto.randomUUID(),
      imageUrl: imageUrl,
      prompt: prompt,
      revisedPrompt: revisedPrompt,
      input: { mode, placeText, userText, options }
    })

  } catch (error) {
    console.error('Generate API Error:', error)
    return c.json({ 
      error: 'サーバーエラーが発生しました', 
      success: false 
    }, 500)
  }
}
