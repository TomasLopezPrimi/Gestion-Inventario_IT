import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Checkbox } from '@chakra-ui/react';

export default function TableComponent(props){

  const data = props.data

  // return (
  //   <TableContainer m={7}>
  //     <Table size="sm" variant="striped" colorScheme='teal'>
  //       <Thead>
  //         <Tr>
  //           {data.length > 0 && Object.values(data[0]).map((title) => (
  //             <Th key={title} minWidth={title.length * 15} textAlign="center" fontSize="md" fontWeight="bold" >{title}</Th>
  //           ))}
  //         </Tr>
  //       </Thead>
  //       <Tbody>
  //         {/* {El mapeo de las filas, usando de key el id inicial y sacando la primer fila (titulos)} */}
  //         {data.slice(1).map((item) => (
  //           <Tr key={item.id}>
  //             {Object.values(item).map((value, index) => (
  //               <Td key={index} textAlign="center">{value}</Td>
  //             ))}
  //           </Tr>
  //         ))}
  //       </Tbody>
  //     </Table>
  //   </TableContainer>
  // );
  return (
  <TableContainer m={7}>
    <Table size="sm" variant="striped" colorScheme='teal'>
      <Thead>
        <Tr>
          {data.length > 0 && Object.values(data[0]).map((title, index) => (
            <Th key={index} minWidth={title.length * 15} textAlign="center" fontSize="md" fontWeight="bold">{title}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.slice(1).map((item) => (
          <Tr key={item[0]}>
            {Object.values(item).map((value, index) => (
              <Td key={`${item[0]}-${index}`} textAlign="center">{value}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);



};
