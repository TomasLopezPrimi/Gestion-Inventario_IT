import { Box } from "@chakra-ui/react"
import NuevaGestion from "./NuevaGestion"
import TableComponent from "./TableComponent"
import React from "react"
import { useState } from "react"

export default function MainContent () {

//El contenido de la tabla debería ser distinto dependiendo la página (gestiones, usuarios, equipos)
//hace falta este archivo o se puede hacer desde App?

 // Datos hardcodeados, la idea es que esté vacio y usar setData con los datos exportados dependiendo si es usuarios/equipos o gestiones
    const [data, setData] = useState ([
      { id, name: "name", age: 28, email: 'john@example.com', id3: "asas",id4: "asas",id5: "asas",id6: "asas",id7: "asas", asdfsafsdfsdfsdfsdfsdf: "asdasd" },
      { id: 2, name: 'Jane Smith', age: 34, email: 'jane@example.com', id3: "",id4: "asas" },
      { id: 3, name: 'Sam Johnson', age: 45, email: 'sam@example.com', id3: "",id4: "asas" },
    ]);

    return (
        <Box flex="1" p={5} overflowY="auto">
            <NuevaGestion data={data} setData={setData}/>
            <TableComponent data={data} />
        </Box>
    )
}