"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings, ChevronDown, Users, Briefcase, Monitor } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface User {
  name: string
  email: string
}

interface InventoryDashboardProps {
  user: User | null
  onLogout: () => void
}

interface InventoryItem {
  id: number
  movimiento: string
  nroInventario: string
  nroSerie: string
  marca: string
  modelo: string
  tipoDispositivo: string
  origen: string
  fechaIn: string
}

const inventoryData: InventoryItem[] = [
  {
    id: 90001,
    movimiento: "Envío",
    nroInventario: "SNT0001",
    nroSerie: "R90X4BEF",
    marca: "Lenovo",
    modelo: "asdasdasdasdasdasd",
    tipoDispositivo: "Laptop",
    origen: "Andreani",
    fechaIn: "2024-03-19",
  },
  {
    id: 90002,
    movimiento: "Envío",
    nroInventario: "SNT0002",
    nroSerie: "R90X52ER",
    marca: "Lenovo",
    modelo: "Lenovo 81AX",
    tipoDispositivo: "Laptop",
    origen: "Tomas Lopez Primi",
    fechaIn: "2024-03-19",
  },
  {
    id: 90003,
    movimiento: "Retiro",
    nroInventario: "SNT0003",
    nroSerie: "MP1LNFY7",
    marca: "Lenovo",
    modelo: "Lenovo idea pad s340-15iwl (81n8)",
    tipoDispositivo: "Laptop",
    origen: "Jessica Lazart",
    fechaIn: "2023-03-19",
  },
  {
    id: 90004,
    movimiento: "Envío",
    nroInventario: "SNT0004",
    nroSerie: "R90Q6TCK",
    marca: "Lenovo",
    modelo: "Lenovo V330-15IKB (81AX)",
    tipoDispositivo: "Laptop",
    origen: "Estrella Portocarrero",
    fechaIn: "2024-03-19",
  },
  {
    id: 90005,
    movimiento: "Envío",
    nroInventario: "SNT0005",
    nroSerie: "M91LWQ0A",
    marca: "Lenovo",
    modelo: "S340-15IWL Ideapad",
    tipoDispositivo: "Laptop",
    origen: "Ali Gutierrez",
    fechaIn: "2024-03-19",
  },
  {
    id: 90006,
    movimiento: "Envío",
    nroInventario: "SNT0006",
    nroSerie: "R90X529R",
    marca: "Lenovo",
    modelo: "Lenovo V330",
    tipoDispositivo: "Laptop",
    origen: "Azul Gallo",
    fechaIn: "2024-03-19",
  },
  {
    id: 90007,
    movimiento: "Envío",
    nroInventario: "SNT0007",
    nroSerie: "R90X52E9",
    marca: "Lenovo",
    modelo: "Lenovo V330-15IKB 81AX",
    tipoDispositivo: "Laptop",
    origen: "Saires",
    fechaIn: "2024-03-19",
  },
  {
    id: 90008,
    movimiento: "-",
    nroInventario: "-",
    nroSerie: "-",
    marca: "-",
    modelo: "-",
    tipoDispositivo: "-",
    origen: "-",
    fechaIn: "-",
  },
]

export function InventoryDashboard({ user, onLogout }: InventoryDashboardProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [activeSection, setActiveSection] = useState("equipos")

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(inventoryData.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  return (
    <div className="min-h-screen bg-slate-700 flex">
      {/* Sidebar */}
      <div className="w-64 bg-teal-600 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Inventario</h1>
        </div>

        <nav className="mt-8">
          <div className="px-4">
            <div className="flex items-center justify-between py-2 text-sm font-medium">
              <div className="flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                Tablas
              </div>
              <ChevronDown className="w-4 h-4" />
            </div>

            <div className="ml-6 mt-2 space-y-1">
              <button
                onClick={() => setActiveSection("gestiones")}
                className={`flex items-center w-full px-3 py-2 text-sm rounded ${
                  activeSection === "gestiones" ? "bg-teal-700" : "hover:bg-teal-700"
                }`}
              >
                <span className="mr-2">+</span>
                Gestiones
              </button>

              <button
                onClick={() => setActiveSection("usuarios")}
                className={`flex items-center w-full px-3 py-2 text-sm rounded ${
                  activeSection === "usuarios" ? "bg-teal-700" : "hover:bg-teal-700"
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Usuarios
              </button>

              <button
                onClick={() => setActiveSection("equipos")}
                className={`flex items-center w-full px-3 py-2 text-sm rounded ${
                  activeSection === "equipos" ? "bg-teal-700" : "hover:bg-teal-700"
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Equipos
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <div></div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-slate-700">
              Cerrar sesión
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Table */}
        <div className="p-6">
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-600 hover:bg-slate-700">
                  <TableHead className="text-slate-300 font-medium">
                    <Checkbox
                      checked={selectedItems.length === inventoryData.length}
                      onCheckedChange={handleSelectAll}
                      className="border-slate-500"
                    />
                  </TableHead>
                  <TableHead className="text-slate-300 font-medium">ID</TableHead>
                  <TableHead className="text-slate-300 font-medium">MOVIMIENTO</TableHead>
                  <TableHead className="text-slate-300 font-medium">NRO_INVENTARIO</TableHead>
                  <TableHead className="text-slate-300 font-medium">NRO_SERIE</TableHead>
                  <TableHead className="text-slate-300 font-medium">MARCA</TableHead>
                  <TableHead className="text-slate-300 font-medium">MODELO</TableHead>
                  <TableHead className="text-slate-300 font-medium">TIPO_DE_DISPOSITIVO</TableHead>
                  <TableHead className="text-slate-300 font-medium">ORIGEN</TableHead>
                  <TableHead className="text-slate-300 font-medium">FECHA_IN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item) => (
                  <TableRow key={item.id} className="border-slate-600 hover:bg-slate-700 text-slate-200">
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                        className="border-slate-500"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.movimiento}</TableCell>
                    <TableCell>{item.nroInventario}</TableCell>
                    <TableCell>{item.nroSerie}</TableCell>
                    <TableCell>{item.marca}</TableCell>
                    <TableCell>{item.modelo}</TableCell>
                    <TableCell>{item.tipoDispositivo}</TableCell>
                    <TableCell>{item.origen}</TableCell>
                    <TableCell>{item.fechaIn}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
