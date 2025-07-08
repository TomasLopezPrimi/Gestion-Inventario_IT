"use client"

import { useState, useEffect, useCallback } from "react"

async function fetchWithAuth(url: string, options: RequestInit): Promise<Response> {
  const accessToken = localStorage.getItem("googleAccessToken");
  if (!accessToken) {
    throw new Error("No hay token de acceso disponible.");
  }

  const optionsWithAuth = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetch(url, optionsWithAuth);

  if (!response.ok) {
    if (response.status === 401) {
      // Usamos un alert simple para notificar al usuario.
      // En una app más compleja, podrías usar un modal o un sistema de notificaciones.
      alert("Tu sesión ha expirado. Por favor, cierra sesión y vuelve a ingresar para continuar.");
    }
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.error?.message || `Error ${response.status}`);
  }

  return response;
}

export const useSheet = (section: string) => {
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [equiposData, setEquiposData] = useState<any[]>([])
  
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID

  const fetchData = useCallback(async () => {
    const accessToken = localStorage.getItem("googleAccessToken")
    if (!accessToken || !sheetId) return

    setLoading(true)
    const sheetName = section.charAt(0).toUpperCase() + section.slice(1)
    
    try {
      const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`, {})
      const result = await res.json()

      if (result.values?.length > 1) {
        const normalizedHeaders = result.values[0].map((h: string) => h.toLowerCase())
        setHeaders(normalizedHeaders)
        const items = result.values.slice(1).map((row: string[], idx: number) => {
          const obj: any = {}
          normalizedHeaders.forEach((header: string, i: number) => {
            obj[header] = row[i] ?? ""
          })
          obj.id = obj.id || idx + 1
          return obj
        })
        setData(items)
      } else {
        setData([])
        setHeaders(result.values ? result.values[0].map((h:string) => h.toLowerCase()) : [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [section, sheetId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const registerAction = useCallback(async (action: "crear" | "modificar" | "eliminar", originalItem?: any, modifiedItem?: any) => {
    if (!sheetId) return

    try {
      const userData = localStorage.getItem("googleUser")
      if (!userData) throw new Error("No hay usuario autenticado")
      const user = JSON.parse(userData)

      const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Registro`, {})
      const data = await res.json()
      const lastId = data.values ? data.values.length : 0
      
      const now = new Date()
      const argentinaTime = new Date(now.getTime() - (3 * 60 * 60 * 1000))
      const formattedDate = argentinaTime.toISOString().replace('T', ' ').slice(0, 19)

      const newRecord = [
        lastId + 1, user.name, action,
        originalItem ? JSON.stringify(originalItem) : "",
        modifiedItem ? JSON.stringify(modifiedItem) : "",
        formattedDate,
      ]

      await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Registro:append?valueInputOption=USER_ENTERED`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: [newRecord] }),
      })
    } catch (error) {
      console.error("Error registrando acción:", error)
    }
  }, [sheetId])

  const saveItem = async (item: any, mode: "create" | "edit") => {
    if (!sheetId) return
    const sheetName = section.charAt(0).toUpperCase() + section.slice(1)
    
    try {
      if (mode === "create") {
        const values = headers.map(header => item[header] ?? "")
        await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values: [values] }),
        })
        await registerAction("crear", null, item)
      } else {
        const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`, {})
        const sheetData = await res.json()
        if (!sheetData.values) throw new Error("No se pudieron obtener los datos de la hoja")
        
        const idColHeader = headers.find(h => /^id(_|$)/i.test(h))
        if (!idColHeader) throw new Error("No se encontró la columna ID en los encabezados")
        const idColIdx = sheetData.values[0].findIndex((h: string) => h.toLowerCase() === idColHeader)
        if (idColIdx === -1) throw new Error("No se encontró la columna ID")

        const rowIndex = sheetData.values.findIndex((row: string[]) => Number(row[idColIdx]) === Number(item[idColHeader]))
        if (rowIndex === -1) throw new Error("No se encontró la fila a actualizar")

        const originalItem = headers.reduce((acc: any, header: string, idx: number) => {
          acc[header] = sheetData.values[rowIndex][idx]
          return acc
        }, {})

        const values = headers.map(header => item[header] ?? "")
        const range = `${sheetName}!A${rowIndex + 1}`
        await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values: [values] }),
        })
        await registerAction("modificar", originalItem, item)
      }
      await fetchData()
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Error al guardar los datos: " + (error instanceof Error ? error.message : String(error)))
    }
  }

  const deleteItem = async (item: any) => {
    if (!sheetId || !item) return
    const sheetName = section.charAt(0).toUpperCase() + section.slice(1)
    
    try {
      const sheetRes = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties`, {})
      const sheetData = await sheetRes.json()
      const sheet = sheetData.sheets.find((s: any) => s.properties.title === sheetName)
      if (!sheet) throw new Error("No se encontró la hoja")

      const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`, {})
      const data = await res.json()
      if (!data.values) throw new Error("No se pudieron obtener los datos de la hoja")
      
      const idColHeader = headers.find(h => /^id(_|$)/i.test(h))
      if (!idColHeader) throw new Error("No se encontró la columna ID en los encabezados")
      const idColIdx = data.values[0].findIndex((h: string) => h.toLowerCase() === idColHeader)
      if (idColIdx === -1) throw new Error("No se encontró la columna ID")

      const rowIndex = data.values.findIndex((row: string[]) => Number(row[idColIdx]) === Number(item[idColHeader]))
      if (rowIndex === -1) throw new Error("No se encontró la fila a eliminar")
      
      const originalItem = headers.reduce((acc: any, header: string, idx: number) => {
        acc[header] = data.values[rowIndex][idx]
        return acc
      }, {})

      await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
  }

  return { data, headers, loading, equiposData, saveItem, deleteItem, fetchData }
}
