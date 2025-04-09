import { Box } from "@chakra-ui/react"
import NuevaGestion from "./NuevaGestion"
import TableComponent from "./TableComponent"
import React from "react"
import { useState } from "react"
import {adaptadorGestiones} from "../adapter/dataAdapter"

export default function MainContent () {

//El contenido de la tabla debería ser distinto dependiendo la página (gestiones, usuarios, equipos)
//hace falta este archivo o se puede hacer desde App?

 // Datos hardcodeados, la idea es que esté vacio y usar setData con los datos exportados dependiendo si es usuarios/equipos o gestiones
    const data = [
        {   
            ID: "ID",
            Movimiento: "Movimiento",
            Nro_Inventario: "Nro_Inventario",
            Nro_Serie: "Nro_Serie",
            Marca: "Marca",
            Modelo: "Modelo",
            Tipo_de_Dispositivo: "Tipo_de_Dispositivo",
            Origen: "Origen",
            Fecha_In: "Fecha_In",
            Costo_Movimiento: "Costo_Movimiento",
            ID_Traking: "ID_Traking",
            Destino: "Destino",
            Status: "Status",
            Comodato_firmado: "Comodato_firmado",
            Observaciones: "Observaciones",
            LinkWS: "LinkWS",
            Link_Tracking: "Link_Tracking"  
        },
        {
            ID: "1",
            Movimiento: "Envio",
            Nro_Inventario: "001",
            Nro_Serie: "11111",
            Marca: "Lenovo",
        },
        {ID: "2",
            Movimiento: "Retiro",
            Nro_Inventario: "001",
            Marca: "Lenovo",
            Destino: "data.Destino" || "",
            Status: "#" || "",
            Comodato_firmado: "data.Comodato_firmado" || false,
            Observaciones: "data.Observaciones" || "",
            LinkWS: "data.LinkWS" || "",
            Link_Tracking: "data.Link_Tracking"} 
      
    ];

    //Usamos el adaptador, por ahora sin validación dependiendo que tipo de datos o tabla usemos
    const [dataAdapted, setDataAdapted] = useState(data.map(adaptadorGestiones))

    return (
        <Box flex="1" p={5} overflowY="auto">
            <NuevaGestion data={dataAdapted} setData={setDataAdapted}/>
            <TableComponent data={dataAdapted} />
        </Box>
    )
}