import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { getNextId, getToday } from "@/helpers/auxiliares"

interface InventoryDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit" | "delete"
  item?: any
  headers: string[]
  onSave: (item: any) => void
  onDelete?: () => void
  data?: any[] // datos actuales para calcular el nuevo ID
  equiposData?: any[] // datos de equipos para autocompletar marca/modelo
  section?: string // para saber si es gestion
}

const MOVIMIENTO_OPCIONES = ["Envío", "Retiro", "Cambio", "Mensajeria"]

export function InventoryDialog({
  isOpen,
  onClose,
  mode,
  item,
  headers,
  onSave,
  onDelete,
  data = [],
  equiposData = [],
  section = ""
}: InventoryDialogProps) {
  const [formData, setFormData] = useState<any>({})
  const [nroSerieError, setNroSerieError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      const initialData: any = {}
      headers.forEach(header => {
        if (/^id(_|$)/i.test(header)) {
          initialData[header] = getNextId(headers, data)
        } else if (header.toLowerCase().includes("fecha_in")) {
          initialData[header] = getToday()
        } else {
          initialData[header] = ""
        }
      })
      setFormData(initialData)
    }
    setNroSerieError("")
  }, [item, headers, data])

  // Autocompletar marca y modelo si se ingresa un nro_serie en gestiones
  useEffect(() => {
    if (
      section.toLowerCase().includes("gestion") &&
      formData["nro_serie"] &&
      equiposData.length > 0
    ) {
      const equipo = equiposData.find(eq => String(eq["nro_serie"]).toLowerCase() === String(formData["nro_serie"]).toLowerCase())
      if (equipo) {
        setFormData((prev: any) => ({
          ...prev,
          marca: equipo["marca"] || prev["marca"],
          modelo: equipo["modelo"] || prev["modelo"],
          tipo_de_dispositivo: equipo["tipo_de_dispositivo"] || prev["tipo_de_dispositivo"]
        }))
      }
    }
    // eslint-disable-next-line
  }, [formData["nro_serie"], equiposData, section])

  // Validación de nro_serie para gestiones
  useEffect(() => {
    if (
      // mode === "create" &&
      section.toLowerCase().includes("gestion") &&
      formData["nro_serie"] &&
      equiposData.length > 0
    ) {
      const existe = equiposData.some(eq => String(eq["nro_serie"]).toLowerCase() === String(formData["nro_serie"]).toLowerCase())
      if (!existe) {
        setNroSerieError("El número de serie ingresado no existe en la hoja de equipos. Por favor, verifica el dato.")
      } else {
        setNroSerieError("")
      }
    } else {
      setNroSerieError("")
    }
  }, [formData["nro_serie"], equiposData, section, mode])

  // Determinar si marca y modelo deben ser solo lectura
  const nroSerieValido =
    mode === "create" &&
    section.toLowerCase().includes("gestion") &&
    formData["nro_serie"] &&
    equiposData.length > 0 &&
    equiposData.some(eq => String(eq["nro_serie"]).toLowerCase() === String(formData["nro_serie"]).toLowerCase()) &&
    !nroSerieError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error("Error al guardar:", error)
    } finally {
      setLoading(false)
    }
  }

  const title = {
    create: "Crear Nuevo Item",
    edit: "Editar Item",
    delete: "Eliminar Item"
  }[mode]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col bg-slate-800 rounded-lg shadow-xl border border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-2">{title}</DialogTitle>
        </DialogHeader>

        {mode === "delete" ? (
          <>
            <div className="py-4 text-slate-200">
              <p>¿Estás seguro de que deseas eliminar este item?</p>
            </div>
            <div className="mt-6 flex flex-row gap-2 justify-end">
              <Button variant="outline" onClick={(e) => {
                e.preventDefault();
                onClose();
              }} className="bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600">
                Cancelar
              </Button>
              <Button variant="destructive" onClick={onDelete} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                Eliminar
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            <div className="space-y-5">
              {headers.map((header) => (
                <div key={header} className="grid gap-1">
                  <Label htmlFor={header} className="text-slate-300 font-medium mb-1 capitalize tracking-wide">
                    {header.replace(/_/g, ' ')}
                  </Label>
                  {header.toLowerCase() === "movimiento" ? (
                    <select
                      id={header}
                      value={formData[header] || ""}
                      onChange={e => setFormData({ ...formData, [header]: e.target.value })}
                      className="border border-slate-600 rounded-md px-3 py-2 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Seleccionar...</option>
                      {MOVIMIENTO_OPCIONES.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <>
                      <Input
                        id={header}
                        value={formData[header] || ""}
                        onChange={(e) => setFormData({ ...formData, [header]: e.target.value })}
                        type={header.toLowerCase().includes("fecha") ? "date" : "text"}
                        readOnly={
                          (mode === "create" && /^id(_|$)/i.test(header)) ||
                          (header.toLowerCase() === "marca" && nroSerieValido) ||
                          (header.toLowerCase() === "modelo" && nroSerieValido) ||
                          (header.toLowerCase() === "tipo_de_dispositivo" && nroSerieValido)
                        }
                        className="border border-slate-600 rounded-md px-3 py-2 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {header.toLowerCase() === "nro_serie" && nroSerieError && (
                        <span className="text-red-400 text-xs mt-1">{nroSerieError}</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-row gap-2 justify-end">
              <Button variant="outline" onClick={(e) => {
                e.preventDefault();
                onClose();
              }} className="bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600">
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6" disabled={!!nroSerieError || loading}>
                {loading ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 