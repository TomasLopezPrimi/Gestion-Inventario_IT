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
    // Tuve que darle la validación de gestiones porque el primer form me estaba tirando errores
    const initialData = gestiones.length > 0 ? gestiones[0] : {};
    return Object.keys(initialData).reduce((acc, key) => {
      acc[key] = ''; // Establecer el valor vacío para cada clave. Desde acá podriamos sumarle validación de datos dependiendo de cada "key"
      return acc;
    }, {});
  });




//Setea los datos del form
  const handleChange = (e) => {
    console.log(formData)
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

//Agrega una linea a la tabla una vez confirmado
  const handleSubmit = () => {
    const nuevaGestion = {
      // id: gestiones.length + 1,  // esto podría ser util
      ...formData,
    };
    setGestiones([...gestiones, nuevaGestion]);
    setFormData(Object.keys(gestiones[0] || {}).reduce((acc, key) => {
      acc[key] = ''; // Restablecer el valor vacío para cada clave
      return acc;
    }, {})); //deja vacío el form
    //guardar info a un txt formato json
    console.log(gestiones)
    onClose();

  };

  

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
                <FormControl key={index} 
                //mt={index === 0 ? 0 : 4}
                >
                  <FormLabel>{columna.charAt(0).toUpperCase() + columna.slice(1)}</FormLabel>
                  <Input
                    type="text"
                    name={columna}
                    value={formData[columna]}
                    onChange={handleChange}
                  />
                </FormControl>
            ))}

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

    </div>
  );
};

export default NuevaGestion;