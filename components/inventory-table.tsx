"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InventoryDialog } from "@/components/inventory-dialog"
import { Pencil, Trash2, Plus } from "lucide-react"

interface InventoryTableProps {
  section: string
}

export function InventoryTable({ section }: InventoryTableProps) {
  const searchParams = useSearchParams()
  const [allData, setAllData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "delete"
    item?: any
  }>({ isOpen: false, mode: "create" })
  const [loading, setLoading] = useState(false)
  const [equiposData, setEquiposData] = useState<any[]>([])

  const accessToken = typeof window !== "undefined" ? localStorage.getItem("googleAccessToken") : null
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID

  const registerAction = async (action: "crear" | "modificar" | "eliminar", originalItem?: any, modifiedItem?: any) => {
    if (!accessToken || !sheetId) return

    try {
      // Obtener el usuario actual
      const userData = localStorage.getItem("googleUser")
      if (!userData) throw new Error("No hay usuario autenticado")
      const user = JSON.parse(userData)

      // Obtener el último ID de registro
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Registro`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      const lastId = data.values ? data.values.length : 0

      // Crear el nuevo registro
      const now = new Date()
      const argentinaTime = new Date(now.getTime() - (3 * 60 * 60 * 1000)) // GMT-3
      const formattedDate = argentinaTime.toISOString().replace('T', ' ').slice(0, 19)

      const newRecord = [
        lastId + 1, // id_registro
        user.name, // usuario
        action, // accion
        originalItem ? JSON.stringify(originalItem) : "", // elemento original
        modifiedItem ? JSON.stringify(modifiedItem) : "", // elemento modificado
        formattedDate, // fecha
      ]

      // Agregar el registro a la hoja
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Registro:append?valueInputOption=USER_ENTERED`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ values: [newRecord] }),
      })
    } catch (error) {
      console.error("Error registrando acción:", error)
    }
  }

  const fetchData = async () => {
    if (!accessToken || !sheetId) return
    setLoading(true)
    const sheetName = section.charAt(0).toUpperCase() + section.slice(1)
    const range = `${sheetName}`
    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      if (data.values?.length > 1) {
        const normalizedHeaders = data.values[0].map((h: string) => h.toLowerCase())
        setHeaders(normalizedHeaders)
        const items = data.values.slice(1).map((row: string[], idx: number) => {
          const obj: any = {}
          normalizedHeaders.forEach((header: string, i: number) => {
            obj[header] = row[i] ?? ""
          })
          obj.id = obj.id || idx + 1
          return obj
        })
        setAllData(items)
      } else {
        setAllData([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setAllData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [section])

  useEffect(() => {
    if (section.toLowerCase().includes("gestion")) {
      // Buscar datos de la hoja Equipos
      const fetchEquipos = async () => {
        if (!accessToken || !sheetId) return
        const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Equipos`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data = await res.json()
        if (data.values && data.values.length > 1) {
          const headersEq = data.values[0].map((h: string) => h.toLowerCase())
          const items = data.values.slice(1).map((row: string[], idx: number) => {
            const obj: any = {}
            headersEq.forEach((header: string, i: number) => {
              obj[header] = row[i] ?? ""
            })
            obj.id = obj.id || idx + 1
            return obj
          })
          setEquiposData(items)
        }
      }
      fetchEquipos()
    }
  }, [section, accessToken, sheetId])

  const searchTermQ1 = searchParams.get("q1")?.toLowerCase() || "";
  const searchTermQ2 = searchParams.get("q2")?.toLowerCase() || "";

  let datosFiltrados = allData;

  if (searchTermQ1 && headers.length > 0) {
    datosFiltrados = datosFiltrados.filter(item =>
      headers.some(header => String(item[header] ?? "").toLowerCase().includes(searchTermQ1))
    );
  }

  if (searchTermQ2 && headers.length > 0) {
    datosFiltrados = datosFiltrados.filter(item =>
      headers.some(header => String(item[header] ?? "").toLowerCase().includes(searchTermQ2))
    );
  }

  // El resultado final es la variable que ha pasado por todos los filtros.
  const data = datosFiltrados;


  const handleSave = async (item: any) => {
    if (!accessToken || !sheetId) return
    const sheetName = section.charAt(0).toUpperCase() + section.slice(1)
    try {
      if (dialogState.mode === "create") {
        const values = headers.map((header) => {
          if (/^id(_|$)/i.test(header)) {
            return item[header] !== undefined && item[header] !== null && item[header] !== "" ? Number(item[header]) : ""
          }
          return item[header] ?? ""
        })
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ values: [values] }),
        })
        await registerAction("crear", null, item)
      } else {
        const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const sheetData = await res.json()
        if (!sheetData.values) throw new Error("No se pudieron obtener los datos de la hoja")
        const idColIdx = sheetData.values[0].findIndex((h: string) => /^id(_|$)/i.test(h))
        if (idColIdx === -1) throw new Error("No se encontró la columna ID")
        const rowIndex = sheetData.values.findIndex((row: string[], idx: number) => idx > 0 && Number(row[idColIdx]) === Number(item[headers[idColIdx]]))
        if (rowIndex === -1) throw new Error("No se encontró la fila a actualizar")
        
        // Obtener el elemento original antes de modificarlo
        const originalItem = { ...sheetData.values[rowIndex].reduce((acc: any, val: string, idx: number) => {
          acc[headers[idx]] = val
          return acc
        }, {}) }

        const values = headers.map((header) => {
          if (/^id(_|$)/i.test(header)) {
            return item[header] !== undefined && item[header] !== null && item[header] !== "" ? Number(item[header]) : ""
          }
          return item[header] ?? ""
        })
        const range = `${sheetName}!A${rowIndex + 1}:Z${rowIndex + 1}`
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ values: [values] }),
        })
        await registerAction("modificar", originalItem, item)
        // Actualizar localmente
        setAllData(prev => prev.map(row => row.id === item.id ? { ...row, ...item } : row))
      }
      await fetchData()
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Error al guardar los datos: " + (error instanceof Error ? error.message : String(error)))
    }
    setDialogState({ isOpen: false, mode: "create" })
  }

  const handleDelete = async () => {
    if (!accessToken || !sheetId || !dialogState.item) return
    const sheetName = section.charAt(0).toUpperCase() + section.slice(1)
    try {
      // Obtener el ID de la hoja
      const sheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const sheetData = await sheetRes.json()
      const sheet = sheetData.sheets.find((s: any) => s.properties.title === sheetName)
      if (!sheet) throw new Error("No se encontró la hoja")
      // Obtener datos actuales para encontrar la fila correcta
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      if (!data.values) throw new Error("No se pudieron obtener los datos de la hoja")
      // Buscar el índice de la columna de ID
      const idColIdx = data.values[0].findIndex((h: string) => /^id(_|$)/i.test(h))
      if (idColIdx === -1) throw new Error("No se encontró la columna ID")
      // Buscar la fila por valor numérico
      const rowIndex = data.values.findIndex((row: string[], idx: number) => idx > 0 && Number(row[idColIdx]) === Number(dialogState.item[headers[idColIdx]]))
      if (rowIndex === -1) throw new Error("No se encontró la fila a eliminar")

      // Obtener el elemento original antes de eliminarlo
      const originalItem = { ...data.values[rowIndex].reduce((acc: any, val: string, idx: number) => {
        acc[headers[idx]] = val
        return acc
      }, {}) }

      // Eliminar la fila
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          requests: [{
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          }],
        }),
      })
      await registerAction("eliminar", originalItem, null)
      await fetchData()
    } catch (error) {
      console.error("Error deleting data:", error)
      alert("Error al eliminar los datos: " + (error instanceof Error ? error.message : String(error)))
    }
    setDialogState({ isOpen: false, mode: "create" })
  }

  return (
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg w-full mb-8 h-full">

        {/* Head de la tabla */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white capitalize">{section}</h2>
          <Button onClick={() => setDialogState({ isOpen: true, mode: "create" })} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Nuevo
          </Button>
        </div>

        {/* Contenido de la tabla */}
        <div 
          className="min-w-full h-full overflow-x-scroll" 
          //overflow-x-scroll table-scroll-force" 
          style={{ position: 'relative', height: 'calc(100vh - 180px)' }}
        >
          {/* <div 
            // className="absolute inset-0 overflow-x-scroll overflow-y-scroll table-scroll-force"
            // style={{ width: '100%', height: '100%' }}
          > */}
            {loading ? (
              <div className="text-center text-slate-400">Cargando datos...</div>
            ) : (
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 font-bold text-sm px-6 py-4 border-b-4 border-slate-700 first:rounded-tl-lg last:rounded-tr-lg shadow-sm uppercase tracking-wide text-center">Acciones</TableHead>
                    {headers.map((header) => (
                      <TableHead
                        key={header}
                        className="sticky top-0 z-10 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 font-bold text-sm px-6 py-4 border-b-4 border-slate-700 first:rounded-tl-lg last:rounded-tr-lg shadow-sm uppercase tracking-wide text-center"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id} className="border-slate-600 hover:bg-slate-700 text-slate-200">
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDialogState({ isOpen: true, mode: "edit", item })}
                            className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDialogState({ isOpen: true, mode: "delete", item })}
                            className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      {headers.map((header) => (
                        <TableCell key={header} className="text-center">{item[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          {/* </div> */}
        </div>

        <InventoryDialog
          isOpen={dialogState.isOpen}
          onClose={() => setDialogState({ isOpen: false, mode: "create" })}
          mode={dialogState.mode}
          item={dialogState.item}
          headers={headers}
          onSave={handleSave}
          onDelete={handleDelete}
          data={data}
          equiposData={equiposData}
          section={section}
        />
      </div>
  )
}
