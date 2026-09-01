import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function verificarAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD
  if (!password || !auth) return false
  return auth === `Bearer ${password}`
}

// PATCH - Actualizar el orden de los perfumes
// Body: { ordenes: [{ id: string, orden: number }] }
export async function PATCH(req: NextRequest) {
  if (!verificarAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { ordenes } = body

    if (!Array.isArray(ordenes) || ordenes.length === 0) {
      return NextResponse.json({ error: 'Falta el array de ordenes' }, { status: 400 })
    }

    // Actualizar cada perfume con su nueva posición
    for (const item of ordenes) {
      if (!item.id || typeof item.orden !== 'number') continue
      const { error } = await supabaseAdmin
        .from('perfumes')
        .update({ orden: item.orden })
        .eq('id', item.id)
      if (error) throw error
    }

    return NextResponse.json({ ok: true, updated: ordenes.length })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
