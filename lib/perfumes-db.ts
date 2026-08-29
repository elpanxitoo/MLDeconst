export type Decant = {
  ml: number
  sprays: number
  precio: number
}

export type Nota = {
  nombre: string
  imagen: string
}

export type Piramide = {
  salida: Nota[]
  corazon: Nota[]
  base: Nota[]
}

export type Perfume = {
  id: string
  nombre: string
  casa: string
  descripcion: string
  imagen: string
  stockMl: number
  decants: Decant[]
  piramide: Piramide
  temporadas: string[]
  clima: string[]
}

export type Temporada = 'invierno' | 'verano' | 'primavera' | 'otono'
export type Clima = 'frio' | 'calido'

export const TEMPORADAS: { valor: Temporada; etiqueta: string }[] = [
  { valor: 'invierno', etiqueta: 'Invierno' },
  { valor: 'verano', etiqueta: 'Verano' },
  { valor: 'primavera', etiqueta: 'Primavera' },
  { valor: 'otono', etiqueta: 'Otoño' },
]

export const CLIMA: { valor: Clima; etiqueta: string }[] = [
  { valor: 'frio', etiqueta: 'Frío' },
  { valor: 'calido', etiqueta: 'Cálido' },
]

const BASE_URL = typeof window === 'undefined' ? '' : ''

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Error al obtener perfumes')
  }
  return res.json()
}

export async function getPerfumes(): Promise<Perfume[]> {
  return fetcher(`${BASE_URL}/api/perfumes`)
}

export async function getPerfume(id: string): Promise<Perfume | null> {
  try {
    return await fetcher(`${BASE_URL}/api/perfumes?id=${encodeURIComponent(id)}`)
  } catch {
    return null
  }
}

export function precioMostrar(valor: number): string {
  return '$' + valor.toLocaleString('es-CL')
}