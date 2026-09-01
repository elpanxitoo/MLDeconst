import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { NOTAS, type Nota } from '@/lib/notas'

export const dynamic = 'force-dynamic'

function buscarNota(nombre: string): Nota {
  const slug = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

  for (const [key, nota] of Object.entries(NOTAS)) {
    const keySlug = key.toLowerCase().replace(/[^a-z0-9]/g, '')
    const notaSlug = nota.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
    if (keySlug === slug || notaSlug === slug) return nota
  }
  return { nombre, imagen: '/placeholder.svg' }
}

function transformNotas(notas: string[] | null): Nota[] {
  return (notas ?? []).map(buscarNota)
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  try {
    // 1. Traer perfumes con stock
    let lista: any[]

    if (id) {
      const { data: perfume, error } = await supabaseAdmin
        .from('perfume_con_stock')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      if (!perfume) return NextResponse.json({ error: 'Perfume no encontrado' }, { status: 404 })
      lista = [perfume]
    } else {
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

      lista = (perfumes ?? []) as any[]
    }

    // 2. Traer pirámide de notas desde perfume_notas
    const ids = lista.map((p: any) => p.id)
    const { data: notasRows } = await supabaseAdmin
      .from('perfume_notas')
      .select('perfume_id, nivel, nota')
      .in('perfume_id', ids)

    const notasMap: Record<string, Record<string, string[]>> = {}
    for (const row of notasRows ?? []) {
      if (!notasMap[row.perfume_id]) notasMap[row.perfume_id] = {}
      if (!notasMap[row.perfume_id][row.nivel]) notasMap[row.perfume_id][row.nivel] = []
      notasMap[row.perfume_id][row.nivel].push(row.nota)
    }

    // 3. Traer clima y temporadas desde tablas separadas
    const { data: climaRows } = await supabaseAdmin
      .from('perfume_clima')
      .select('perfume_id, clima')
      .in('perfume_id', ids)

    const { data: tempRows } = await supabaseAdmin
      .from('perfume_temporadas')
      .select('perfume_id, temporada')
      .in('perfume_id', ids)

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

    // 4. Combinar todo
    const result = lista.map((p: any) => {
      const notas = notasMap[p.id] ?? {}
      return {
        id: p.id,
        nombre: p.nombre,
        casa: p.casa,
        descripcion: p.descripcion,
        imagen: p.imagen,
        stockMl: p.stock_actual ?? p.stock_ml ?? 60,
        decants: p.decants,
        piramide: {
          salida: transformNotas(notas.salida ?? p.piramide_salida),
          corazon: transformNotas(notas.corazon ?? p.piramide_corazon),
          base: transformNotas(notas.base ?? p.piramide_base),
        },
        temporadas: tempMap[p.id] ?? p.temporadas ?? [],
        clima: climaMap[p.id] ?? p.clima ?? [],
      }
    })

    return id ? NextResponse.json(result[0]) : NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}