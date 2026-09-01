"use client"

import { useEffect, useState } from "react"
import { Lock, Save, RefreshCw, Plus, Trash2, X, Edit, ChevronUp, ChevronDown } from "lucide-react"

type PerfumeAdmin = {
  id: string
  nombre: string
  casa: string
  descripcion: string
  imagen: string
  stock_ml: number
  orden: number
  decants: { ml: number; sprays: number; precio: number }[]
  piramide_salida: string[]
  piramide_corazon: string[]
  piramide_base: string[]
  temporadas: string[]
  clima: string[]
}

const VACIO: PerfumeAdmin = {
  id: "",
  nombre: "",
  casa: "",
  descripcion: "",
  imagen: "/placeholder.svg",
  stock_ml: 60,
  orden: 0,
  decants: [{ ml: 5, sprays: 90, precio: 10000 }],
  piramide_salida: [],
  piramide_corazon: [],
  piramide_base: [],
  temporadas: [],
  clima: [],
}

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [autenticado, setAutenticado] = useState(false)
  const [perfumes, setPerfumes] = useState<PerfumeAdmin[]>([])
  const [edits, setEdits] = useState<Record<string, number>>({})
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [tab, setTab] = useState<"stock" | "perfumes">("stock")
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState<PerfumeAdmin | null>(null)
  const [form, setForm] = useState<PerfumeAdmin>(VACIO)
  const [notaInput, setNotaInput] = useState("")
  const [notaNivel, setNotaNivel] = useState<"salida" | "corazon" | "base">("salida")

  async function login() {
    setError("")
    setCargando(true)
    try {
      const res = await fetch("/api/admin/stock", {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (res.status === 401) {
        setError("Contraseña incorrecta")
        setCargando(false)
        return
      }
      const data = await res.json()
      setPerfumes(data)
      const initial: Record<string, number> = {}
      for (const p of data) initial[p.id] = p.stock_actual
      setEdits(initial)
      setAutenticado(true)
    } catch {
      setError("Error de conexión")
    }
    setCargando(false)
  }

  async function cargarStock() {
    setCargando(true)
    try {
      const res = await fetch("/api/admin/stock", {
        headers: { Authorization: `Bearer ${password}` },
      })
      const data = await res.json()
      setPerfumes(data)
      const initial: Record<string, number> = {}
      for (const p of data) initial[p.id] = p.stock_actual
      setEdits(initial)
    } catch {}
    setCargando(false)
  }

  async function cargarPerfumes() {
    setCargando(true)
    try {
      const res = await fetch("/api/admin/perfumes", {
        headers: { Authorization: `Bearer ${password}` },
      })
      const data = await res.json()
      setPerfumes(data)
      const initial: Record<string, number> = {}
      for (const p of data) initial[p.id] = p.stock_ml
      setEdits(initial)
    } catch {}
    setCargando(false)
  }

  async function guardarStock() {
    setGuardando(true)
    setMensaje("")
    setError("")
    try {
      const items = Object.entries(edits).map(([id, stock_ml]) => ({ id, stock_ml }))
      const res = await fetch("/api/admin/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || "Error al guardar")
      else {
        setMensaje(`Stock actualizado: ${data.updated} perfumes`)
        await cargarStock()
      }
    } catch {
      setError("Error de conexión")
    }
    setGuardando(false)
  }

  function abrirNuevo() {
    setForm({ ...VACIO, orden: perfumes.length + 1 })
    setEditando(null)
    setFormAbierto(true)
  }

  function abrirEditar(p: PerfumeAdmin) {
    setForm({ ...p })
    setEditando(p)
    setFormAbierto(true)
  }

  async function guardarPerfume() {
    setGuardando(true)
    setMensaje("")
    setError("")
    try {
      const method = editando ? "PUT" : "POST"
      const res = await fetch("/api/admin/perfumes", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Error al guardar")
      } else {
        setMensaje(editando ? "Perfume actualizado" : "Perfume creado")
        setFormAbierto(false)
        await cargarPerfumes()
      }
    } catch {
      setError("Error de conexión")
    }
    setGuardando(false)
  }

  async function eliminarPerfume(id: string) {
    if (!confirm(`¿Eliminar "${id}"? Esta acción no se puede deshacer.`)) return
    setGuardando(true)
    setMensaje("")
    setError("")
    try {
      const res = await fetch("/api/admin/perfumes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || "Error al eliminar")
      else {
        setMensaje("Perfume eliminado")
        await cargarPerfumes()
      }
    } catch {
      setError("Error de conexión")
    }
    setGuardando(false)
  }

  async function guardarOrden() {
    const ids = perfumes.map((p) => p.id)
    const ordenes = ids.map((id, i) => ({ id, orden: i + 1 }))
    setGuardando(true)
    setMensaje("")
    setError("")
    try {
      const res = await fetch("/api/admin/perfumes/orden", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ ordenes }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || "Error al guardar el orden")
      else {
        setMensaje("Orden guardado correctamente")
        setPerfumes((prev) => prev.map((p, i) => ({ ...p, orden: i + 1 })))
      }
    } catch {
      setError("Error de conexión")
    }
    setGuardando(false)
  }

  function subir(idx: number) {
    if (idx <= 0) return
    setPerfumes((prev) => {
      const copia = [...prev]
      const [movido] = copia.splice(idx, 1)
      copia.splice(idx - 1, 0, movido)
      return copia
    })
  }

  function bajar(idx: number) {
    if (idx >= perfumes.length - 1) return
    setPerfumes((prev) => {
      const copia = [...prev]
      const [movido] = copia.splice(idx, 1)
      copia.splice(idx + 1, 0, movido)
      return copia
    })
  }

  function agregarNota() {
    if (!notaInput.trim()) return
    const key = `piramide_${notaNivel}` as keyof PerfumeAdmin
    const current = form[key] as string[]
    if (current.includes(notaInput.trim())) return
    setForm({ ...form, [key]: [...current, notaInput.trim()] })
    setNotaInput("")
  }

  function quitarNota(nivel: "salida" | "corazon" | "base", nota: string) {
    const key = `piramide_${nivel}` as keyof PerfumeAdmin
    const current = form[key] as string[]
    setForm({ ...form, [key]: current.filter((n) => n !== nota) })
  }

  function agregarDecant() {
    setForm({
      ...form,
      decants: [...form.decants, { ml: 5, sprays: 90, precio: 10000 }],
    })
  }

  function actualizarDecant(idx: number, campo: string, valor: number) {
    const nuevos = [...form.decants]
    ;(nuevos[idx] as any)[campo] = valor
    setForm({ ...form, decants: nuevos })
  }

  function quitarDecant(idx: number) {
    setForm({ ...form, decants: form.decants.filter((_, i) => i !== idx) })
  }

  function toggleArray(campo: "temporadas" | "clima", valor: string) {
    const current = form[campo] as string[]
    setForm({
      ...form,
      [campo]: current.includes(valor)
        ? current.filter((v) => v !== valor)
        : [...current, valor],
    })
  }

  // LOGIN
  if (!autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <Lock className="size-10 text-primary" />
            <h1 className="font-serif text-2xl text-foreground">Panel Admin</h1>
            <p className="text-sm text-muted-foreground">Ingresa la contraseña para acceder</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); login() }} className="mt-6 flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              autoFocus
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={cargando || !password}
              className="rounded-xl bg-gold-gradient px-4 py-3 text-sm font-bold text-primary-foreground shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {cargando ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // PANEL PRINCIPAL
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-foreground">Panel Admin</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => (tab === "stock" ? cargarStock() : cargarPerfumes())}
              disabled={cargando}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-card/80 disabled:opacity-50"
            >
              <RefreshCw className={`size-4 ${cargando ? "animate-spin" : ""}`} />
              Recargar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab("stock")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === "stock"
                ? "bg-gold-gradient text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Stock
          </button>
          <button
            type="button"
            onClick={() => { setTab("perfumes"); cargarPerfumes() }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              tab === "perfumes"
                ? "bg-gold-gradient text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Perfumes
          </button>
        </div>

        {/* Mensajes */}
        {mensaje && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {mensaje}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* TAB: STOCK */}
        {tab === "stock" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={guardarStock}
                disabled={guardando}
                className="flex items-center gap-2 rounded-xl bg-gold-gradient px-4 py-2 text-sm font-bold text-primary-foreground shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:opacity-90 disabled:opacity-50"
              >
                <Save className="size-4" />
                {guardando ? "Guardando..." : "Guardar todo"}
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-card/80">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Perfume</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Casa</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground w-32">Stock (ml)</th>
                  </tr>
                </thead>
                <tbody>
                  {perfumes.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-card/50">
                      <td className="px-4 py-3 text-foreground">{p.nombre}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.casa}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={edits[p.id] ?? 0}
                          onChange={(e) => setEdits({ ...edits, [p.id]: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-center text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* TAB: PERFUMES */}
        {tab === "perfumes" && (
          <>
            <div className="flex flex-wrap justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ChevronUp className="size-4" />
                <ChevronDown className="size-4" />
                Usa las flechas para ordenar los perfumes. El primero aparece primero en la web.
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={abrirNuevo}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground hover:bg-card/80"
                >
                  <Plus className="size-4" />
                  Nuevo perfume
                </button>
                <button
                  type="button"
                  onClick={guardarOrden}
                  disabled={guardando}
                  className="flex items-center gap-2 rounded-xl bg-gold-gradient px-4 py-2 text-sm font-bold text-primary-foreground shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="size-4" />
                  {guardando ? "Guardando..." : "Guardar orden"}
                </button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {perfumes.map((p, idx) => (
                <div key={p.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] tracking-widest text-muted-foreground uppercase">#{idx + 1} · {p.casa}</p>
                      <h3 className="font-serif text-lg text-foreground">{p.nombre}</h3>
                      <p className="text-xs text-muted-foreground">Stock: {p.stock_ml} ml</p>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => subir(idx)}
                          disabled={idx === 0}
                          aria-label="Subir"
                          className="rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground disabled:opacity-30"
                        >
                          <ChevronUp className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => bajar(idx)}
                          disabled={idx === perfumes.length - 1}
                          aria-label="Bajar"
                          className="rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground disabled:opacity-30"
                        >
                          <ChevronDown className="size-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => abrirEditar(p)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarPerfume(p.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FORMULARIO MODAL */}
        {formAbierto && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-10 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#141414] p-6 mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl text-foreground">
                  {editando ? "Editar perfume" : "Nuevo perfume"}
                </h2>
                <button
                  type="button"
                  onClick={() => setFormAbierto(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-white/10"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Básicos */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">ID (slug)</label>
                    <input
                      value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      placeholder="mi-perfume"
                      disabled={!!editando}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Nombre</label>
                    <input
                      value={form.nombre}
                      onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      placeholder="Mi Perfume"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Casa</label>
                    <input
                      value={form.casa}
                      onChange={(e) => setForm({ ...form, casa: e.target.value })}
                      placeholder="Lattafa"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Imagen (ruta)</label>
                    <input
                      value={form.imagen}
                      onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                      placeholder="/decants/mi-perfume.png"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Descripción</label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    placeholder="Descripción del perfume..."
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Stock (ml)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.stock_ml}
                    onChange={(e) => setForm({ ...form, stock_ml: parseInt(e.target.value) || 0 })}
                    className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Decants */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-muted-foreground">Decants</label>
                    <button type="button" onClick={agregarDecant} className="text-xs text-primary hover:underline">
                      + Agregar
                    </button>
                  </div>
                  {form.decants.map((d, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-center">
                      <input
                        type="number"
                        value={d.ml}
                        onChange={(e) => actualizarDecant(i, "ml", parseInt(e.target.value) || 0)}
                        className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                        placeholder="ml"
                      />
                      <span className="text-xs text-muted-foreground">ml</span>
                      <input
                        type="number"
                        value={d.sprays}
                        onChange={(e) => actualizarDecant(i, "sprays", parseInt(e.target.value) || 0)}
                        className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                        placeholder="sprays"
                      />
                      <span className="text-xs text-muted-foreground">sprays</span>
                      <input
                        type="number"
                        value={d.precio}
                        onChange={(e) => actualizarDecant(i, "precio", parseInt(e.target.value) || 0)}
                        className="w-28 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground"
                        placeholder="precio"
                      />
                      <button type="button" onClick={() => quitarDecant(i)} className="text-red-400 hover:text-red-300">
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pirámide de notas */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Pirámide de notas</label>
                  <div className="flex gap-2 mb-2">
                    <select
                      value={notaNivel}
                      onChange={(e) => setNotaNivel(e.target.value as any)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                    >
                      <option value="salida">Salida</option>
                      <option value="corazon">Corazón</option>
                      <option value="base">Base</option>
                    </select>
                    <input
                      value={notaInput}
                      onChange={(e) => setNotaInput(e.target.value)}
                      placeholder="Nombre de la nota"
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), agregarNota())}
                    />
                    <button type="button" onClick={agregarNota} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-foreground hover:bg-white/20">
                      + Agregar
                    </button>
                  </div>
                  {(["salida", "corazon", "base"] as const).map((nivel) => {
                    const key = `piramide_${nivel}` as keyof PerfumeAdmin
                    const notas = form[key] as string[]
                    if (notas.length === 0) return null
                    return (
                      <div key={nivel} className="mb-2">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">{nivel === "salida" ? "Salida" : nivel === "corazon" ? "Corazón" : "Base"}</p>
                        <div className="flex flex-wrap gap-1">
                          {notas.map((n) => (
                            <span key={n} className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs text-foreground">
                              {n}
                              <button type="button" onClick={() => quitarNota(nivel, n)} className="text-muted-foreground hover:text-red-400">
                                <X className="size-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Temporadas y Clima */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Temporadas</label>
                    <div className="flex flex-wrap gap-2">
                      {["invierno", "verano", "primavera", "otono"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleArray("temporadas", t)}
                          className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                            form.temporadas.includes(t)
                              ? "border-primary bg-gold-gradient text-primary-foreground"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">Clima</label>
                    <div className="flex flex-wrap gap-2">
                      {["frio", "calido"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleArray("clima", c)}
                          className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                            form.clima.includes(c)
                              ? "border-primary bg-gold-gradient text-primary-foreground"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {c === "frio" ? "Frío" : "Cálido"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFormAbierto(false)}
                  className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarPerfume}
                  disabled={guardando || !form.id || !form.nombre}
                  className="rounded-xl bg-gold-gradient px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:opacity-90 disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : editando ? "Actualizar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Los cambios se guardan al instante en Supabase.
        </p>
      </div>
    </div>
  )
}