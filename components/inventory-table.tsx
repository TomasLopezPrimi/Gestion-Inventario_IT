"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useSheet } from "@/hooks/useSheet"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InventoryDialog } from "@/components/inventory-dialog"
import { Pencil, Trash2, Plus, Columns, Filter, CalendarDays } from "lucide-react"

interface InventoryTableProps {
  section: string
}

export function InventoryTable({ section }: InventoryTableProps) {
  const searchParams = useSearchParams()
  const { data: allData, headers, loading, equiposData, saveItem, deleteItem } = useSheet(section)

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: "create" | "edit" | "delete"
    item?: any
  }>({ isOpen: false, mode: "create" })

  // Estado para las columnas visibles
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({})
  // Estado para los filtros por columna
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string[] }>({})
  // Estado para el filtro de fecha
  const [dateFilter, setDateFilter] = useState<{ year: string | null; month: string | null }>({ year: null, month: null });
  // Estado para la búsqueda dentro del dropdown de filtros
  const [filterSearch, setFilterSearch] = useState("")

  // --- PERSISTENCIA EN LOCALSTORAGE ---

  useEffect(() => {
    // Cargar columnas visibles
    if (headers.length > 0) {
      const savedColumnsRaw = localStorage.getItem(`visibleColumns_${section}`);
      const defaultColumns = headers.reduce((acc, header) => {
        acc[header] = true;
        return acc;
      }, {} as { [key: string]: boolean });

      if (savedColumnsRaw) {
        try {
          const savedColumns = JSON.parse(savedColumnsRaw);
          Object.keys(defaultColumns).forEach(header => {
            if (typeof savedColumns[header] === 'boolean') {
              defaultColumns[header] = savedColumns[header];
            }
          });
        } catch (e) {
            console.error("Error al procesar las columnas visibles desde localStorage", e);
        }
      }
      setVisibleColumns(defaultColumns);
    }
  }, [headers, section]);

  useEffect(() => {
    // Cargar filtros de columna
    const savedFiltersRaw = localStorage.getItem(`columnFilters_${section}`)
    if (savedFiltersRaw) {
      try {
        setColumnFilters(JSON.parse(savedFiltersRaw))
      } catch (e) {
        console.error("Error al procesar los filtros de columna desde localStorage", e);
      }
    }
    // Cargar filtro de fecha
    const savedDateFilterRaw = localStorage.getItem(`dateFilter_${section}`);
    if (savedDateFilterRaw) {
      try {
        setDateFilter(JSON.parse(savedDateFilterRaw));
      } catch (e) {
        console.error("Error al procesar el filtro de fecha desde localStorage", e);
      }
    }
  }, [section])

  useEffect(() => {
    if (Object.keys(visibleColumns).length > 0) {
      localStorage.setItem(`visibleColumns_${section}`, JSON.stringify(visibleColumns))
    }
  }, [visibleColumns, section])

  useEffect(() => {
    localStorage.setItem(`columnFilters_${section}`, JSON.stringify(columnFilters))
  }, [columnFilters, section])

  useEffect(() => {
    localStorage.setItem(`dateFilter_${section}`, JSON.stringify(dateFilter));
  }, [dateFilter, section]);


  // --- LÓGICA DE FILTRADO Y DATOS ---

  const { availableYears } = useMemo(() => {
    if (!headers.includes('fecha_in')) {
        return { availableYears: [] };
    }
    const years = [...new Set(allData.map(item => String(item.fecha_in).split('-')[0]))].filter(Boolean).sort((a, b) => b.localeCompare(a));
    return { availableYears: years };
  }, [allData, headers]);
  
  const data = useMemo(() => {
    let filtered = allData

    // 1. Filtro por búsqueda general
    const searchTermQ1 = searchParams.get("q1")?.toLowerCase() || ""
    const searchTermQ2 = searchParams.get("q2")?.toLowerCase() || ""
    if (searchTermQ1 && headers.length > 0) {
      filtered = filtered.filter(item =>
        headers.some(header => String(item[header] ?? "").toLowerCase().includes(searchTermQ1))
      )
    }
    if (searchTermQ2 && headers.length > 0) {
        filtered = filtered.filter(item =>
        headers.some(header => String(item[header] ?? "").toLowerCase().includes(searchTermQ2))
      )
    }

    // 2. Filtro por columnas específicas
    const activeFilters = Object.entries(columnFilters).filter(([, values]) => values.length > 0)
    if (activeFilters.length > 0) {
      filtered = filtered.filter(item => {
        return activeFilters.every(([header, values]) => {
          return values.includes(String(item[header]))
        })
      })
    }

    // 3. Filtro por fecha
    if (dateFilter.year) {
      filtered = filtered.filter(item => item.fecha_in && String(item.fecha_in).startsWith(dateFilter.year!));
    }
    if (dateFilter.month) {
      filtered = filtered.filter(item => item.fecha_in && String(item.fecha_in).split('-')[1] === dateFilter.month);
    }

    return filtered
  }, [allData, searchParams, headers, columnFilters, dateFilter])

  const displayedHeaders = headers.filter(header => visibleColumns[header])

  // --- MANEJADORES DE EVENTOS ---

  const handleSave = async (item: any) => {
    await saveItem(item, dialogState.mode as "create" | "edit")
    setDialogState({ isOpen: false, mode: "create" })
  }

  const handleDelete = async () => {
    if (dialogState.item) {
      await deleteItem(dialogState.item)
    }
    setDialogState({ isOpen: false, mode: "create" })
  }

  const handleSelectAllColumns = (select: boolean) => {
    const allSelected = headers.reduce((acc, header) => ({ ...acc, [header]: select }), {})
    setVisibleColumns(allSelected)
  }
  
  const getUniqueColumnValues = (header: string) => {
    return [...new Set(allData.map(item => String(item[header] ?? '')))].filter(Boolean).sort()
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-lg w-full mb-8 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white capitalize">{section}</h2>
        <div className="flex items-center gap-2">
          {/* Botón de filtro de fecha */}
          {headers.includes("fecha_in") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Fecha
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 text-white border-slate-700">
                <DropdownMenuLabel>Filtrar por Fecha</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Año: {dateFilter.year || "Todos"}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-slate-800 border-slate-700">
                    <DropdownMenuRadioGroup value={dateFilter.year ?? ""} onValueChange={(value) => setDateFilter(prev => ({ ...prev, year: value }))}>
                      {availableYears.map(year => <DropdownMenuRadioItem key={year} value={year}>{year}</DropdownMenuRadioItem>)}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Mes: {dateFilter.month || "Todos"}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-slate-800 border-slate-700">
                    <DropdownMenuRadioGroup value={dateFilter.month ?? ""} onValueChange={(value) => setDateFilter(prev => ({ ...prev, month: value }))}>
                      {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(month => <DropdownMenuRadioItem key={month} value={month}>{month}</DropdownMenuRadioItem>)}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onSelect={() => setDateFilter({ year: null, month: null })} className="text-red-400 focus:bg-red-900/50">
                  Limpiar filtro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Botón para seleccionar columnas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                <Columns className="h-4 w-4 mr-2" />
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 text-white border-slate-700">
              <DropdownMenuLabel>Alternar columnas</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
               <DropdownMenuCheckboxItem
                  className="capitalize text-teal-400 focus:bg-slate-700 focus:text-teal-300"
                  checked={headers.every(h => visibleColumns[h])}
                  onCheckedChange={(value) => handleSelectAllColumns(!!value)}
                >
                  Seleccionar Todas
                </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              {headers.map(header => (
                <DropdownMenuCheckboxItem
                  key={header}
                  className="capitalize focus:bg-slate-700"
                  checked={visibleColumns[header] ?? false}
                  onCheckedChange={value =>
                    setVisibleColumns(prev => ({ ...prev, [header]: !!value }))
                  }
                >
                  {header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botón para crear nuevo item */}
          <Button onClick={() => setDialogState({ isOpen: true, mode: "create" })} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Nuevo
          </Button>
        </div>
      </div>

      <div className="min-w-full h-full overflow-x-scroll" style={{ position: 'relative', height: 'calc(100vh - 180px)' }}>
        {loading ? (
          <div className="text-center text-slate-400">Cargando datos...</div>
        ) : (
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 z-10 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 font-bold text-sm px-6 py-4 border-b-4 border-slate-700 first:rounded-tl-lg last:rounded-tr-lg shadow-sm uppercase tracking-wide text-center w-[120px] max-w-[120px]">Acciones</TableHead>
                {displayedHeaders.map(header => {
                    const uniqueValues = getUniqueColumnValues(header);
                    const selectedValues = columnFilters[header] || [];
                    const isFilterActive = selectedValues.length > 0;
                    const filteredUniqueValues = uniqueValues.filter(v => v.toLowerCase().includes(filterSearch.toLowerCase()));

                    return (
                        <TableHead
                            key={header}
                            // Puedes cambiar el ancho de las columnas aquí. Por ejemplo: w-[250px]
                            className="sticky top-0 z-10 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 font-bold text-sm px-6 py-4 border-b-4 border-slate-700 shadow-sm uppercase tracking-wide text-center w-[200px] max-w-[200px]"
                        >
                            <div className="flex items-center justify-center gap-1">
                                {header}
                                {uniqueValues.length > 0 && (
                                    <DropdownMenu onOpenChange={(open) => !open && setFilterSearch("")}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full ${isFilterActive ? 'text-teal-400' : 'text-slate-400'} hover:bg-slate-700`}>
                                                <Filter className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-slate-800 text-white border-slate-700 w-56">
                                            <div className="p-2">
                                                <input
                                                    type="text"
                                                    placeholder="Buscar valor..."
                                                    value={filterSearch}
                                                    onChange={(e) => setFilterSearch(e.target.value)}
                                                    className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                                />
                                            </div>
                                            <DropdownMenuSeparator className="bg-slate-700" />
                                            <div className="max-h-60 overflow-y-auto">
                                                <DropdownMenuCheckboxItem
                                                    className="capitalize text-teal-400 focus:bg-slate-700 focus:text-teal-300"
                                                    checked={selectedValues.length === uniqueValues.length}
                                                    onCheckedChange={(checked) => {
                                                        setColumnFilters(prev => ({...prev, [header]: checked ? uniqueValues : []}))
                                                    }}
                                                >
                                                    Seleccionar Todo
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuSeparator className="bg-slate-700" />
                                                {filteredUniqueValues.map(value => (
                                                    <DropdownMenuCheckboxItem
                                                        key={value}
                                                        className="capitalize focus:bg-slate-700"
                                                        checked={selectedValues.includes(value)}
                                                        onCheckedChange={(checked) => {
                                                            const newSelected = checked
                                                                ? [...selectedValues, value]
                                                                : selectedValues.filter(v => v !== value);
                                                            setColumnFilters(prev => ({...prev, [header]: newSelected}));
                                                        }}
                                                    >
                                                        {value}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </TableHead>
                    )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(item => (
                <TableRow key={item.id} className="border-slate-600 hover:bg-slate-700 text-slate-200">
                  <TableCell className="w-[120px] max-w-[120px]">
                    <div className="flex gap-2 justify-center">
                      <Button variant="ghost" size="icon" onClick={() => setDialogState({ isOpen: true, mode: "edit", item })} className="text-blue-400 hover:text-blue-300 hover:bg-slate-700">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDialogState({ isOpen: true, mode: "delete", item })} className="text-red-400 hover:text-red-300 hover:bg-slate-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  {displayedHeaders.map(header => (
                    <TableCell
                      key={header}
                      // El ancho debe coincidir con el del encabezado.
                      className="text-center w-[200px] max-w-[200px]"
                    >
                      <div className="truncate" title={String(item[header] ?? '')}>
                        {item[header]}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
