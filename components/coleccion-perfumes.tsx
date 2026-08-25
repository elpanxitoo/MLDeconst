"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import {
  clima,
  PERFUMES,
  TEMPORADAS,
  type Clima,
  type Temporada,
} from "@/lib/perfumes"
import { PerfumeCard, type PedestalVariant } from "@/components/perfume-card"
import { cn } from "@/lib/utils"

const PEDESTALES: { valor: PedestalVariant; etiqueta: string }[] = [
  { valor: "podio", etiqueta: "Podio de mármol" },
  { valor: "losa", etiqueta: "Losa de mármol" },
]

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={cn(
        "rounded-full border px-4 py-2 text-xs tracking-widest uppercase transition-all",
        activo
          ? "border-primary bg-gold-gradient text-primary-foreground shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
          : "border-border text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  )
}

export function ColeccionPerfumes() {
  const [temporadas, setTemporadas] = useState<Temporada[]>([])
  const [momentos, setMomentos] = useState<Clima[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [pedestal, setPedestal] = useState<PedestalVariant>("podio")

  function toggle<T>(lista: T[], valor: T, set: (v: T[]) => void) {
    set(lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor])
  }

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return PERFUMES.filter((p) => {
      const okTemporada =
        temporadas.length === 0 || temporadas.some((t) => p.temporadas.includes(t))
      const okMomento =
        momentos.length === 0 || momentos.some((m) => p.clima.includes(m))
      const okBusqueda =
        q === "" ||
        p.nombre.toLowerCase().includes(q) ||
        p.casa.toLowerCase().includes(q) ||
        p.notas.some((n) => n.toLowerCase().includes(q))
      return okTemporada && okMomento && okBusqueda
    })
  }, [temporadas, momentos, busqueda])

  const hayFiltros = temporadas.length > 0 || momentos.length > 0 || busqueda !== ""

  function limpiar() {
    setTemporadas([])
    setMomentos([])
    setBusqueda("")
  }

  return (
    <section id="Fragancias" className="px-[4%] py-20">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-primary/5 px-4 py-1.5 text-xs tracking-[0.2em] text-gold-light uppercase">
            ✦ Catálogo Exclusivo
          </span>
          <h2 className="mt-3 font-serif text-4xl text-balance sm:text-5xl">
            Nuestras <span className="text-gold-gradient italic">Fragancias</span>
          </h2>
        </div>

        {/* Panel de filtros */}
        <div className="mb-10 flex flex-col gap-6 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-3">
            <label
              htmlFor="buscar"
              className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase"
            >
              Buscar
            </label>
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="buscar"
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre, casa o nota olfativa…"
                className="w-full rounded-lg border border-border bg-background py-3 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              Temporada
            </span>
            <div className="flex flex-wrap gap-2">
              {TEMPORADAS.map((t) => (
                <Chip
                  key={t.valor}
                  activo={temporadas.includes(t.valor)}
                  onClick={() => toggle(temporadas, t.valor, setTemporadas)}
                >
                  {t.etiqueta}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              Momento
            </span>
            <div className="flex flex-wrap gap-2">
              {clima.map((m) => (
                <Chip
                  key={m.valor}
                  activo={momentos.includes(m.valor)}
                  onClick={() => toggle(momentos, m.valor, setMomentos)}
                >
                  {m.etiqueta}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              {filtrados.length}{" "}
              {filtrados.length === 1 ? "fragancia" : "fragancias"}
            </p>
            {hayFiltros && (
              <button
                type="button"
                onClick={limpiar}
                className="flex items-center gap-1 text-xs tracking-widest text-primary uppercase underline-offset-4 hover:underline"
              >
                <X aria-hidden className="size-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Selector de estilo de pedestal (vista previa) */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Estilo de repisa
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {PEDESTALES.map((op) => (
              <Chip
                key={op.valor}
                activo={pedestal === op.valor}
                onClick={() => setPedestal(op.valor)}
              >
                {op.etiqueta}
              </Chip>
            ))}
          </div>
        </div>

        {/* Grilla de resultados */}
        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((p) => (
              <PerfumeCard key={p.id} perfume={p} pedestal={pedestal} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="font-serif text-2xl text-gold-light">Sin resultados</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Ninguna fragancia coincide con esos filtros. Prueba quitar alguno.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
