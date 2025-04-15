import { HStack } from "@chakra-ui/react"
import ButtonComponent from "./ButtonComponent"

const ButtonsContainer = (props) => {

    const data = props.data
    const setData = props.setData

    //Las funciones de cada botón deberian ir acá y pasarlas como prop o en el componente boton? 

    return (
    <HStack spacing={7}>
        <ButtonComponent data={data} setData={setData} typeOfButton={"Crear nueva"} />
        <ButtonComponent data={data} setData={setData} typeOfButton={"Modificar"}/>
        <ButtonComponent data={data} setData={setData} typeOfButton={"Eliminar"}/>
    </HStack>
    )
}


export default ButtonsContainer