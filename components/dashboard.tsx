"use client"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSheet } from "@/hooks/useSheet";


// Datos de ejemplo para el gráfico de barras
const barChartData = [
  { name: "Ene", ventas: 4000, compras: 2400 },
  { name: "Feb", ventas: 3000, compras: 1398 },
  { name: "Mar", ventas: 2000, compras: 9800 },
  { name: "Abr", ventas: 2780, compras: 3908 },
  { name: "May", ventas: 1890, compras: 4800 },
  { name: "Jun", ventas: 2390, compras: 3800 },
]

// Datos de ejemplo para el gráfico de líneas
const lineChartData = [
  { name: "Sem 1", usuarios: 400, sesiones: 240 },
  { name: "Sem 2", usuarios: 300, sesiones: 139 },
  { name: "Sem 3", usuarios: 200, sesiones: 980 },
  { name: "Sem 4", usuarios: 278, sesiones: 390 },
  { name: "Sem 5", usuarios: 189, sesiones: 480 },
  { name: "Sem 6", usuarios: 239, sesiones: 380 },
  { name: "Sem 7", usuarios: 349, sesiones: 430 },
]

// Datos de ejemplo para el gráfico circular
const pieChartData = [
  { name: "Equipos", value: 400 },
  { name: "Licencias", value: 300 },
  { name: "Servidores", value: 300 },
  { name: "Periféricos", value: 200 },
]

// Colores para el gráfico circular
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function Dashboard() {
    const equiposData = useSheet("equipos").data
    const usuariosData = useSheet("usuarios").data
    const gestionesData = useSheet("gestiones").data

    // const fecha = gestionesData[0].fecha_in
    // console.log(new Date(fecha))
    const equiposNuevos = equiposData.filter(equipo => equipo.ubicacion_actual === "Saires" && equipo.estado === "Nuevo")

    const totalLaptops = equiposData.filter(equipo => equipo.tipo_de_dispositivo === "Laptop")

    const equiposAReparar = equiposData.filter(equipo => equipo.resolucion === "Reparar")

    const usuariosActivos = usuariosData.filter(usuario => usuario.status === "Activo")

    function contarPorPropiedad(array, propiedad) {
        const conteoObjeto = array.reduce((acumulador, elemento) => {
            let valor = elemento[propiedad];

            if (propiedad === 'fecha_in' && valor) {
            const fecha = new Date(valor);
            if (!isNaN(fecha.getTime())) {
                valor = fecha.getFullYear();
            } else {
                valor = 'Fecha inválida';
            }
            }

            if (valor !== undefined) {
            acumulador[valor] = (acumulador[valor] || 0) + 1;
            }
            return acumulador;
        }, {});

        return Object.entries(conteoObjeto).map(([valor, cantidad]) => {
            const valorFinal = (propiedad === 'fecha_in' && !isNaN(Number(valor)))
            ? Number(valor)
            : valor;

            return {
            [propiedad]: valorFinal,
            cantidad: cantidad,
            };
        });
    }

    const gestionesPorMes = contarPorPropiedad(gestionesData, "fecha_in")
    console.log(gestionesPorMes)

    


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex space-x-2">
          <select className="bg-slate-700 text-white rounded-md px-3 py-1 text-sm border border-slate-600">
            <option>Último mes (inactivo)</option>
            <option>Último trimestre (inactivo)</option>
            <option>Último año (inactivo)</option>
          </select>
          <button className="bg-teal-600 hover:bg-teal-700 text-white rounded-md px-3 py-1 text-sm">Actualizar (inactivo)</button>
        </div>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="text-sm text-slate-400">Total Equipos</div>
            <div className="text-2xl font-bold">{totalLaptops.length}</div>
            <div className="text-xs text-teal-400 mt-1"></div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="text-sm text-slate-400">Usuarios Activos</div>
            <div className="text-2xl font-bold">{usuariosActivos.length}</div>
            <div className="text-xs text-teal-400 mt-1"></div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="text-sm text-slate-400">Equipos nuevos en Saires</div>
            <div className="text-2xl font-bold">{equiposNuevos.length}</div>
            <div className="text-xs text-red-400 mt-1"></div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="text-sm text-slate-400">Equipos para arreglar</div>
            <div className="text-2xl font-bold">{equiposAReparar.length}</div>
            <div className="text-xs text-teal-400 mt-1"></div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras */}
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Gestiones por mes</CardTitle>
            <CardDescription className="text-slate-400">Envios/retiros </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gestionesPorMes}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="fecha_in" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#F9FAFB" }}
                    itemStyle={{ color: "#F9FAFB" }}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Legend wrapperStyle={{ color: "#F9FAFB" }} />
                  <Bar dataKey="cantidad" fill="#0D9488" />
                  {/* <Bar dataKey="compras" fill="#0369A1" /> */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de líneas */}
        {/* <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Actividad de Usuarios</CardTitle>
            <CardDescription className="text-slate-400">Usuarios y sesiones por semana</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#F9FAFB" }}
                    itemStyle={{ color: "#F9FAFB" }}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Legend wrapperStyle={{ color: "#F9FAFB" }} />
                  <Line type="monotone" dataKey="usuarios" stroke="#0D9488" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="sesiones" stroke="#0369A1" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* Gráfico circular */}
        {/* <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Distribución de Inventario</CardTitle>
            <CardDescription className="text-slate-400">Distribución por categoría</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sarasa}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo_de_dispositivo, percent }) => `${tipo_de_dispositivo}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {sarasa.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#F9FAFB" }}
                    itemStyle={{ color: "#F9FAFB" }}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Legend wrapperStyle={{ color: "#F9FAFB" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* Tabla de resumen */}
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Equipos Recientes</CardTitle>
            <CardDescription className="text-slate-400">Últimos equipos añadidos al inventario</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 font-medium text-slate-400">Nro Serie</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-400">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-400">Modelo</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-400">Ubicacion actual</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-400">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {equiposData.slice(equiposData.length - 5, equiposData.length).map((equipo) => (
                    <tr key={equipo.Id_Equipo} className="border-b border-slate-700">
                      <td className="py-3 px-4">{equipo.nro_serie}</td>
                      <td className="py-3 px-4">{equipo.tipo_de_dispositivo}</td>
                      <td className="py-3 px-4">{equipo.modelo}</td>
                      <td className="py-3 px-4">{equipo.ubicacion_actual}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            equipo.estado === "Nuevo"
                              ? "bg-green-900 text-green-300"
                              : equipo.estado === "Roto"
                                ? "bg-red-900 text-red-300"
                                : "bg-yellow-900 text-yellow-300"
                          }`}
                        >
                          {equipo.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
