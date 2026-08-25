import Image from "next/image"

export function Hero() {
  return (
    <header className="relative flex min-h-screen items-center justify-between gap-8 px-[6%] pt-32 pb-16">
      {/* Fondo de mármol negro con vetas doradas */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/decants/marmol.webp"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Contenido */}
      <div className="max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-primary/5 px-3.5 py-1.5 text-xs tracking-[2px] text-gold-light uppercase">
          ✦ Fracciones de Alta Perfumería
        </span>

        <h1 className="mt-6 font-serif text-5xl leading-tight font-bold text-balance sm:text-6xl">
          Vive la Esencia <span className="text-gold-gradient italic">del Lujo</span>
        </h1>

        <p className="mt-6 max-w-lg leading-relaxed font-light text-muted-foreground text-pretty">
          Accede a las fragancias más exclusivas y de autor del mundo en decants de 3ml, 5ml y
          10ml. 100% auténticas, envasadas con precisión y atomizador premium dorado.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <a
            href="#Fragancias"
            className="rounded bg-gold-gradient px-8 py-4 text-sm font-bold tracking-[1.5px] text-primary-foreground uppercase shadow-[0_4px_20px_rgba(212,175,55,0.25)] transition-transform hover:-translate-y-0.5"
          >
            Explorar Catálogo
          </a>
          <a
            href="#Fragancias"
            className="rounded border border-border bg-white/[0.02] px-8 py-4 text-sm tracking-[1.5px] text-foreground uppercase transition-colors hover:border-primary hover:bg-primary/10"
          >
            Nuestras Fragancias
          </a>
        </div>

        <div className="mt-14 flex gap-10 border-t border-white/10 pt-8">
          <div>
            <p className="font-serif text-2xl text-gold-light">100%</p>
            <p className="mt-1 text-xs tracking-[1px] text-muted-foreground uppercase">
              Autenticidad Garantizada
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl text-gold-light">24/48h</p>
            <p className="mt-1 text-xs tracking-[1px] text-muted-foreground uppercase">
              Envíos Rápidos
            </p>
          </div>
        </div>
      </div>

      {/* Visual lateral: composición de frascos */}
      <div className="relative hidden h-[480px] w-[560px] lg:block">
        <Image
          src="/decants/perfumes.png"
          alt="Decants de perfume ML Decants"
          fill
          priority
          className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
        />
      </div>

      {/* Divisor dorado inferior */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full bg-[linear-gradient(90deg,transparent_0%,rgba(212,175,55,0.6)_50%,transparent_100%)] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
      />
    </header>
  )
}
