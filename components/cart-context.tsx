"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type CartItem = {
  perfumeId: string
  nombre: string
  casa: string
  imagen: string
  ml: number
  precio: number
  sprays: number
  cantidad: number
}

type CartContextType = {
  items: CartItem[]
  count: number
  total: number
  totalMl: number
  addToCart: (item: Omit<CartItem, "cantidad"> & { cantidad: number }) => void
  removeFromCart: (perfumeId: string, ml: number) => void
  updateQuantity: (perfumeId: string, ml: number, cantidad: number) => void
  clearCart: () => void
  open: boolean
  setOpen: (v: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = "ml-carrito"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [open, setOpen] = useState(false)

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // Guardar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const count = items.reduce((a, b) => a + b.cantidad, 0)
  const total = items.reduce((a, b) => a + b.precio * b.cantidad, 0)
  const totalMl = items.reduce((a, b) => a + b.ml * b.cantidad, 0)

  function addToCart(nuevo: Omit<CartItem, "cantidad"> & { cantidad: number }) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.perfumeId === nuevo.perfumeId && p.ml === nuevo.ml)
      if (idx >= 0) {
        const copia = [...prev]
        copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + nuevo.cantidad }
        return copia
      }
      return [...prev, { ...nuevo }]
    })
    setOpen(true)
  }

  function removeFromCart(perfumeId: string, ml: number) {
    setItems((prev) => prev.filter((p) => !(p.perfumeId === perfumeId && p.ml === ml)))
  }

  function updateQuantity(perfumeId: string, ml: number, cantidad: number) {
    if (cantidad <= 0) {
      removeFromCart(perfumeId, ml)
      return
    }
    setItems((prev) =>
      prev.map((p) => (p.perfumeId === perfumeId && p.ml === ml ? { ...p, cantidad } : p))
    )
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, count, total, totalMl, addToCart, removeFromCart, updateQuantity, clearCart, open, setOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider")
  return ctx
}
