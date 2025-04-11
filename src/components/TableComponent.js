import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';



export default function TableComponent(props){

 const data = props.data

    return (
      <TableContainer>
        <Table size="m" variant="striped" bgGradient="linear-gradient(90deg, rgba(1,134,115,1) 35%, rgba(0,212,255,1) 37%) 100%)" >
          <Thead>
            <Tr>
              {data.length > 0 && Object.keys(data[0]).map((title) => (
                <Th key={title} minWidth={title.length * 15} >{title}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {/* {El mapeo de las filas, usando de key el id inicial y sacando la primer fila (titulos)} */}
            {data.slice(1).map((item) => (
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
  