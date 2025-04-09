
import { Box, Flex } from "@chakra-ui/react"
import Sidebar from "./components/Sidebar"
import MainContent from "./components/MainContent"
import { useState } from "react"

export default function Dashboard() {

  //Que significa? Sirve? 
  const [activeTab, setActiveTab] = useState("gestiones")
  const [activeSubTab, setActiveSubTab] = useState("nueva-gestion")


  return (
    <Flex h="100vh" bg="gray.50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
      <MainContent activeTab={activeTab} activeSubTab={activeSubTab} />
      
    </Flex>
  )
}
