"use client"

import Image from "next/image"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { precioMostrar } from "@/lib/perfumes-db"
import { useEffect, useRef } from "react"

export function CartDrawer() {
  const { items, count, total, open, setOpen, updateQuantity, removeFromCart, clearCart } = useCart()
  const panelRef = useRef<HTMLDivElement>(null)
  const pushedHistoryRef = useRef(false)

  // Push state when opened, listen for back button
  useEffect(() => {
    if (open && !pushedHistoryRef.current) {
      pushedHistoryRef.current = true
      history.pushState({ modal: "carrito" }, "")
    }
    if (!open) {
      pushedHistoryRef.current = false
    }
  }, [open])

  useEffect(() => {
    function onPopState() {
      if (open) setOpen(false)
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [open, setOpen])

  function cerrar() {
    setOpen(false)
    if (pushedHistoryRef.current) {
      pushedHistoryRef.current = false
      history.back()
    }
  }

  // ESC para cerrar
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") cerrar()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  // Bloquear scroll
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  async function comprarTodo() {
    if (items.length === 0) return
    const itemsPayload = items.map((it) => ({ id: it.perfumeId, ml: it.ml * it.cantidad }))
    try {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsPayload }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Stock insuficiente para algún producto")
        // Actualizar stocks visibles
        if (data.stocks) {
          for (const [id, stockMl] of Object.entries(data.stocks as Record<string, number>)) {
            window.dispatchEvent(new CustomEvent("stock-actualizado", { detail: { id, stockMl } }))
          }
        } else if (data.id) {
          window.dispatchEvent(new CustomEvent("stock-actualizado", { detail: { id: data.id, stockMl: data.stockMl } }))
        }
        return
      }
      // Actualizar UI con stocks nuevos
      const stocks = (data.stocks as Record<string, number>) || {}
      for (const [id, stockMl] of Object.entries(stocks)) {
        window.dispatchEvent(new CustomEvent("stock-actualizado", { detail: { id, stockMl } }))
      }
      const telefono = "56936459493"
      const lineas = items.map((it, idx) => `${idx + 1}. ${it.nombre} (${it.casa}) - ${it.ml} ML x${it.cantidad} - ${precioMostrar(it.precio)} c/u = ${precioMostrar(it.precio * it.cantidad)}`)
      const totalMl = items.reduce((a, b) => a + b.ml * b.cantidad, 0)
      const mensaje = [
        "Hola! Quiero comprar en ML Decants:",
        ...lineas,
        `Total: ${precioMostrar(total)}`,
        `ML totales: ${totalMl} ml`,
      ].join("\n")
      window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, "_blank")
      clearCart()
      cerrar()
    } catch (e) {
      alert("Error al procesar la compra: " + (e as Error).message)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      <div
        aria-hidden
        onClick={cerrar}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="relative flex h-full w-full max-w-[420px] flex-col bg-[#141414] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <ShoppingBag className="size-5 text-primary" />
            Carrito
            {count > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar carrito"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Contenido */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
            <p className="text-xs text-muted-foreground/70">Toca “Añadir al carrito” en cualquier perfume para guardarlo y comprar todo junto.</p>
            <button
              type="button"
              onClick={cerrar}
              className="mt-2 rounded-full border border-white/15 px-5 py-2 text-sm text-foreground hover:bg-white/5"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {items.map((it) => (
                  <li key={`${it.perfumeId}-${it.ml}`} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-white p-1">
                      <Image src={it.imagen || "/placeholder.svg"} alt={it.nombre} fill className="object-contain" sizes="64px" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="text-xs tracking-wide text-muted-foreground uppercase">{it.casa}</p>
                      <h3 className="text-sm font-medium leading-tight text-foreground">{it.nombre}</h3>
                      <p className="text-xs text-muted-foreground">
                        {it.ml} ml · {precioMostrar(it.precio)} c/u
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(it.perfumeId, it.ml, it.cantidad - 1)}
                            className="flex size-6 items-center justify-center rounded-full hover:bg-white/10"
                            aria-label="Disminuir"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium">{it.cantidad}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(it.perfumeId, it.ml, it.cantidad + 1)}
                            className="flex size-6 items-center justify-center rounded-full hover:bg-white/10"
                            aria-label="Aumentar"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary">{precioMostrar(it.precio * it.cantidad)}</span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(it.perfumeId, it.ml)}
                            aria-label="Quitar"
                            className="rounded-full p-1 text-muted-foreground hover:bg-white/10 hover:text-red-400"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 bg-[#1a1a1a] px-5 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({count} productos)</span>
                <span className="text-lg font-bold text-foreground">{precioMostrar(total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{items.reduce((a, b) => a + b.ml * b.cantidad, 0)} ml en total</p>

              <button
                type="button"
                onClick={comprarTodo}
                className="mt-4 w-full rounded-xl bg-gold-gradient py-3 text-sm font-bold text-primary-foreground shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:opacity-90"
              >
                Comprar todo · {precioMostrar(total)}
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="mt-2 w-full rounded-xl border border-white/10 py-2.5 text-xs text-muted-foreground hover:bg-white/5"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
