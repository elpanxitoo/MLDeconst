import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function verificarAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD
  if (!password || !auth) return false
  return auth === `Bearer ${password}`
}

// GET - Obtener todo el stock
export async function GET(req: NextRequest) {
  if (!verificarAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('perfume_con_stock')
      .select('id, nombre, casa, stock_actual')
      .order('nombre')

    if (error) throw error
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// PUT - Actualizar stock de un perfume
export async function PUT(req: NextRequest) {
  if (!verificarAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id, stock_ml } = await req.json()

    if (!id || typeof stock_ml !== 'number' || stock_ml < 0) {
      return NextResponse.json({ error: 'Datos inválidos. Usa { id: string, stock_ml: number }' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('stock')
      .upsert({ perfume_id: id, stock_ml }, { onConflict: 'perfume_id' })

    if (error) throw error

    return NextResponse.json({ ok: true, id, stock_ml })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// POST - Actualizar stock de varios perfumes
export async function POST(req: NextRequest) {
  if (!verificarAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { items } = await req.json()

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Usa { items: [{ id, stock_ml }] }' }, { status: 400 })
    }

    const updates = items
      .filter((it: any) => it.id && typeof it.stock_ml === 'number' && it.stock_ml >= 0)
      .map((it: any) => ({ perfume_id: it.id, stock_ml: it.stock_ml }))

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay items válidos' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('stock')
      .upsert(updates, { onConflict: 'perfume_id' })

    if (error) throw error

    return NextResponse.json({ ok: true, updated: updates.length })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}