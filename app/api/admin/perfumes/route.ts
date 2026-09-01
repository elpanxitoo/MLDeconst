import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function verificarAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const password = process.env.ADMIN_PASSWORD
  if (!password || !auth) return false
  return auth === `Bearer ${password}`
}

// GET - Obtener todos los perfumes con stock y relaciones
export async function GET(req: NextRequest) {
  if (!verificarAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    // Intentar ordenar por 'orden', si la columna no existe, fallback a 'nombre'
    let { data: perfumes, error } = await supabaseAdmin
      .from('perfume_con_stock')
      .select('*')
      .order('orden', { ascending: true, nullsFirst: false })
      .order('nombre')

    if (error && error.message?.includes('orden')) {
      const fallback = await supabaseAdmin
        .from('perfume_con_stock')
        .select('*')
        .order('nombre')
      perfumes = fallback.data
      error = fallback.error
    }

    if (error) throw error

    const ids = (perfumes ?? []).map((p: any) => p.id)

    const { data: notasRows } = await supabaseAdmin
      .from('perfume_notas')
      .select('perfume_id, nivel, nota')
      .in('perfume_id', ids)

    const { data: climaRows } = await supabaseAdmin
      .from('perfume_clima')
      .select('perfume_id, clima')
      .in('perfume_id', ids)

    const { data: tempRows } = await supabaseAdmin
      .from('perfume_temporadas')
      .select('perfume_id, temporada')
      .in('perfume_id', ids)

    const notasMap: Record<string, Record<string, string[]>> = {}
    for (const row of notasRows ?? []) {
      if (!notasMap[row.perfume_id]) notasMap[row.perfume_id] = {}
      if (!notasMap[row.perfume_id][row.nivel]) notasMap[row.perfume_id][row.nivel] = []
      notasMap[row.perfume_id][row.nivel].push(row.nota)
    }

    const climaMap: Record<string, string[]> = {}
    for (const row of climaRows ?? []) {
      if (!climaMap[row.perfume_id]) climaMap[row.perfume_id] = []
      climaMap[row.perfume_id].push(row.clima)
    }

    const tempMap: Record<string, string[]> = {}
    for (const row of tempRows ?? []) {
      if (!tempMap[row.perfume_id]) tempMap[row.perfume_id] = []
      tempMap[row.perfume_id].push(row.temporada)
    }

    const result = (perfumes ?? []).map((p: any) => ({
      id: p.id,
      nombre: p.nombre,
      casa: p.casa,
      descripcion: p.descripcion,
      imagen: p.imagen,
      stock_ml: p.stock_actual ?? p.stock_ml ?? 60,
      orden: p.orden ?? 0,
      decants: p.decants ?? [],
      piramide_salida: notasMap[p.id]?.salida ?? [],
      piramide_corazon: notasMap[p.id]?.corazon ?? [],
      piramide_base: notasMap[p.id]?.base ?? [],
      temporadas: tempMap[p.id] ?? [],
      clima: climaMap[p.id] ?? [],
    }))

    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// POST - Crear nuevo perfume
export async function POST(req: NextRequest) {
  if (!verificarAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, nombre, casa, descripcion, imagen, decants, piramide_salida, piramide_corazon, piramide_base, temporadas, clima, stock_ml, orden } = body

    if (!id || !nombre) {
      return NextResponse.json({ error: 'Faltan campos obligatorios: id, nombre' }, { status: 400 })
    }

    // 1. Insertar perfume
    const { error: perfError } = await supabaseAdmin
      .from('perfumes')
      .insert({
        id,
        nombre,
        casa: casa ?? '',
        descripcion: descripcion ?? '',
        imagen: imagen ?? '/placeholder.svg',
        decants: decants ?? [],
        orden: orden ?? 0,
      })

    if (perfError) throw perfError

    // 2. Insertar stock
    const { error: stockError } = await supabaseAdmin
      .from('stock')
      .insert({ perfume_id: id, stock_ml: stock_ml ?? 60 })

    if (stockError) throw stockError

    // 3. Insertar notas
    const notasInserts: any[] = []
    for (const nota of piramide_salida ?? []) {
      notasInserts.push({ perfume_id: id, nivel: 'salida', nota })
    }
    for (const nota of piramide_corazon ?? []) {
      notasInserts.push({ perfume_id: id, nivel: 'corazon', nota })
    }
    for (const nota of piramide_base ?? []) {
      notasInserts.push({ perfume_id: id, nivel: 'base', nota })
    }
    if (notasInserts.length > 0) {
      const { error } = await supabaseAdmin.from('perfume_notas').insert(notasInserts)
      if (error) throw error
    }

    // 4. Insertar clima
    const climaInserts = (clima ?? []).map((c: string) => ({ perfume_id: id, clima: c }))
    if (climaInserts.length > 0) {
      const { error } = await supabaseAdmin.from('perfume_clima').insert(climaInserts)
      if (error) throw error
    }

    // 5. Insertar temporadas
    const tempInserts = (temporadas ?? []).map((t: string) => ({ perfume_id: id, temporada: t }))
    if (tempInserts.length > 0) {
      const { error } = await supabaseAdmin.from('perfume_temporadas').insert(tempInserts)
      if (error) throw error
    }

    return NextResponse.json({ ok: true, id })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// PUT - Actualizar perfume existente
export async function PUT(req: NextRequest) {
  if (!verificarAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, nombre, casa, descripcion, imagen, decants, piramide_salida, piramide_corazon, piramide_base, temporadas, clima, stock_ml, orden } = body

    if (!id) {
      return NextResponse.json({ error: 'Falta el campo id' }, { status: 400 })
    }

    // 1. Actualizar perfume
    const { error: perfError } = await supabaseAdmin
      .from('perfumes')
      .update({
        nombre,
        casa,
        descripcion,
        imagen,
        decants,
        orden,
      })
      .eq('id', id)

    if (perfError) throw perfError

    // 2. Actualizar stock
    if (typeof stock_ml === 'number') {
      const { error } = await supabaseAdmin
        .from('stock')
        .upsert({ perfume_id: id, stock_ml }, { onConflict: 'perfume_id' })
      if (error) throw error
    }

    // 3. Reemplazar notas
    await supabaseAdmin.from('perfume_notas').delete().eq('perfume_id', id)
    const notasInserts: any[] = []
    for (const nota of piramide_salida ?? []) {
      notasInserts.push({ perfume_id: id, nivel: 'salida', nota })
    }
    for (const nota of piramide_corazon ?? []) {
      notasInserts.push({ perfume_id: id, nivel: 'corazon', nota })
    }
    for (const nota of piramide_base ?? []) {
      notasInserts.push({ perfume_id: id, nivel: 'base', nota })
    }
    if (notasInserts.length > 0) {
      const { error } = await supabaseAdmin.from('perfume_notas').insert(notasInserts)
      if (error) throw error
    }

    // 4. Reemplazar clima
    await supabaseAdmin.from('perfume_clima').delete().eq('perfume_id', id)
    const climaInserts = (clima ?? []).map((c: string) => ({ perfume_id: id, clima: c }))
    if (climaInserts.length > 0) {
      const { error } = await supabaseAdmin.from('perfume_clima').insert(climaInserts)
      if (error) throw error
    }

    // 5. Reemplazar temporadas
    await supabaseAdmin.from('perfume_temporadas').delete().eq('perfume_id', id)
    const tempInserts = (temporadas ?? []).map((t: string) => ({ perfume_id: id, temporada: t }))
    if (tempInserts.length > 0) {
      const { error } = await supabaseAdmin.from('perfume_temporadas').insert(tempInserts)
      if (error) throw error
    }

    return NextResponse.json({ ok: true, id })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// DELETE - Eliminar perfume
export async function DELETE(req: NextRequest) {
  if (!verificarAuth(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Falta el campo id' }, { status: 400 })
    }

    // Eliminar en cascada (RLS con on delete cascade)
    await supabaseAdmin.from('perfume_notas').delete().eq('perfume_id', id)
    await supabaseAdmin.from('perfume_clima').delete().eq('perfume_id', id)
    await supabaseAdmin.from('perfume_temporadas').delete().eq('perfume_id', id)
    await supabaseAdmin.from('stock').delete().eq('perfume_id', id)
    await supabaseAdmin.from('perfumes').delete().eq('id', id)

    return NextResponse.json({ ok: true, id })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}