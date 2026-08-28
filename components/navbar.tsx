"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"

const ENLACES = [{ href: "#Fragancias", texto: "Catálogo" }]

export function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const [visible, setVisible] = useState(true)
  const ultimaY = useRef(0)

  function abrirContacto() {
    window.dispatchEvent(new CustomEvent("abrir-contacto"))
    setAbierto(false)
  }

  function cerrarMenu() {
    setAbierto(false)
  }

  // Cerrar con ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierto(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  // Bloquear scroll cuando menú abierto en móvil
  useEffect(() => {
    if (abierto) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [abierto])

  // Auto-hide en móvil: baja → oculta, sube → aparece inmediato
  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      const esMovil = window.innerWidth < 768
      if (!esMovil) {
        setVisible(true)
        ultimaY.current = y
        return
      }
      if (abierto) {
        // menú abierto → siempre visible
        setVisible(true)
        ultimaY.current = y
        return
      }
      if (y < 10) {
        setVisible(true)
      } else if (y > ultimaY.current) {
        // bajando
        if (y > 80) setVisible(false)
      } else {
        // subiendo → aparece inmediato
        setVisible(true)
      }
      ultimaY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [abierto])

  return (
    <nav
      className={`fixed top-0 z-50 flex w-full items-center justify-between border-b border-primary/15 bg-black/20 px-[6%] py-6 backdrop-blur-md transition-transform duration-300 will-change-transform ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <span className="font-serif text-xl font-bold tracking-[2px] text-gold-gradient uppercase md:text-2xl">
        ML Decants
      </span>

      {/* Desktop */}
      <ul className="hidden items-center gap-10 md:flex">
        {ENLACES.map((e) => (
          <li key={e.href}>
            <a
              href={e.href}
              className="text-[0.8rem] tracking-[1.5px] text-muted-foreground uppercase transition-colors hover:text-primary"
            >
              {e.texto}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={abrirContacto}
            className="text-[0.8rem] tracking-[1.5px] text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            Contacto
          </button>
        </li>
      </ul>

      {/* Botón hamburguesa - solo móvil */}
      <button
        type="button"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={abierto}
        aria-controls="navbar-movil"
        onClick={() => setAbierto((v) => !v)}
        className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground transition-colors hover:bg-white/10 md:hidden"
      >
        {abierto ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {/* Panel móvil */}
      {abierto && (
        <>
          <div
            aria-hidden
            onClick={cerrarMenu}
            className="fixed inset-0 top-[73px] bg-black/60 backdrop-blur-sm md:hidden"
          />
          <div
            id="navbar-movil"
            className="absolute top-full left-0 w-full border-t border-white/10 bg-[#0a0a0a]/95 px-[6%] py-6 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <a
                    href={e.href}
                    onClick={cerrarMenu}
                    className="flex w-full rounded-lg px-3 py-3 text-sm tracking-[1.5px] text-muted-foreground uppercase transition-colors hover:bg-white/5 hover:text-primary"
                  >
                    {e.texto}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={abrirContacto}
                  className="flex w-full rounded-lg px-3 py-3 text-sm tracking-[1.5px] text-muted-foreground uppercase transition-colors hover:bg-white/5 hover:text-primary"
                >
                  Contacto
                </button>
              </li>
            </ul>
            <div className="mt-6 border-t border-white/5 pt-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Alta perfumería en decants de 5ml y 10ml. 100% auténticos.
              </p>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
