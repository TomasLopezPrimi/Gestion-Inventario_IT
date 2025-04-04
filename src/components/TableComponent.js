import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';



export default function TableComponent(){

    // Datos hardcodeados, la idea es que esté vacio y usar setData con los datos exportados dependiendo si es usuarios/equipos o gestiones
    //La información podría ser pasada por props?
    const [data, setData] = useState ([
      { id: 1, name: 'John Doe', age: 28, email: 'john@example.com', id3: "asas",id4: "asas",id5: "asas",id6: "asas",id7: "asas", asdfsafsdfsdfsdfsdfsdf: "asdasd" },
      { id: 2, name: 'Jane Smith', age: 34, email: 'jane@example.com', id3: "",id4: "asas" },
      { id: 3, name: 'Sam Johnson', age: 45, email: 'sam@example.com', id3: "",id4: "" },
    ]);



    // const addRow = () => {
    //   const newRow = {
    //     id: data.length + 1,
    //     name: 'New Name',
    //     age: 30,
    //     email: 'newemail@example.com',
    //   };
    //   setData([...data, newRow]);
    // };
  
    return (
      <TableContainer>
        <Table size="sm" variant="striped" bgGradient="linear-gradient(90deg, rgba(1,134,115,1) 35%, rgba(0,212,255,1) 37%) 100%)" >
          <Thead>
            <Tr>
              {data.length > 0 && Object.keys(data[0]).map((title) => (
                <Th key={title}>{title}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {/* {El mapeo de las filas, usando de key el id inicial} */}
            {data.map((item) => (
              <Tr key={item.id}>
                {Object.values(item).map((value, index) => (
                  <Td key={index}>{value}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  };
  