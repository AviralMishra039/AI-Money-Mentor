import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { messages, contextData } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ success: false, error: 'Messages are required' }, { status: 400 })
    }

    const systemPrompt = `You are the ET Money Mentor, an elite, highly intelligent financial assistant built for The Economic Times.
You strictly answer the user's follow-up questions based exclusively on their generated financial context below. 

USER CONTEXT:
${JSON.stringify(contextData, null, 2)}

RULES:
1. Always base your answers on the numbers provided in the context.
2. If the user asks something completely unrelated to finance or their context, politely steer them back.
3. Keep your answers concise, direct, and formatted beautifully using markdown. Do not use generic pleasantries.`

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Fast model for chat
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(err)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    return NextResponse.json({ success: true, reply: content })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate response' }, { status: 500 })
  }
}
