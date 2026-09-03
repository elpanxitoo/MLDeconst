import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET — Verificación del webhook (Meta te llama con hub.challenge)
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Verificación fallida' }, { status: 403 })
}

// POST — Mensajes entrantes desde WhatsApp Cloud API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Estructura: entry[].changes[].value.messages[]
    const entry = body.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value
    const messages = value?.messages

    if (!messages || messages.length === 0) {
      return NextResponse.json({ ok: true }) // status, no mensaje
    }

    for (const msg of messages) {
      const from: string = msg.from // teléfono del cliente
      const text: string = msg.text?.body?.toLowerCase() || ''
      const isCompra = text.includes('quiero comprar') || text.includes('ml decants')

      const reply = isCompra
        ? `¡Gracias por escribir a ML Decants! 🎉\n\nRecibimos tu pedido:\n"${msg.text?.body?.slice(0, 200) || ''}"\n\nTe responderemos en breve para confirmar stock, pago y envío. ¿Dudas con la fragancia? Cuéntanos y te ayudamos a elegir.`
        : `¡Hola! Gracias por contactar a ML Decants ✨\n\nEscríbenos qué fragancia te interesa (5ml / 10ml) y te ayudamos a elegir. También puedes ver el catálogo en la web.`

      await enviarWhatsapp(from, reply)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('whatsapp webhook error', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

async function enviarWhatsapp(to: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneId) {
    console.warn('WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID no configurados — no se envía auto-respuesta')
    return
  }

  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Error enviando WhatsApp', err)
  }
}
