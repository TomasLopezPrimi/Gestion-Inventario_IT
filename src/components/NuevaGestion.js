import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

const NuevaGestion = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

//Nombramos como gestiones por practicidad, depende el uso se puede modificar
  const setGestiones = props.setData
  const gestiones = props.data


  const [formData, setFormData] = useState(() => {
    return Object.keys(gestiones).reduce((acc, key) => {
      acc[key] = ''; // Establecer el valor vacío para cada clave
      return acc;
    }, {});
  });


//Setea los datos del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

//Agrega una linea a la tabla una vez confirmado
  const handleSubmit = () => {
    const newGestion = {
      id: gestiones.length + 1, //esto podría ser util
      ...formData,
    };
    setGestiones([...gestiones, newGestion]);
    setFormData();  //deja vacío el form
    //guardar info a un txt formato json
    onClose();

  };

  console.log((Object.keys(gestiones[0])[0]))

  const columnas = (Object.keys(gestiones[0]))

  return (
    <div>
      <Button onClick={onOpen} mb={7}>
        Crear nueva gestión
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nueva Gestión</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {columnas.map((columna, index) => (
                <FormControl key={index} mt={index === 0 ? 0 : 4}>
                  <FormLabel>{columna.charAt(0).toUpperCase() + columna.slice(1)}</FormLabel>
                  <Input
                    type="text"
                    name={columna}
                    value={formData[columna]}
                    onChange={handleChange}
                  />
                </FormControl>
            ))}


            {/* <FormControl>
              <FormLabel> </FormLabel>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Descripción</FormLabel>
              <Input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </FormControl> */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Guardar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Descripción</Th>
            </Tr>
          </Thead>
          <Tbody>
            {gestiones.map((gestion) => (
              <Tr key={gestion.id}>
                <Td>{gestion.id}</Td>
                <Td>{gestion.nombre}</Td>
                <Td>{gestion.descripcion}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer> */}
    </div>
  );
};

export default NuevaGestion;