// Catálogo de ML Decants — datos locales, sin base de datos.
// Para agregar una fragancia, copia un objeto de PERFUMES y edita sus campos.

export type Temporada = "invierno" | "verano" | "primavera" | "otono"
export type Clima = "frio" | "calido"

export type Decant = {
  ml: number
  sprays: number
  precio: number
}

export type Perfume = {
  id: string
  nombre: string
  casa: string
  descripcion: string
  notas: string[]
  imagen: string
  temporadas: Temporada[]
  clima: Clima[]
  decants: Decant[]
}

// Etiquetas legibles para los filtros
export const TEMPORADAS: { valor: Temporada; etiqueta: string }[] = [
  { valor: "invierno", etiqueta: "Invierno" },
  { valor: "verano", etiqueta: "Verano" },
  { valor: "primavera", etiqueta: "Primavera" },
  { valor: "otono", etiqueta: "Otoño" },
]

export const clima: { valor: Clima; etiqueta: string }[] = [
  { valor: "frio", etiqueta: "Frío" },
  { valor: "calido", etiqueta: "Cálido" },
]

const DECANTS_ESTANDAR: Decant[] = [
  { ml: 5, sprays: 75, precio: 2000 },
  { ml: 10, sprays: 150, precio: 3000 },
]

export const PERFUMES: Perfume[] = [
  {
    id: "vulcan-feu",
    nombre: "Vulcan Feu",
    casa: "French Avenue",
    descripcion:
      "Destaca por sus notas de caramelo y maderas cálidas, creando una experiencia dulce y envolvente.",
    notas: ["Caramelo", "Ron", "Vainilla", "Maderas"],
    imagen: "/decants/vulcan-feu.png",
    clima: ["calido"],
    temporadas: ["verano", "primavera"],
    decants: DECANTS_ESTANDAR,
  },
  {
    id: "asad-bourbon",
    nombre: "Asad Bourbon",
    casa: "Lattafa",
    descripcion:
      "Un aroma intenso con bourbon, café y especias que proyecta fuerza y elegancia nocturna.",
    notas: ["Bourbon", "Café", "Cardamomo", "Ámbar"],
    imagen: "/decants/asad-bourbon.png",
    clima: ["calido"],
    temporadas: ["invierno", "otono"],
    decants: DECANTS_ESTANDAR,
  },
  {
    id: "khamrah-qahwa",
    nombre: "Khamrah Qahwa",
    casa: "Lattafa",
    descripcion:
      "Café con leche, dátil y especias dulces para un gourmand adictivo de gran estela.",
    notas: ["Café", "Dátil", "Canela", "Praliné"],
    imagen: "/decants/khamrah-qahwa.png",
    clima: ["frio"],
    temporadas: ["invierno", "otono"],
    decants: DECANTS_ESTANDAR,
  },
  {
    id: "maahir-legacy",
    nombre: "Maahir Legacy",
    casa: "Lattafa",
    descripcion:
      "Fresco y afrutado con un fondo amaderado; versátil para el uso diario y de oficina.",
    notas: ["Piña", "Bergamota", "Cuero", "Pachulí"],
    imagen: "/decants/maahir-legacy.png",
    clima: ["calido"],
    temporadas: ["primavera", "otono"],
    decants: DECANTS_ESTANDAR,
  },
  {
    id: "mandarin-sky",
    nombre: "Odyssey Mandarin Sky",
    casa: "Armaf",
    descripcion:
      "Cítrico luminoso y burbujeante, ideal para los días cálidos y luminosos.",
    notas: ["Mandarina", "Naranja", "Neroli", "Almizcle"],
    imagen: "/decants/mandarin-sky.png",
    clima: ["frio"],
    temporadas: ["invierno", "otono", "primavera"],
    decants: DECANTS_ESTANDAR,
  },
  {
    id: "the-kingdom",
    nombre: "The Kingdom Man",
    casa: "Lattafa",
    descripcion:
      "Fresco aromático con lavanda y frutas; elegante, limpio y muy fácil de llevar.",
    notas: ["Lavanda", "Manzana", "Ámbar", "Vainilla"],
    imagen: "/decants/fakhar-gold.webp",
    clima: ["frio", "calido"],
    temporadas: ["primavera", "verano", "otono"],
    decants: DECANTS_ESTANDAR,
  },
  {
    id: "armaf-odyssey-homme-white",
    nombre: "Odyssey Homme White ",
    casa: "Armaf",
    descripcion:
      "Un aroma fresco y moderno con notas de bergamota y pachulí, ideal para el día a día.",
    notas: ["Bergamota", "Pachulí"],
    imagen: "/decants/fakhar-gold.webp",
    clima: ["calido"],
    temporadas: ["primavera", "verano"],
    decants: DECANTS_ESTANDAR,
  },
  {
    id: "armaf-odyssey-homme-black",
    nombre: "Odyssey Homme Black ",
    casa: "Armaf",
    descripcion:
      "Un aroma intenso y moderno con notas de pachulí y almizcle, ideal para el día a día.",
    notas: ["Pachulí", "Almizcle"],
    imagen: "/decants/fakhar-gold.webp",
    clima: ["frio"],
    temporadas: ["invierno", "otono"],
    decants: DECANTS_ESTANDAR,
  },

  /*
  {
      id: "",
      nombre: "",
      casa: "",
      descripcion:
        "",
      notas: [""],
      imagen: "/decants/",
      clima: [""],
      temporadas: [""],
      decants: DECANTS_ESTANDAR,
    },
  */
]

export function precioMostrar(valor: number): string {
  return "$" + valor.toLocaleString("es-CL")
}
