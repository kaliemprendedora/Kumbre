import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface ScannedTransaction {
  date: string
  description: string
  amount: number
  type: 'expense' | 'income'
  rawText: string
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  const mediaType = (file.type || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

  const today = new Date().toISOString().slice(0, 10)

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: `Analiza esta boleta/factura/cartola bancaria y extrae todos los movimientos de dinero.
Devuelve SOLO un JSON válido con este formato exacto, sin texto adicional:
{
  "transactions": [
    {
      "date": "YYYY-MM-DD o vacío si no se ve",
      "description": "nombre del comercio o descripción",
      "amount": 12345,
      "type": "expense o income",
      "rawText": "texto original de la línea"
    }
  ]
}

Hoy es ${today}. Si la fecha no es clara, usa hoy.
Los montos deben ser números positivos sin puntos ni comas.
Si es una boleta simple, hay un solo transaction.
Si es una cartola, puede haber muchos.`,
          },
        ],
      },
    ],
  })

  const text = message.content.map(b => b.type === 'text' ? b.text : '').join('')

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'Could not parse response', raw: text }, { status: 422 })
  }
}
