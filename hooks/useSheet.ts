"use client"

import { useState, useEffect, useCallback } from "react"
import { useGoogleAuth } from "./useGoogleAuth"
import { procesarDataSheet } from "@/helpers/auxiliares";
import { DataSheet } from "@/types/google";


async function fetchWithAuth(url: string, options: RequestInit, refreshAccessToken: () => Promise<string>) {
  
  let accessToken = localStorage.getItem("googleAccessToken");
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  if (response.status === 401) {
    // Intentar refrescar el token
    try {
      accessToken = await refreshAccessToken();
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (e) {
      // Si falla el refresh, forzar logout o pedir re-login
      window.alert("Sesión expirada. Por favor, cerrá y volvé a iniciar sesión.")
      throw new Error("Sesión expirada. Por favor, vuelve a iniciar sesión.");
    }
  }
  
  return response;
}

export const useSheet = (section: string) => {
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [equiposData, setEquiposData] = useState<DataSheet[]>([])
  
  const { refreshAccessToken } = useGoogleAuth()

  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID
  
  const fetchData = useCallback(async () => {
    const accessToken = localStorage.getItem("googleAccessToken")
    if (!accessToken || !sheetId) return

    setLoading(true)
    const sheetName = section.charAt(0).toUpperCase() + section.slice(1)
    
    try {
      const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`, {}, refreshAccessToken)
      const result = await res.json()

      if (section != "equipos") {
        try {
          const equiposRes = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Equipos`, {}, refreshAccessToken)
          const equiposJson = await equiposRes.json()
          const equiposData = procesarDataSheet(equiposJson.values).data
          setEquiposData(equiposData)
        } catch (error) {
          console.error("Error fetching equipos data:", error)
        }
      }

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

      const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Registro`, {}, refreshAccessToken)
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
      }, refreshAccessToken)
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
        }, refreshAccessToken)
        await registerAction("crear", null, item)
      } else {
        const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`, {}, refreshAccessToken)
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
        }, refreshAccessToken)
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
      const sheetRes = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties`, {}, refreshAccessToken)
      const sheetData = await sheetRes.json()
      const sheet = sheetData.sheets.find((s: any) => s.properties.title === sheetName)
      if (!sheet) throw new Error("No se encontró la hoja")

      const res = await fetchWithAuth(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`, {}, refreshAccessToken)
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
      }, refreshAccessToken)
      await registerAction("eliminar", originalItem, null)
      await fetchData()
    } catch (error) {
      console.error("Error deleting data:", error)
      alert("Error al eliminar los datos: " + (error instanceof Error ? error.message : String(error)))
    }
  }

  return { data, headers, loading, equiposData, saveItem, deleteItem, fetchData }
}
