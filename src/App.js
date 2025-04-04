
import { Box, Flex } from "@chakra-ui/react"
import Sidebar from "./components/Sidebar"
import MainContent from "./components/MainContent"
import { useState } from "react"
import NuevaGestion from "./components/NuevaGestion"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("gestiones")
  const [activeSubTab, setActiveSubTab] = useState("nueva-gestion")

  //Gestiones hardcodeada de prueba
  const gestiones = [
    { id: 1, nombre: 'Gestión 1', descripcion: 'Descripción 1' },
    { id: 2, nombre: 'Gestión 2', descripcion: 'Descripción 2' },
  ]
  console.log(gestiones)

  return (
    <Flex h="100vh" bg="gray.50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
      <Box flex="1" p={5} overflowY="auto">
        <MainContent activeTab={activeTab} activeSubTab={activeSubTab} />
        <NuevaGestion gestiones={gestiones}/>
      </Box>
    </Flex>
  )
}
