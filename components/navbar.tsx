const ENLACES = [
  { href: "#Fragancias", texto: "Catálogo" },
  { href: "#nosotros", texto: "Nosotros" },
  { href: "#contacto", texto: "Contacto" },
]

export function Navbar() {
  return (
    <nav className="absolute top-0 z-50 flex w-full items-center justify-between border-b border-primary/15 px-[6%] py-6 backdrop-blur-md">
      <span className="font-serif text-2xl font-bold tracking-[2px] text-gold-gradient uppercase">
        ML Decants
      </span>
      <ul className="hidden gap-10 md:flex">
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
      </ul>
    </nav>
  )
}
