"use client"

export function SiteFooter() {
  function abrirContacto() {
    window.dispatchEvent(new CustomEvent("abrir-contacto"))
  }

  return (
    <footer id="contacto" className="border-t border-primary/15 bg-[#080808]">
      <div className="mx-auto grid max-w-7xl gap-10 px-[6%] py-16 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-xl font-bold tracking-[2px] text-gold-gradient uppercase">
            ML Decants
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed font-light text-muted-foreground">
            Alta perfumería y fragancias de autor en formatos exclusivos de decants de 5ml y
            10ml. 100% auténticas.
          </p>
          <div className="mt-5 flex gap-5 text-xs tracking-widest text-muted-foreground uppercase">
            <a href="https://www.instagram.com/mldecants_cl?igsi=MXF2Ym5xcm5ndDhyYg==" className="hover:text-primary">Instagram</a>
            <a href="#" className="hover:text-primary">WhatsApp</a>
            <a href="https://www.tiktok.com/@mldecants2?_r=1&_t=ZS-99KRDfFPAo9" className="hover:text-primary">TikTok</a>
          </div>
        </div>

        <div>
          <h4 className="text-xs tracking-[0.2em] text-gold-light uppercase">Navegación</h4>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li><a href="#Fragancias" className="hover:text-primary">Catálogo Completo</a></li>
            <li>
              <button type="button" onClick={abrirContacto} className="hover:text-primary">
                Contacto
              </button>
            </li>
          </ul>
        </div>

        {/* <div>
          <h4 className="text-xs tracking-[0.2em] text-gold-light uppercase">
            Atención al Cliente
          </h4>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li>
              <button type="button" onClick={abrirContacto} className="hover:text-primary">
                Preguntas Frecuentes
              </button>
            </li>
            <li>
              <button type="button" onClick={abrirContacto} className="hover:text-primary">
                Envíos y Entregas
              </button>
            </li>
            <li>
              <button type="button" onClick={abrirContacto} className="hover:text-primary">
                Garantía de Autenticidad
              </button>
            </li>
            <li>
              <button type="button" onClick={abrirContacto} className="hover:text-primary">
                Términos y Condiciones
              </button>
            </li>
          </ul>
        </div> */}
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
        <p>&copy; 2026 ML Decants. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
