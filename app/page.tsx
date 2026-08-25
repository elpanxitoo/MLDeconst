import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ColeccionPerfumes } from "@/components/coleccion-perfumes"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ColeccionPerfumes />
      </main>
      <SiteFooter />
    </>
  )
}
