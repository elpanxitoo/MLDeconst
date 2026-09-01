"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Clock, Mail, MapPin, MessageCircle, Phone, Send, X } from "lucide-react"

export function ContactModal() {
  const [abierto, setAbierto] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function cerrar() {
    if (abierto) {
      setAbierto(false)
      history.back()
      return
    }
    setAbierto(false)
  }

  function abrir() {
    setAbierto(true)
    history.pushState({ modal: "contacto" }, "")
  }

  // Escucha evento global "abrir-contacto" disparado por Navbar/Hero/Footer
  useEffect(() => {
    function handler() {
      abrir()
    }
    window.addEventListener("abrir-contacto", handler)
    return () => window.removeEventListener("abrir-contacto", handler)
  }, [])

  // Bloquear scroll + ESC + focus
  useEffect(() => {
    if (!abierto) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") cerrar()
    }
    function onPopState() {
      setAbierto(false)
    }
    document.addEventListener("keydown", onKeyDown)
    window.addEventListener("popstate", onPopState)

    // Focus al panel
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("popstate", onPopState)
    }
  }, [abierto])

  if (!abierto) return null

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) cerrar()
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      aria-hidden={!abierto}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="relative w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#141414] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] outline-none"
      >
        {/* Cerrar */}
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <h2 id="contact-modal-title" className="pr-8 text-xl font-bold text-foreground">
          Hablemos
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
          Escríbenos por el canal que prefieras y te ayudamos a elegir tu próxima fragancia.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {/* Teléfono - destacado con borde claro como en la imagen */}
          <a
            href="tel:+56912345678"
            className="flex items-center gap-3 rounded-xl border border-white/80 bg-white/[0.04] px-4 py-3.5 transition-colors hover:bg-white/[0.08] hover:border-white"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Phone className="size-4 text-foreground" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Teléfono</span>
              <span className="text-sm text-muted-foreground">+56 9 1234 5678</span>
            </span>
          </a>

          <a
            href="https://wa.me/56912345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-white/[0.04]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <MessageCircle className="size-4 text-foreground" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium text-foreground">WhatsApp</span>
              <span className="text-sm text-muted-foreground">Escríbenos, respondemos rápido</span>
            </span>
          </a>

          <a
            href="mailto:contacto@essenceperfumes.cl"
            className="flex items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-white/[0.04]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Mail className="size-4 text-foreground" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Correo</span>
              <span className="text-sm text-muted-foreground">contacto.mldecants@gmail.com</span>
            </span>
          </a>
        </div>

        {/* Footer horario + acciones */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Lun a Sáb, 10:00 – 19:00
          </span>
          <div className="flex gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <Camera className="size-3.5" />
            </a>
            <a
              href="https://wa.me/56986037614"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <Send className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
