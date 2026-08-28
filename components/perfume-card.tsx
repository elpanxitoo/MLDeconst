"use client"

import Image from "next/image"
import { precioMostrar, type Perfume } from "@/lib/perfumes"
import { PiramideNotas } from "@/components/piramide-notas"

export type PedestalVariant = "podio" | "losa"

const PEDESTALES: Record<
  PedestalVariant,
  { src: string; alto: string; anchoFrasco: string; offsetFrasco: string; offsetPedestal: string }
> = {
  podio: {
    src: "/decants/pedestal-podio.png",
    alto: "h-[45%]",
    anchoFrasco: "max-h-28 md:max-h-52",
    offsetFrasco: "bottom-[7.5%] md:bottom-[15%]",
    offsetPedestal: "bottom-[-6%] md:bottom-[-8%]", //md:bottom escritorio
  },
  losa: {
    src: "/decants/pedestal-losa.png",
    alto: "h-[100%]",
    anchoFrasco: "max-h-28 md:max-h-52",
    offsetFrasco: "bottom-[11%] md:bottom-[20%]",
    offsetPedestal: "bottom-[-28%] md:bottom-[-33%]",
  },
}

export function PerfumeCard({
  perfume,
  pedestal = "podio",
}: {
  perfume: Perfume
  pedestal?: PedestalVariant
}) {
  const p = PEDESTALES[pedestal]

  function abrirModal() {
    window.dispatchEvent(new CustomEvent("abrir-perfume", { detail: perfume.id }))
  }

  // Precio destacado "Desde" -> el más barato (5 ml por default)
  const decantCard = perfume.decants[0] ?? perfume.decants[perfume.decants.length - 1]

  return (
    <article
      onClick={abrirModal}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalle de ${perfume.nombre}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          abrirModal()
        }
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)] md:p-6"
    >
      {/* Módulo visual: frasco sobre pedestal de mármol con halo dorado - mismo diseño móvil y escritorio */}
      <div className="relative flex h-44 items-end justify-center overflow-hidden rounded-xl md:h-70">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.15)_0%,transparent_70%)] transition-all duration-500 group-hover:bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.28)_0%,transparent_70%)]"
        />
        <div aria-hidden className={`absolute inset-x-0 ${p.offsetPedestal} ${p.alto}`}>
          <Image
            src={p.src || "/placeholder.svg"}
            alt=""
            fill
            sizes="400px"
            className="object-contain object-bottom"
          />
        </div>
        <Image
          src={perfume.imagen || "/placeholder.svg"}
          alt={`Frasco del perfume ${perfume.nombre} de ${perfume.casa}`}
          width={260}
          height={260}
          className={`absolute left-1/2 z-10 w-auto -translate-x-1/2 object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-out group-hover:-translate-y-1 ${p.anchoFrasco} ${p.offsetFrasco}`}
        />
      </div>

      {/* Zona de texto */}
      <div className="relative mt-3 flex flex-1 flex-col md:mt-4 md:min-h-40">
        <div className="text-center">
          <p className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase md:text-[11px] md:tracking-[0.2em]">
            {perfume.casa}
          </p>
          <h3 className="mt-1 font-serif text-base leading-tight text-gold-light md:text-2xl">
            {perfume.nombre}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground md:mt-2 md:line-clamp-none md:text-sm">
            {perfume.descripcion}
          </p>
          <p className="mt-2 text-xs font-bold text-primary md:mt-2 md:text-sm">
            Desde {precioMostrar(decantCard.precio)}
          </p>
          <p className="mt-1 hidden text-xs font-medium tracking-wide text-primary/80 md:block">Ver detalle → presione la imagen</p>
        </div>
      </div>

      {/* Panel hover peek solo desktop */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden flex-col overflow-y-auto bg-card/95 p-5 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 md:flex">
        <header className="text-center">
          <p className="text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
            {perfume.casa}
          </p>
          <h3 className="font-serif text-xl text-gold-light">{perfume.nombre}</h3>
        </header>
        <div className="mt-3">
          <PiramideNotas piramide={perfume.piramide} />
        </div>
        <div className="mt-4 border-t border-border pt-3">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Precios de decants disponibles para {perfume.nombre}
            </caption>
            <tbody>
              {perfume.decants.map((d) => (
                <tr key={d.ml} className="align-baseline">
                  <th scope="row" className="py-0.5 text-left font-normal text-foreground">
                    {d.ml} ML
                  </th>
                  <td className="py-0.5 text-center text-xs text-muted-foreground">
                    ~{d.sprays} atomizaciones
                  </td>
                  <td className="py-0.5 text-right text-primary">
                    {precioMostrar(d.precio)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Etiquetas - más compactas en móvil */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 border-t border-border pt-3 md:mt-auto md:gap-2 md:pt-4">
        {[...perfume.temporadas, ...perfume.clima].map((cat) => (
          <span
            key={cat}
            className="rounded-full border border-border px-2 py-0.5 text-[9px] tracking-widest text-muted-foreground uppercase md:px-2.5 md:py-1 md:text-[10px]"
          >
            {cat}
          </span>
        ))}
      </div>
    </article>
  )
}
