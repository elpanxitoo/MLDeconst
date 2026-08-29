"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronDown, Minus, Plus, ShieldCheck, ShoppingCart, Sparkles, Truck, X } from "lucide-react"
import { PERFUMES, precioMostrar, type Perfume } from "@/lib/perfumes"
import { PiramideNotas } from "@/components/piramide-notas"
import { useCart } from "@/components/cart-context"

export function PerfumeDetailModal() {
  const [perfume, setPerfume] = useState<Perfume | null>(null)
  const [decantIdx, setDecantIdx] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [piramideAbierta, setPiramideAbierta] = useState(true)
  const [stockMl, setStockMl] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const { addToCart } = useCart()
  const decant = perfume?.decants[decantIdx]
  const total = decant ? decant.precio * cantidad : 0
  const mlNecesarios = decant ? decant.ml * cantidad : 0
  const sinStock = stockMl === 0
  const stockInsuficiente = mlNecesarios > stockMl
  const maxCantidad = decant && stockMl > 0 ? Math.max(1, Math.floor(stockMl / decant.ml)) : 1

  function cerrar() {
    setPerfume(null)
    setCantidad(1)
    setDecantIdx(0)
  }

  function abrir(id: string) {
    const p = PERFUMES.find((x) => x.id === id) ?? null
    if (p) {
      setPerfume(p)
      setDecantIdx(0) // default 5 ml
      setCantidad(1)
      setPiramideAbierta(true) // acordeón abierto por defecto en móvil
      const guardado = typeof window !== "undefined" ? localStorage.getItem(`ml-stock-${p.id}`) : null
      const inicial = guardado !== null ? parseInt(guardado, 10) : (p.stockMl ?? 60)
      const stock = isNaN(inicial as number) ? (p.stockMl ?? 60) : (inicial as number)
      setStockMl(stock)
    }
  }

  function comprar() {
    if (!perfume || !decant || sinStock || stockInsuficiente) return
    const nuevoStock = stockMl - mlNecesarios
    setStockMl(nuevoStock)
    localStorage.setItem(`ml-stock-${perfume.id}`, String(nuevoStock))
    window.dispatchEvent(new CustomEvent("stock-actualizado", { detail: { id: perfume.id, stockMl: nuevoStock } }))
    // Redirigir a WhatsApp con detalle del perfume
    const telefono = "56986037614"
    const mensaje = [
      "Hola! Quiero comprar en ML Decants:",
      `- ${perfume.nombre} (${perfume.casa}) - ${decant.ml} ML x${cantidad} (~${decant.sprays} atomizaciones) - ${precioMostrar(decant.precio)} c/u`,
      `Total: ${precioMostrar(total)}`,
      `ML totales: ${mlNecesarios} ml`,
    ].join("\n")
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")
    cerrar()
  }

  function anadirAlCarrito() {
    if (!perfume || !decant || sinStock || stockInsuficiente) return
    addToCart({
      perfumeId: perfume.id,
      nombre: perfume.nombre,
      casa: perfume.casa,
      imagen: perfume.imagen,
      ml: decant.ml,
      precio: decant.precio,
      sprays: decant.sprays,
      cantidad,
    })
    cerrar()
  }

  // Ajustar cantidad si cambia decant y excede stock
  useEffect(() => {
    if (decant && stockMl > 0 && cantidad > maxCantidad) {
      setCantidad(maxCantidad)
    }
  }, [decantIdx, stockMl, maxCantidad, cantidad, decant])

  // Evento global
  useEffect(() => {
    function handler(e: Event) {
      const id = (e as CustomEvent<string>).detail
      if (typeof id === "string") abrir(id)
    }
    window.addEventListener("abrir-perfume", handler as EventListener)
    return () => window.removeEventListener("abrir-perfume", handler as EventListener)
  }, [])

  // Bloquear scroll + ESC
  useEffect(() => {
    if (!perfume) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") cerrar()
    }
    document.addEventListener("keydown", onKey)
    setTimeout(() => panelRef.current?.focus(), 0)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener("keydown", onKey)
    }
  }, [perfume])

  if (!perfume || !decant) return null

  const estilo = perfume.piramide.base.map((n) => n.nombre).slice(0, 2).join(" / ") || "Amaderado especiado"

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) cerrar()
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="perfume-modal-title"
        className="relative flex max-h-[92vh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.8)] outline-none md:max-h-[88vh] md:flex-row"
      >
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-1.5 text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          <X className="size-4" />
        </button>

        {/* Imagen - arriba en móvil, izq en desktop - sin fondo blanco */}
        <div className="relative flex shrink-0 flex-col bg-[#1c1c1c] p-3 md:w-[48%] md:p-4">
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-transparent p-4">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.18)_0%,transparent_65%)]"
            />
            <Image
              src={perfume.imagen || "/placeholder.svg"}
              alt={`${perfume.nombre} de ${perfume.casa}`}
              width={500}
              height={500}
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
            />
          </div>
          <div className="mt-3 hidden rounded-xl border border-white/5 bg-white/[0.03] p-3 md:block">
            <PiramideNotas piramide={perfume.piramide} />
          </div>
        </div>

        {/* Detalle */}
        <div className="flex flex-1 flex-col overflow-y-auto p-5 md:p-6">
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {perfume.casa}
          </p>
          <h2
            id="perfume-modal-title"
            className="mt-1 font-serif text-xl leading-tight font-bold text-foreground md:text-2xl"
          >
            {perfume.nombre} Decant {decant.ml} ML
          </h2>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-muted-foreground">Eau de Parfum</span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-muted-foreground">{decant.ml} ml</span>
            {perfume.temporadas.slice(0, 1).map((t) => (
              <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-xs capitalize text-muted-foreground">
                {t}
              </span>
            ))}
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Parecido a <span className="font-medium text-foreground">{perfume.casa} {perfume.nombre}</span>
          </p>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{precioMostrar(decant.precio)}</span>
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              {decant.ml} ml · ~{decant.sprays} atomizaciones
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            {perfume.decants.map((d, i) => (
              <button
                key={d.ml}
                type="button"
                onClick={() => setDecantIdx(i)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${i === decantIdx
                  ? "border-primary bg-gold-gradient text-primary-foreground"
                  : "border-white/15 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
              >
                {d.ml} ML · {precioMostrar(d.precio)}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
            {perfume.descripcion}
          </p>

          <ul className="mt-4 flex flex-col gap-1.5 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" /> <span><span className="text-foreground">Marca:</span> {perfume.casa}</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" /> <span><span className="text-foreground">Tipo:</span> Eau de Parfum (EDP)</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" /> <span><span className="text-foreground">Contenido:</span> {decant.ml} ml</span>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" /> <span><span className="text-foreground">Estilo:</span> {estilo}</span>
            </li>
          </ul>

          {/* Pirámide en móvil - acordeón visible y abierto por defecto */}
          <div className="mt-4 overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] md:hidden">
            <button
              type="button"
              onClick={() => setPiramideAbierta((v) => !v)}
              aria-expanded={piramideAbierta}
              aria-controls="piramide-contenido-movil"
              className="flex w-full items-center justify-between px-3 py-3 text-left"
            >
              <span className="text-xs font-semibold tracking-[0.14em] text-foreground uppercase">
                Pirámide olfativa
              </span>
              <ChevronDown
                aria-hidden
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${piramideAbierta ? "rotate-180" : ""}`}
              />
            </button>
            {piramideAbierta && (
              <div id="piramide-contenido-movil" role="region" className="border-t border-white/5 p-3">
                <PiramideNotas piramide={perfume.piramide} />
              </div>
            )}
          </div>

          {/* Cantidad y stock en ML */}
          <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] px-1 py-1">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                disabled={cantidad <= 1}
                className="flex size-7 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
                aria-label="Disminuir cantidad"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-medium">{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(maxCantidad, c + 1))}
                disabled={cantidad >= maxCantidad || stockInsuficiente}
                className="flex size-7 items-center justify-center rounded-full hover:bg-white/10 disabled:opacity-30"
                aria-label="Aumentar cantidad"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <span className={`flex items-center gap-1.5 text-xs ${sinStock ? "text-red-400" : stockMl < 15 ? "text-amber-400" : "text-muted-foreground"}`}>
              <span className={`size-1.5 rounded-full ${sinStock ? "bg-red-500" : stockMl < 15 ? "bg-amber-500" : "bg-emerald-500"}`} /> {stockMl} ml disponibles
            </span>
            {stockInsuficiente && !sinStock && (
              <span className="text-xs text-amber-400">Stock insuficiente</span>
            )}
          </div>

          {/* Acciones */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={anadirAlCarrito}
              disabled={sinStock || stockInsuficiente}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ShoppingCart className="size-4" />
              {sinStock ? "Sin stock" : "Añadir al carrito"}
            </button>
            <button
              type="button"
              onClick={comprar}
              disabled={sinStock || stockInsuficiente}
              className="rounded-xl bg-gold-gradient px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-opacity hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none"
            >
              {sinStock ? "Agotado" : `Comprar ahora · ${precioMostrar(total)}`}
            </button>
          </div>
          {stockInsuficiente && (
            <p className="mt-2 text-xs text-amber-400">Solo quedan {stockMl} ml. Reduce la cantidad o elige 5 ml.</p>
          )}

          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> Compra segura y producto original
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5" /> Envío a domicilio
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <h4 className="text-xs font-semibold tracking-wide text-foreground">¿Cómo comprar?</h4>
            <ol className="mt-2 flex flex-col gap-1.5 text-xs leading-relaxed text-muted-foreground">
              <li className="flex gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">1</span>
                <span>Elige el formato (5 ml o 10 ml) y la cantidad que deseas.</span>
              </li>
              <li className="flex gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">2</span>
                <span>
                  Toca <span className="font-medium text-foreground">Comprar ahora</span> para pedir por WhatsApp
                </span>
              </li>
              <li className="flex gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">3</span>
                <span>Te confirmamos stock, coordinamos el pago y el envío a domicilio.</span>
              </li>
            </ol>
            <p className="mt-2.5 border-t border-white/5 pt-2 text-[11px] text-muted-foreground/80">
              ¿Dudas con la fragancia? Escríbenos y te ayudamos a elegir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
