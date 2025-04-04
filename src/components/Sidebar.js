"use client"

import { Box, Flex, VStack, Icon, Text, Collapse, useDisclosure, Button } from "@chakra-ui/react"
import {
  FaClipboardList,
  FaUsers,
  FaLaptop,
  FaPlus,
  FaExchangeAlt,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"

export default function Sidebar({ activeTab, setActiveTab, activeSubTab, setActiveSubTab }) {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: activeTab === "gestiones",
  })

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    if (tab === "gestiones") {
      onToggle()
      setActiveSubTab("nueva-gestion")
    }
  }

  const handleSubTabClick = (subTab) => {
    setActiveSubTab(subTab)
  }

  return (
    <Box w="250px" bg="teal.500" color="white" h="100vh" py={5} boxShadow="lg">
      <Flex align="center" justify="center" mb={8} px={5}>
        <Text fontSize="2xl" fontWeight="bold">
          Inventario
        </Text>
      </Flex>

      <VStack spacing={1} align="stretch">
        <Button
          leftIcon={<Icon as={FaClipboardList} />}
          rightIcon={activeTab === "gestiones" ? <Icon as={FaChevronUp} /> : <Icon as={FaChevronDown} />}
          justifyContent="space-between"
          variant="ghost"
          color="white"
          _hover={{ bg: "teal.600" }}
          _active={{ bg: "teal.700" }}
          bg={activeTab === "gestiones" ? "teal.600" : "transparent"}
          onClick={() => handleTabClick("gestiones")}
          borderRadius={0}
          w="100%"
          px={5}
          py={3}
        >
          Gestiones
        </Button>
      

        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={0} align="stretch" pl={10} bg="teal.600">
            <Button
              leftIcon={<Icon as={FaPlus} boxSize={3} />}
              variant="ghost"
              color="white"
              _hover={{ bg: "teal.700" }}
              _active={{ bg: "teal.800" }}
              bg={activeSubTab === "nueva-gestion" ? "teal.700" : "transparent"}
              onClick={() => handleSubTabClick("nueva-gestion")}
              justifyContent="flex-start"
              borderRadius={0}
              w="100%"
              py={2}
              fontSize="sm"
            >
              Nueva gestión
            </Button>
            <Button
              leftIcon={<Icon as={FaExchangeAlt} boxSize={3} />}
              variant="ghost"
              color="white"
              _hover={{ bg: "teal.700" }}
              _active={{ bg: "teal.800" }}
              bg={activeSubTab === "reasignar" ? "teal.700" : "transparent"}
              onClick={() => handleSubTabClick("reasignar")}
              justifyContent="flex-start"
              borderRadius={0}
              w="100%"
              py={2}
              fontSize="sm"
            >
              Reasignar
            </Button>
            <Button
              leftIcon={<Icon as={FaChartBar} boxSize={3} />}
              variant="ghost"
              color="white"
              _hover={{ bg: "teal.700" }}
              _active={{ bg: "teal.800" }}
              bg={activeSubTab === "reporte" ? "teal.700" : "transparent"}
              onClick={() => handleSubTabClick("reporte")}
              justifyContent="flex-start"
              borderRadius={0}
              w="100%"
              py={2}
              fontSize="sm"
            >
              Reporte
            </Button>
          </VStack>
        </Collapse>

        <Button
          leftIcon={<Icon as={FaUsers} />}
          variant="ghost"
          color="white"
          _hover={{ bg: "teal.600" }}
          _active={{ bg: "teal.700" }}
          bg={activeTab === "usuarios" ? "teal.600" : "transparent"}
          onClick={() => handleTabClick("usuarios")}
          justifyContent="flex-start"
          borderRadius={0}
          w="100%"
          px={5}
          py={3}
        >
          Usuarios
        </Button>

        <Button
          leftIcon={<Icon as={FaLaptop} />}
          variant="ghost"
          color="white"
          _hover={{ bg: "teal.600" }}
          _active={{ bg: "teal.700" }}
          bg={activeTab === "equipos" ? "teal.600" : "transparent"}
          onClick={() => handleTabClick("equipos")}
          justifyContent="flex-start"
          borderRadius={0}
          w="100%"
          px={5}
          py={3}
        >
          Equipos
        </Button>
      </VStack>
    </Box>
  )
}
