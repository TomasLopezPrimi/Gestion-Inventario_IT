
import {Box, Flex } from "@chakra-ui/react"
import Sidebar from "./components/Sidebar"
import { useState } from "react"
import { BrowserRouter } from "react-router-dom"
import AppRouter from "./routes/AppRoutes"
import GoogleAuthButton from "./components/GoogleAuthButton"
import { ColorModeSwitcher } from "./components/ColorModeSwitcher"

export default function App() {

  const [auth, setAuth] = useState(false)
  const [activeTab, setActiveTab] = useState("")
  const [activeSubTab, setActiveSubTab] = useState("Gestiones")
  

  return (
    <BrowserRouter>
    <Flex h="100vh" >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />
      <Box>
        <Flex align={"center"} >
          <GoogleAuthButton auth={auth} setAuth={setAuth} />
          <ColorModeSwitcher />
        </Flex>
        {auth && <AppRouter />}
      </Box>
    </Flex>
    </BrowserRouter>
  )
}
