
import {Flex } from "@chakra-ui/react"
import Sidebar from "./components/Sidebar"
import { useState } from "react"
import { BrowserRouter } from "react-router-dom"
import AppRouter from "./routes/AppRoutes"

export default function App() {

  
  const [activeTab, setActiveTab] = useState("")
  const [activeSubTab, setActiveSubTab] = useState("nueva-gestion")


  return (
    <BrowserRouter>
    <Flex h="100vh" >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
      <AppRouter />
      
    </Flex>
    </BrowserRouter>
  )
}
