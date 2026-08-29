import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getStocks() {
  const { data, error } = await supabaseAdmin.from('stock').select('*')
  if (error) throw error
  return Object.fromEntries(data.map(s => [s.perfume_id, s.stock_ml]))
}

export async function GET(req: NextRequest) {
  const stocks = await getStocks()
  const id = req.nextUrl.searchParams.get('id')
  if (id) {
    if (!(id in stocks)) return NextResponse.json({ error: 'Perfume no encontrado' }, { status: 404 })
    return NextResponse.json({ id, stockMl: stocks[id] })
  }
  return NextResponse.json(stocks)
}

type DeductBody = { id: string; ml: number } | { items: { id: string; ml: number }[] }

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DeductBody
    const stocks = await getStocks()

    const updates: { perfume_id: string; stock_ml: number }[] = []

    if ('items' in body && Array.isArray(body.items)) {
      for (const it of body.items) {
        if (!(it.id in stocks)) return NextResponse.json({ error: `ID no encontrado: ${it.id}` }, { status: 404 })
        if (stocks[it.id] < it.ml) {
          return NextResponse.json({ error: `Stock insuficiente para ${it.id}: quedan ${stocks[it.id]} ml`, id: it.id, stockMl: stocks[it.id] }, { status: 409 })
        }
      }
      for (const it of body.items) {
        stocks[it.id] -= it.ml
        updates.push({ perfume_id: it.id, stock_ml: stocks[it.id] })
      }
    } else if ('id' in body && 'ml' in body) {
      const { id, ml } = body
      if (!(id in stocks)) return NextResponse.json({ error: 'Perfume no encontrado' }, { status: 404 })
      if (typeof ml !== 'number' || ml <= 0) return NextResponse.json({ error: 'ml inválido' }, { status: 400 })
      if (stocks[id] < ml) {
        return NextResponse.json({ error: `Stock insuficiente: quedan ${stocks[id]} ml`, stockMl: stocks[id] }, { status: 409 })
      }
      stocks[id] -= ml
      updates.push({ perfume_id: id, stock_ml: stocks[id] })
    } else {
      return NextResponse.json({ error: 'Body inválido. Usa {id, ml} o {items: [{id, ml}]}' }, { status: 400 })
    }

    // Upsert en lote
    const { error } = await supabaseAdmin.from('stock').upsert(updates)
    if (error) throw error

    return NextResponse.json({ ok: true, stocks })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}