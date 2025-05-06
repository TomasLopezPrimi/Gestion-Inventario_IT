

import { Box, Flex, VStack, Icon, Text, Collapse, useDisclosure, Button, useColorModeValue } from "@chakra-ui/react"
import {
  FaClipboardList,
  FaPlus,
  FaExchangeAlt,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"
import { Link } from "react-router-dom";

export default function Sidebar({ activeTab, setActiveTab, activeSubTab, setActiveSubTab }) {

  //Estilos especificos para modo claro/oscuro
  const bgColor = useColorModeValue('teal.500', 'teal.800');
  const textColor = useColorModeValue('white', 'whiteAlpha.900');

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: activeTab === "Tablas",
  })

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    if (tab === "Tablas") {
      onToggle()
      setActiveSubTab("Gestiones")
    }
  }

  const handleSubTabClick = (subTab) => {
    setActiveSubTab(subTab)

  }

  return (
    <Box w="250px" bg={bgColor} color={textColor} h="100vh" py={5} boxShadow="lg">
      <Flex align="center" justify="center" mb={8} px={5} as={Link} to='/'>
        <Text fontSize="2xl" fontWeight="bold">
          Inventario
        </Text>
      </Flex>

      <VStack spacing={1} align="stretch">
        <Button
          leftIcon={<Icon as={FaClipboardList} />}
          rightIcon={activeTab === "Tablas" ? <Icon as={FaChevronUp} /> : <Icon as={FaChevronDown} />}
          justifyContent="space-between"
          variant="ghost"
          color={textColor}
          _hover={{ bg: "teal.600" }}
          _active={{ bg: "teal.700" }}
          bg={activeTab === "Tablas" ? "teal.600" : "transparent"}
          onClick={() => handleTabClick("Tablas")}
          borderRadius={0}
          w="100%"
          px={5}
          py={3}
        >
          Tablas
        </Button>
      

        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={0} align="stretch" pl={10} bg="teal.600">
            <Button
              leftIcon={<Icon as={FaPlus} boxSize={3} />}
              variant="ghost"
              color="white"
              _hover={{ bg: "teal.700" }}
              _active={{ bg: "teal.800" }}
              bg={activeSubTab === "Gestiones" ? "teal.700" : "transparent"}
              onClick={() => handleSubTabClick("Gestiones")}
              justifyContent="flex-start"
              borderRadius={0}
              w="100%"
              py={2}
              fontSize="sm"
              as={Link}
              to="/gestiones"
            >
              Gestiones
            </Button>
            <Button
              leftIcon={<Icon as={FaExchangeAlt} boxSize={3} />}
              variant="ghost"
              color="white"
              _hover={{ bg: "teal.700" }}
              _active={{ bg: "teal.800" }}
              bg={activeSubTab === "Usuarios" ? "teal.700" : "transparent"}
              onClick={() => handleSubTabClick("Usuarios")}
              justifyContent="flex-start"
              borderRadius={0}
              w="100%"
              py={2}
              fontSize="sm"
              as={Link}
              to="/usuarios"
            >
              Usuarios
            </Button>
            <Button
              leftIcon={<Icon as={FaChartBar} boxSize={3} />}
              variant="ghost"
              color="white"
              _hover={{ bg: "teal.700" }}
              _active={{ bg: "teal.800" }}
              bg={activeSubTab === "Equipos" ? "teal.700" : "transparent"}
              onClick={() => handleSubTabClick("Equipos")}
              justifyContent="flex-start"
              borderRadius={0}
              w="100%"
              py={2}
              fontSize="sm"
              as={Link}
              to="/equipos"
            >
              Equipos
            </Button>
          </VStack>
        </Collapse>

        {/* <Button
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
        </Button> */}
      </VStack>
    </Box>
  )
}