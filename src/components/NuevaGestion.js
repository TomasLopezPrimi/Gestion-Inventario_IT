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

  //Las tablas que traemos con props, para poder usar este mismo componente en cualquiera de las tres
  const [gestiones, setGestiones] = useState(props.gestiones);

  //El form debería ser con un map de todas las columnas de "gestiones"
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
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
    setFormData({ nombre: '', descripcion: '' });  //deja vacío el form
    onClose(); 
  };

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
            <FormControl>
              <FormLabel>Nombre</FormLabel>
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
            </FormControl>
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