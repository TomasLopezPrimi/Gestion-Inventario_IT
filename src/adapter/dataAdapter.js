// Función para estructurar la información de "Gestiones"
export function adaptadorGestiones(data) {
    return {
        //Selector: `<Checkbox id=${data.ID}>Checkbox</Checkbox>`,
        Selector: data.selector || "selector",
        ID: data.ID || "",
        Movimiento: data.Movimiento || "",
        Nro_Inventario: data.Nro_Inventario || "",
        Nro_Serie: data.Nro_Serie || "",
        Marca: data.Marca || "",
        Modelo: data.Modelo || "",
        Tipo_de_Dispositivo: data.Tipo_de_Dispositivo || "",
        Origen: data.Origen || "",
        Fecha_In: data.Fecha_In || "",
        Costo_Movimiento: data.Costo_Movimiento || 0,
        ID_Traking: data.ID_Traking || "Vacio",
        Destino: data.Destino || "",
        Status: data.Status || "",
        Comodato_firmado: data.Comodato_firmado || false,
        Observaciones: data.Observaciones || "",
        LinkWS: data.LinkWS || "",
        Link_Tracking: data.Link_Tracking || ""
    };
}

// Función para estructurar la información de "Usuarios"
export function adaptadorUsuarios(data) {
    return {
        Id_Usuario: data.Id_Usuario || "",
        Nombre_Completo: data.Nombre_Completo || "",
        Apellido: data.Apellido || "",
        Nombre: data.Nombre || "",
        Email_corpo: data.Email_corpo || "",
        Email_personal: data.Email_personal || "",
        IdDiscord: data.IdDiscord || "",
        Legajo: data.Legajo || "",
        Documento: data.Documento || "",
        Sector: data.Sector || "",
        Rol: data.Rol || "",
        País: data.País || "",
        Provincia: data.Provincia || "",
        Ciudad: data.Ciudad || "",
        Direccion: data.Direccion || "",
        Link_Maps: data.Link_Maps || "",
        Codigo_Postal: data.Codigo_Postal || "",
        Telefono: data.Telefono || "",
        Status: data.Status || "",
        LinkWS: data.LinkWS || "",
        Disp_Horaria: data.Disp_Horaria || ""
    };
}

// Función para estructurar la información de "Equipos"
export function adaptadorEquipos(data) {
    return {
        Id_Equipo: data.Id_Equipo || "",
        Nro_Inventario: data.Nro_Inventario || "",
        Tipo_de_Dispositivo: data.Tipo_de_Dispositivo || "",
        Nro_Serie: data.Nro_Serie || "",
        Marca: data.Marca || "",
        Modelo: data.Modelo || "",
        Fecha_Compra: data.Fecha_Compra || "",
        Fecha_Garantia: data.Fecha_Garantia || "",
        Estado: data.Estado || "",
        Resolucion: data.Resolucion || "",
        Ubicacion_Actual: data.Ubicacion_Actual || "",
        Nombre_Dispositivo: data.Nombre_Dispositivo || "",
        Folder_ID: data.Folder_ID || "",
        Licencia_Win: data.Licencia_Win || "",
        WatchGuard_conectado: data.WatchGuard_conectado || false,
        Costo_USD: data.Costo_USD || 0,
        Proveedor: data.Proveedor || "",
        Pais: data.Pais || "",
        Observaciones: data.Observaciones || ""
    };
}
