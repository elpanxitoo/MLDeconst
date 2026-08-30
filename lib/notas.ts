// Catálogo de ingredientes (notas olfativas) con su miniatura.
// Para agregar una nota nueva: guarda la imagen en /public/notas/<slug>.png
// y añade una entrada aquí. Luego úsala en la pirámide de lib/perfumes.ts.

export type Nota = {
  nombre: string
  imagen: string
}

export const NOTAS = {
  almizcle: { nombre: "almizcle", imagen: "/notas/almizcle.png" },
  ambar: { nombre: "ámbar", imagen: "/notas/ambar.png" },
  azafran: { nombre: "azafrán", imagen: "/notas/azafran.png" },
  bergamota: { nombre: "bergamota", imagen: "/notas/bergamota.png" },
  bourbon: { nombre: "bourbon", imagen: "/notas/bourbon.png" },
  cafe: { nombre: "café", imagen: "/notas/cafe.png" },
  canela: { nombre: "canela", imagen: "/notas/canela.png" },
  caramelo: { nombre: "caramelo", imagen: "/notas/caramelo.png" },
  cardamomo: { nombre: "cardamomo", imagen: "/notas/cardamomo.png" },
  cuero: { nombre: "cuero", imagen: "/notas/cuero.png" },
  datil: { nombre: "dátil", imagen: "/notas/datil.png" },
  incienso: { nombre: "incienso", imagen: "/notas/incienso.png" },
  lavanda: { nombre: "lavanda", imagen: "/notas/lavanda.png" },
  maderas: { nombre: "maderas", imagen: "/notas/maderas.png" },
  mandarina: { nombre: "mandarina", imagen: "/notas/mandarina.png" },
  manzana: { nombre: "manzana", imagen: "/notas/manzana.png" },
  naranja: { nombre: "naranja", imagen: "/notas/naranja.png" },
  neroli: { nombre: "neroli", imagen: "/notas/neroli.png" },
  oud: { nombre: "oud", imagen: "/notas/oud.png" },
  pachuli: { nombre: "pachulí", imagen: "/notas/pachuli.png" },
  pina: { nombre: "piña", imagen: "/notas/pina.png" },
  praline: { nombre: "praliné", imagen: "/notas/praline.png" },
  ron: { nombre: "ron", imagen: "/notas/ron.png" },
  rosa: { nombre: "rosa", imagen: "/notas/rosa.png" },
  sandalo: { nombre: "sandalo", imagen: "/notas/sandalo.png" },
  vainilla: { nombre: "vainilla", imagen: "/notas/vainilla.png" },
  // Notas agregadas para Vulcan Feu, The Kingdom, Asad Bourbon, Maahir Legacy, Khamrah Qahwa y Mandarin Sky.
  ambarGris: { nombre: "ámbar gris", imagen: "/notas/ambar-gris.png" },
  ambroxan: { nombre: "ambroxán", imagen: "/notas/ambroxan.png" },
  amberwood: { nombre: "amberwood", imagen: "/notas/amberwood.png" },
  notasAcuaticas: { nombre: "notas acuáticas", imagen: "/notas/notas-acuaticas.png" },
  notasAmaderadas: { nombre: "notas amaderadas", imagen: "/notas/notas-amaderadas.png" },
  maderaDeGaiac: { nombre: "madera de gaiac", imagen: "/notas/madera-de-gaiac.png" },
  azahar: { nombre: "azahar", imagen: "/notas/azahar.png" },
  bayaEnebro: { nombre: "baya de enebro", imagen: "/notas/baya-enebro.png" },
  benjui: { nombre: "benjuí", imagen: "/notas/benjui.png" },
  cachemira: { nombre: "cachemira", imagen: "/notas/cachemira.png" },
  cacao: { nombre: "cacao", imagen: "/notas/cacao.png" },
  cedro: { nombre: "cedro", imagen: "/notas/cedro.png" },
  ciruelaMirabel: { nombre: "ciruela mirabel", imagen: "/notas/ciruela-mirabel.png" },
  davana: { nombre: "davana", imagen: "/notas/davana.png" },
  floresBlancas: { nombre: "flores blancas", imagen: "/notas/flores-blancas.png" },
  florNaranjo: { nombre: "flor de azahar del naranjo", imagen: "/notas/flor-azahar-naranjo.png" },
  frutasConfitadas: { nombre: "frutas confitadas", imagen: "/notas/frutas-confitadas.png" },
  geranio: { nombre: "geranio", imagen: "/notas/geranio.png" },
  habaTonka: { nombre: "haba tonka", imagen: "/notas/haba-tonka.png" },
  jazmin: { nombre: "jazmín", imagen: "/notas/jazmin.png" },
  jengibre: { nombre: "jengibre", imagen: "/notas/jengibre.png" },
  ladano: { nombre: "ládano", imagen: "/notas/ladano.png" },
  lima: { nombre: "lima", imagen: "/notas/lima.png" },
  mango: { nombre: "mango", imagen: "/notas/mango.png" },
  menta: { nombre: "menta", imagen: "/notas/menta.png" },
  musgo: { nombre: "musgo", imagen: "/notas/musgo.png" },
  musgoRoble: { nombre: "musgo de roble", imagen: "/notas/musgo-roble.png" },
  nuezMoscada: { nombre: "nuez moscada", imagen: "/notas/nuez-moscada.png" },
  pimientaNegra: { nombre: "pimienta negra", imagen: "/notas/pimienta-negra.png" },
  pimientaRosa: { nombre: "pimienta rosa", imagen: "/notas/pimienta-rosa.png" },
  romero: { nombre: "romero", imagen: "/notas/romero.png" },
  ruibarbo: { nombre: "ruibarbo", imagen: "/notas/ruibarbo.png" },
  salvia: { nombre: "salvia", imagen: "/notas/salvia.png" },
  tabaco: { nombre: "tabaco", imagen: "/notas/tabaco.png" },
  tagete: { nombre: "cempasúchil", imagen: "/notas/tagete.png" },
  toronja: { nombre: "toronja", imagen: "/notas/toronja.png" },
  vainillaBourbon: { nombre: "vainilla bourbon", imagen: "/notas/vainilla.png" },
  vetiver: { nombre: "vetiver", imagen: "/notas/vetiver.png" },
  violeta: { nombre: "violeta", imagen: "/notas/violeta.png" },
  pitahaya: { nombre: "pitahaya", imagen: "/notas/pitahaya.png" },
  conac: { nombre: "coñac", imagen: "/notas/coñac.png" },
  tonka: { nombre: "tonka", imagen: "/notas/tonka.png" },
  toffee: { nombre: "toffee", imagen: "/notas/toffee.png" },
  gamuza: { nombre: "gamuza", imagen: "/notas/gamuza.png" },
  mahonial: { nombre: "mahonial", imagen: "/notas/mahonial.png" },
  akigalawood: { nombre: "akigalawood", imagen: "/notas/akigalawood.png" },
  ambrofix: { nombre: "ambrofix", imagen: "/notas/ambrofix.png" },
  abrotano: { nombre: "abrótano", imagen: "/notas/abrotano.png" },
  cipres: { nombre: "ciprés", imagen: "/notas/cipres.png" },

} satisfies Record<string, Nota>

// Pirámide olfativa: salida (lo primero que se siente), corazón y base (lo que queda).
export type Piramide = {
  salida: Nota[]
  corazon: Nota[]
  base: Nota[]
}

// Títulos que se muestran sobre cada fila de la tabla de notas.
export const NIVELES_PIRAMIDE: { clave: keyof Piramide; etiqueta: string }[] = [
  { clave: "salida", etiqueta: "Notas de salida" },
  { clave: "corazon", etiqueta: "Corazón" },
  { clave: "base", etiqueta: "Base" },
]

// Lista plana de nombres (se usa en el buscador del catálogo).
export function nombresDeNotas(piramide: Piramide): string[] {
  return [...piramide.salida, ...piramide.corazon, ...piramide.base].map((n) => n.nombre)
}
