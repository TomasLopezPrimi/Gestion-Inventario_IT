"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDown, Users, Briefcase, Monitor, Plus } from "lucide-react"
import { InventoryTable } from "@/components/inventory-table"
import { SearchBar } from "@/components/search-bar"
import { Section } from "@/types/google"
// import { useAuth } from "@/hooks/useAuth"
import { Dashboard } from "./dashboard"

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

  // const {usuarioEsValido} = useAuth()

  const getActiveSection: ( () => Section ) = () => {
    if (pathname.includes("/gestiones")) return "gestiones"
    if (pathname.includes("/usuarios")) return "usuarios"
    if (pathname.includes("/equipos")) return "equipos"
    if (pathname.includes("/dashboard")) return "dashboard"
    return "equipos"
  }
  const activeSection = getActiveSection()

  const renderContent = () => {
    if (pathname === "/" || pathname === "/equipos") return <InventoryTable section="equipos" />
    if (pathname === "/usuarios") return <InventoryTable section="usuarios" />
    if (pathname === "/gestiones") return <InventoryTable section="gestiones" />
    if (pathname === "/search") return <InventoryTable section="search" />
    if (pathname === "/dashboard") return <Dashboard />
    return <InventoryTable section="equipos" />
  }

  // const handleTest = () => {
  //   usuarioEsValido("tomas.lopez")
  // }

  return (
    <div className="h-screen bg-slate-700 flex overflow-hidden">

      {/* Sidebar */}
      
      <div className="w-64 bg-teal-600 text-white flex-shrink-0">
        <div className="p-4 border-b border-white/10 text-center">
          <h1 className="text-xl font-semibold tracking-wider mb-4">Inventario</h1>
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
          
          <button 
            // className="mt-8 text-center font-medium cursor-pointer w-4/6 select-none px-3 py-2 text-xl rounded hover:bg-teal-700"
            className="mt-8 w-5/6 mx-auto flex items-center justify-center gap-2 px-4 py-2 text-lg font-bold rounded-lg bg-gradient-to-r from-teal-500 to-teal-700 shadow-lg hover:from-teal-400 hover:to-teal-600 transition-all duration-200 border-2 border-white/10"
  
            onClick={() => router.push(`/dashboard`)}
          >
            Dashboard
          </button>

          {/* <button
            className=" w-15 px-3 py-2 text-xl text-white rounded font-medium cursor-pointer select-none m-4 hover:bg-slate-500"
            onClick={handleTest}
          > Test auth AppScript</button> */}

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

        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
