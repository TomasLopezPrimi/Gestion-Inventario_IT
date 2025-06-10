"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDown, Users, Briefcase, Monitor, Plus } from "lucide-react"
import { InventoryTable } from "@/components/inventory-table"
import { SearchBar } from "@/components/search-bar"

interface User {
  name: string
  email: string
  picture?: string
}

interface AppLayoutProps {
  user: User | null
  onLogout: () => void
}

const TABLES = [
  { key: "gestiones", label: "Gestiones", icon: <Plus className="w-4 h-4 mr-2" /> },
  { key: "usuarios", label: "Usuarios", icon: <Users className="w-4 h-4 mr-2" /> },
  { key: "equipos", label: "Equipos", icon: <Briefcase className="w-4 h-4 mr-2" /> },
]

export function AppLayout({ user, onLogout }: AppLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showTables, setShowTables] = useState(true)

  const getActiveSection = () => {
    if (pathname.includes("/gestiones")) return "gestiones"
    if (pathname.includes("/usuarios")) return "usuarios"
    if (pathname.includes("/equipos")) return "equipos"
    return "equipos"
  }
  const activeSection = getActiveSection()

  const renderContent = () => {
    if (pathname === "/" || pathname === "/equipos") return <InventoryTable section="equipos" />
    if (pathname === "/usuarios") return <InventoryTable section="usuarios" />
    if (pathname === "/gestiones") return <InventoryTable section="gestiones" />
    if (pathname === "/search") return <InventoryTable section="search" />
    return <InventoryTable section="equipos" />
  }

  return (
    <div className="h-screen bg-slate-700 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-teal-600 text-white flex-shrink-0">
        <div className="p-4">
          <h1 className="text-xl font-bold">Inventario</h1>
        </div>
        <nav className="mt-8">
          <div className="px-4">
            <div className="flex items-center justify-between py-2 text-sm font-medium cursor-pointer select-none" onClick={() => setShowTables(v => !v)}>
              <div className="flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                Tablas
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTables ? '' : 'rotate-180'}`} />
            </div>
            {showTables && (
              <div className="ml-6 mt-2 space-y-1">
                {TABLES.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => router.push(`/${tab.key}`)}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded ${activeSection === tab.key ? "bg-teal-700" : "hover:bg-teal-700"}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-slate-800 text-white p-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-4">
            <SearchBar searchParamKey="q1" />
            <SearchBar searchParamKey="q2" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-slate-700">
              Cerrar sesión
            </Button>
          </div>
        </header>
        {/* Content Area */}
        <div className="flex-1 p-6 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
