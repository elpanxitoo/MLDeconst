// Catálogo de ML Decants — datos locales, sin base de datos.
// Para agregar una fragancia, copia un objeto de PERFUMES y edita sus campos.

import { NOTAS, type Piramide } from './notas';

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
  piramide: Piramide
  imagen: string
  temporadas: Temporada[]
  clima: Clima[]
  decants: Decant[]
  /** Stock total en ML Se descuenta al comprar. */
  stockMl?: number
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

export const PERFUMES: Perfume[] = [
  {
    id: "vulcan-feu",
    nombre: "Vulcan Feu",
    casa: "French Avenue",
    descripcion:
      "Destaca por sus notas de caramelo y maderas cálidas, creando una experiencia dulce y envolvente.",
    notas: [],
    piramide: {
      salida: [NOTAS.mango, NOTAS.lima, NOTAS.jengibre, NOTAS.ruibarbo],
      corazon: [NOTAS.pimientaRosa, NOTAS.jazmin, NOTAS.violeta, NOTAS.praline],
      base: [NOTAS.habaTonka, NOTAS.cedro, NOTAS.ambarGris, NOTAS.musgo],
    },
    imagen: "/decants/vulcan-feu.png",
    clima: ["calido"],
    temporadas: ["verano", "primavera"],
    stockMl: 80,
    decants: [
      { ml: 5, sprays: 90, precio: 14990 },
      { ml: 10, sprays: 160, precio: 23391 },
    ],
  },
  {
    id: "asad-bourbon",
    nombre: "Asad Bourbon",
    casa: "Lattafa",
    descripcion:
      "¡Pura elegancia nocturna! Bourbon intenso y café oscuro sobre una vainilla cálida. Úsalo para proyectar poder y misterio en tus noches más frías",
    notas: [],
    piramide: {
      salida: [NOTAS.lavanda, NOTAS.ciruelaMirabel, NOTAS.pimientaRosa],
      corazon: [NOTAS.cacao, NOTAS.nuezMoscada, NOTAS.davana],
      base: [NOTAS.vainillaBourbon, NOTAS.ambar, NOTAS.vetiver],
    },
    imagen: "/decants/asad-bourbon.png",
    clima: ["calido"],
    temporadas: ["invierno", "otono"],
    stockMl: 65,
    decants: [
      { ml: 5, sprays: 90, precio: 16990 },
      { ml: 10, sprays: 160, precio: 25990 },
    ],
  },
  {
    id: "khamrah-qahwa",
    nombre: "Khamrah Qahwa",
    casa: "Lattafa",
    descripcion:
      "¡Un imán de cumplidos! Café dulce y dátiles especiados sobre un fondo envolvente. Úsalo para atrapar todas las miradas y dejar una estela irresistible en invierno.",
    notas: [],
    piramide: {
      salida: [NOTAS.canela, NOTAS.cardamomo, NOTAS.jengibre],
      corazon: [NOTAS.praline, NOTAS.frutasConfitadas, NOTAS.floresBlancas],
      base: [NOTAS.cafe, NOTAS.vainilla, NOTAS.habaTonka, NOTAS.benjui, NOTAS.almizcle],
    },
    imagen: "/decants/khamrah-qahwa.png",
    clima: ["frio"],
    temporadas: ["invierno", "otono"],
    stockMl: 65,
    decants: [
      { ml: 5, sprays: 90, precio: 13990 },
      { ml: 10, sprays: 160, precio: 21990 },
    ],
  },
  {
    id: "maahir-legacy",
    nombre: "Maahir Legacy",
    casa: "Lattafa",
    descripcion:
      "¡Una ráfaga de pura frescura! Lima chispeante y menta limpia sobre maderas elegantes. Úsalo para transmitir energía y seguridad total en la oficina o el día a día.",
    notas: [],
    piramide: {
      salida: [NOTAS.lima, NOTAS.menta, NOTAS.toronja, NOTAS.lavanda, NOTAS.pina],
      corazon: [NOTAS.bayaEnebro, NOTAS.romero, NOTAS.geranio, NOTAS.pimientaNegra, NOTAS.incienso],
      base: [NOTAS.ambroxan, NOTAS.musgoRoble, NOTAS.vetiver, NOTAS.cachemira, NOTAS.habaTonka],
    },
    imagen: "/decants/maahir-legacy.png",
    clima: ["calido"],
    temporadas: ["primavera", "otono"],
    stockMl: 70,
    decants: [
      { ml: 5, sprays: 90, precio: 11990 },
      { ml: 10, sprays: 160, precio: 18990 },
    ],
  },
  {
    id: "mandarin-sky",
    nombre: "Odyssey Mandarin Sky",
    casa: "Armaf",
    descripcion:
      "¡Pura energía luminosa! Mandarina jugosa y azafrán sobre un adictivo fondo de caramelo. Úsalo para brillar y destacar con mucho magnetismo en los días soleados.",
    notas: [],
    piramide: {
      salida: [NOTAS.mandarina, NOTAS.naranja, NOTAS.azafran, NOTAS.salvia],
      corazon: [NOTAS.caramelo, NOTAS.habaTonka, NOTAS.tagete],
      base: [NOTAS.ambroxan, NOTAS.cedro, NOTAS.vetiver],
    },
    imagen: "/decants/mandarin-sky.png",
    clima: ["frio"],
    temporadas: ["invierno", "otono", "primavera"],
    stockMl: 55,
    decants: [
      { ml: 5, sprays: 90, precio: 15990 },
      { ml: 10, sprays: 160, precio: 24990 },
    ],
  },
  {
    id: "the-kingdom",
    nombre: "The Kingdom Man",
    casa: "Lattafa",
    descripcion:
      "¡Seducción al instante! Menta limpia y lavanda fresca sobre un fondo dulce de tabaco. Úsalo para conquistar con estilo en tus citas o salidas de fin de semana.",
    notas: [],
    piramide: {
      salida: [NOTAS.lavanda, NOTAS.menta, NOTAS.salvia],
      corazon: [NOTAS.vainilla, NOTAS.tabaco, NOTAS.azahar],
      base: [NOTAS.habaTonka, NOTAS.benjui, NOTAS.ladano],
    },
    imagen: "/decants/fakhar-gold.png",
    clima: ["frio", "calido"],
    temporadas: ["primavera", "verano", "otono"],
    stockMl: 90,
    decants: [
      { ml: 5, sprays: 90, precio: 9990 },
      { ml: 10, sprays: 160, precio: 15990 },
    ],
  },
  {
    id: "rasasi-hawas-ice",
    nombre: "Rasasi Hawas Ice",
    casa: "Armaf",
    descripcion:
      "¡Magnetismo moderno! Piña fresca y menta vibrante envueltas en un cardamomo cálido. Úsalo para dominar tu rutina diaria y dejar una huella segura en la oficina.",
    notas: [],
    piramide: {
      salida: [NOTAS.cardamomo, NOTAS.pimientaRosa, NOTAS.menta],
      corazon: [NOTAS.notasAcuaticas, NOTAS.salvia, NOTAS.pina],
      base: [NOTAS.amberwood, NOTAS.vainilla, NOTAS.cedro],
    },
    imagen: "/decants/armaf-odyssey-homme-white.png",
    clima: ["calido"],
    temporadas: ["primavera", "verano"],
    stockMl: 50,
    decants: [
      { ml: 5, sprays: 90, precio: 10990 },
      { ml: 10, sprays: 160, precio: 17990 },
    ],
  },
  {
    id: "rayhaan-aquatica",
    nombre: "Rayhaan Aquatica",
    casa: "Armaf",
    descripcion:
      "¡Oscuridad irresistible! Vainilla profunda y maderas ricas envueltas en un ámbar seductor. Úsalo para acaparar la atención en cenas románticas y eventos formales.",
    notas: [],
    piramide: {
      salida: [NOTAS.cardamomo, NOTAS.neroli, NOTAS.mandarina],
      corazon: [NOTAS.florNaranjo, NOTAS.rosa],
      base: [NOTAS.vainilla, NOTAS.maderas, NOTAS.sandalo, NOTAS.ambar],
    },
    imagen: "/decants/armaf-odyssey-homme.png",
    clima: ["frio"],
    temporadas: ["invierno", "otono"],
    stockMl: 45,
    decants: [
      { ml: 5, sprays: 90, precio: 12990 },
      { ml: 10, sprays: 160, precio: 19990 },
    ],
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
