import Image from "next/image"
import { NIVELES_PIRAMIDE, type Piramide } from "@/lib/notas"

/**
 * Tamaño de las miniaturas de cada ingrediente.
 * Súbelo (h-14 w-14, h-16 w-16) si quieres imágenes más grandes.
 */
const TAMANO_MINIATURA = "h-12 w-12"

export function PiramideNotas({ piramide }: { piramide: Piramide }) {
  return (
    <div className="flex flex-col gap-3">
      {NIVELES_PIRAMIDE.map(({ clave, etiqueta }) => {
        const notas = piramide[clave]
        if (notas.length === 0) return null

        return (
          <section key={clave} className="flex flex-col items-center gap-1.5">
            <h4 className="text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
              {etiqueta}
            </h4>
            <ul className="flex flex-wrap items-start justify-center gap-2">
              {notas.map((nota) => (
                <li key={nota.nombre} className="flex w-16 flex-col items-center gap-1">
                  <div
                    className={`relative ${TAMANO_MINIATURA} overflow-hidden rounded-md border border-border bg-background`}
                  >
                    <Image
                      src={nota.imagen || "/placeholder.svg"}
                      alt={nota.nombre}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-center text-[10px] leading-tight text-foreground/80">
                    {nota.nombre}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
