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
  const [gestiones, setGestiones] = useState(props.gestiones);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const newGestion = {
      id: gestiones.length + 1,
      ...formData,
    };
    setGestiones([...gestiones, newGestion]);
    setFormData({ nombre: '', descripcion: '' });
    onClose();
  };

  return (
    <div>
      <Button onClick={onOpen} mb={4}>
        Agregar Gestión
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