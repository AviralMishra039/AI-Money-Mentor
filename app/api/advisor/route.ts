import OpenAI from 'openai'
import { PROMPTS } from '@/lib/prompts'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { feature, inputs, calculated_data, model } = await req.json()

    if (!PROMPTS[feature as keyof typeof PROMPTS]) {
      return NextResponse.json({ success: false, error: 'Invalid feature' }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: model || process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      max_tokens: 1000,
      temperature: 0.2, // slightly lower temperature for more deterministic JSON
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: PROMPTS[feature as keyof typeof PROMPTS]
        },
        {
          role: 'user',
          content: `User inputs: ${JSON.stringify(inputs)}\n\nPre-calculated data: ${JSON.stringify(calculated_data)}\n\nGenerate personalised advice. Respond ONLY in valid JSON.`
        }
      ]
    })

    const text = response.choices[0].message.content || '{}'

    try {
      // The prompt forces JSON and response_format={type:'json_object'} helps ensure it
      const parsed = JSON.parse(text)
      return NextResponse.json({ success: true, data: parsed })
    } catch {
      return NextResponse.json({ success: false, error: 'Parse failed', raw: text }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
