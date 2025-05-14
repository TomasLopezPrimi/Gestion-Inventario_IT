//Bibliotecas
import { useState, useEffect } from "react"
import { Box, HStack, StackDivider } from "@chakra-ui/react"

//Componentes
import TableComponent from "./TableComponent"
import ButtonsContainer from "./ButtonsContainer"
import Buscador from "./Buscador"

//Funciones
import { GetContentSheet } from "../google/auth"
import {adaptadorGestiones} from "../adapter/dataAdapter"




export default function MainContent (props) {

    const table = props.table ? props.table : "gestiones"  // Gestiones por defecto
    
    const [dataSheet, setDataSheet] = useState([]); // luego del fetch queda en formato array y otro array por linea -> [fila[columna]]
    const [dataAdapted, setDataAdapted] = useState([])    

    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await GetContentSheet(table);
            setDataSheet(data);
            setDataAdapted(data.map(fila => adaptadorGestiones(fila)))
          } catch (err) {
            console.error(err);
          }
        };

        fetchData();
    }, [table]);

    console.log(dataSheet)
    

    //Por ahora tenemos el componente Buscador pero resta definir la forma más óptima/practica de buscar

    return (
        <Box flex="1" p={5} overflowY="auto" >
                <HStack spacing={15} divider={<StackDivider />} >  
                    {/* <ButtonsContainer  data={dataAdapted} setData={setDataAdapted}/> */}
                    <Buscador />
                </HStack>
                <TableComponent data={dataAdapted} />
        </Box>
    )
}

