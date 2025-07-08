"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar({ searchParamKey }: { searchParamKey: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const query = searchParams.get(searchParamKey)
    if (query) {
      setSearchTerm(query)
    } else {
      setSearchTerm("")
    }
  }, [searchParams])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. LEER los parámetros actuales de la URL y crear una copia modificable.
    const params = new URLSearchParams(searchParams)

    // 2. MODIFICAR la copia con el valor de ESTE buscador.
    const trimmedSearchTerm = searchTerm.trim()
    if (trimmedSearchTerm) {
      params.set(searchParamKey, trimmedSearchTerm)
    } else {
      // Si el input está vacío, elimina este parámetro específico de la URL.
      params.delete(searchParamKey)
    }

    // 3. CONSTRUIR Y ACTUALIZAR la URL.
    // params.toString() convierte los parámetros en "q1=valor1&q2=valor2".
    const queryString = params.toString()
    
    // Navegamos a la nueva URL. Si no hay parámetros, el queryString será
    // un string vacío, resultando en una URL limpia (ej. /equipos).
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
  }

  const placeholder = searchParamKey === "q1" ? "Primer valor de busqueda" : "Segundo valor de busqueda"

  return (
    <form onSubmit={handleSearch} className="relative w-64 md:w-96">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-teal-500 focus:ring-teal-500"
      />
    </form>
  )
}
