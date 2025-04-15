"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Text,
  Flex,
  IconButton,
  useOutsideClick,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"

function Buscador() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef(null)

  // Categorías de búsqueda (por ahora hardcodeadas para probar)
  const searchCategories = [
    { id: "id", name: "ID", route: "/busqueda/ID" },
    { id: "movimiento", name: "Movimiento", route: "/busqueda/movimiento" },
    { id: "nro_serie", name: "Número de serie", route: "/busqueda/nro_se" },
    { id: "marca", name: "Marca", route: "/busqueda/marca" },
    { id: "cualquiera", name: "Cualquier columna", route: "/busqueda/cualquiera" },
  ]

  // Cerrar el dropdown cuando se hace clic fuera del componente
  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false),
  })

  // Mostrar opciones solo cuando hay texto en el input
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [searchTerm])

  // Manejar la selección de una categoría
  const handleCategorySelect = (route) => {
    if (searchTerm.trim() !== "") {
      // Redirigir a la ruta con el término de búsqueda como query parameter (falta crear la ruta dependiendo el query)
      navigate(`${route}?q=${encodeURIComponent(searchTerm)}`)
      setIsOpen(false)
    }
  }

  return (
      <Box 
        ref={ref} 
        position="relative" 
        maxW="900px"
        w="40%">
        <InputGroup>
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="md"
            borderColor="gray.300"
            _hover={{ borderColor: "gray.400" }}
            _focus={{ borderColor: "gray.500", boxShadow: "sm" }}
          />
          <InputRightElement>
            <IconButton
              aria-label="Buscar"
              icon={<SearchIcon />}
              size="sm"
              variant="ghost"
              colorScheme="gray"
              onClick={() => searchTerm.trim() !== "" && setIsOpen(true)}
            />
          </InputRightElement>
        </InputGroup>

        {isOpen && searchTerm.trim() !== "" && (
          <List
            position="absolute"
            width="100%"
            mt={1}
            borderRadius="md"
            boxShadow="md"
            zIndex={10}
            bg={"white"}  //A futuro modificar dependiendo el theme
            border="1px solid"
            borderColor="gray.200"
            py={2}
          >
            {searchCategories.map((category) => (
              <ListItem
                key={category.id}
                px={4}
                py={2}
                _hover={{ bg: "gray.100" }}
                cursor="pointer"
                onClick={() => handleCategorySelect(category.route)}
              >
                <Flex align="center">
                  <Text>
                    Buscar{" "}
                    <Text as="span" fontWeight="medium">
                      {category.name}
                    </Text>{" "}
                    para: {searchTerm}
                  </Text>
                </Flex>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
  )
}

export default Buscador