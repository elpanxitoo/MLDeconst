import Image from "next/image"
import { precioMostrar, type Perfume } from "@/lib/perfumes"

export type PedestalVariant = "podio" | "losa"

/**
 * Configuración de cada estilo de repisa.
 * - alto:         altura de la repisa dentro del recuadro (porcentaje del alto de 256px).
 * - anchoFrasco:  tamaño máximo del frasco (max-h-40 = 10rem, max-h-52 = 13rem, etc.).
 * - offsetFrasco: qué tan arriba se apoya el frasco sobre la repisa (bottom-[24%]…).
 */
const PEDESTALES: Record<
  PedestalVariant,
  { src: string; alto: string; anchoFrasco: string; offsetFrasco: string; offsetPedestal: string }
> = {
  // Podio de mármol de dos niveles
  podio: {
    src: "/decants/pedestal-podio.png",
    alto: "h-[45%]",
    anchoFrasco: "max-h-52",
    offsetFrasco: "bottom-[15%]",
    offsetPedestal: "bottom-[-8%]",
  },
  // Losa / mesa baja de mármol con franja dorada
  losa: {
    src: "/decants/pedestal-losa.png",
    alto: "h-[100%]",
    anchoFrasco: "max-h-52",
    offsetFrasco: "bottom-[20%]",
    offsetPedestal: "bottom-[-33%]",
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
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)]">
      {/* Módulo visual: frasco sobre pedestal de mármol con halo dorado */}
      <div className="relative flex h-70 items-end justify-center overflow-hidden rounded-xl">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.15)_0%,transparent_70%)] transition-all duration-500 group-hover:bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.28)_0%,transparent_70%)]"
        />

        {/* Pedestal / repisa de mármol (imagen completa apoyada abajo) */}
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
          className={`absolute left-1/2 z-10 w-auto -translate-x-1/2 object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1 ${p.anchoFrasco} ${p.offsetFrasco}`}
        />
      </div>

      {/* Zona de texto: alterna entre descripción y notas/precios al hacer hover */}
      <div className="relative mt-4 min-h-40">
        {/* Estado por defecto */}
        <div className="text-center transition-all duration-300 group-hover:-translate-y-4 group-hover:opacity-0">
          <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            {perfume.casa}
          </p>
          <h3 className="mt-1 font-serif text-2xl text-gold-light">
            {perfume.nombre}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {perfume.descripcion}
          </p>
        </div>

        {/* Estado hover: notas y precios de decants */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
          <span className="text-[11px] tracking-[0.2em] text-primary uppercase">
            Notas Olfativas
          </span>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm text-foreground/85">
            {perfume.notas.map((nota, i) => (
              <li key={nota} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="text-primary/60">·</span>}
                {nota}
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-0.5 text-sm text-muted-foreground">
            {perfume.decants.map((d) => (
              <p key={d.ml}>
                <span className="text-foreground">{d.ml} ML</span> (~{d.sprays} atomizaciones){" "}
                <span className="text-primary">{precioMostrar(d.precio)}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Etiquetas de temporada y momento */}
      <div className="mt-auto flex flex-wrap items-center justify-center gap-2 border-t border-border pt-4">
        {[...perfume.temporadas, ...perfume.clima].map((cat) => (
          <span
            key={cat}
            className="rounded-full border border-border px-2.5 py-1 text-[10px] tracking-widest text-muted-foreground uppercase"
          >
            {cat}
          </span>
        ))}
      </div>
    </article>
  )
}
