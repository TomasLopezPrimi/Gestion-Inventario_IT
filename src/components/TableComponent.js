import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Checkbox } from '@chakra-ui/react';

export default function TableComponent(props){

  const data = props.data

 return (
    <TableContainer m={7}>
      <Table size="sm" variant="striped" colorScheme='teal'>
        <Thead>
          <Tr>
            {data.length > 0 && Object.keys(data[0]).map((key) => (
              <Th key={key} minWidth={key.length * 15} textAlign="center" fontSize="md" fontWeight="bold">
                {key}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.slice(1).map((item) => (
            <Tr key={item.ID}> 
              {Object.keys(item).map((key) => (
                <Td key={`${item.ID}-${key}`} textAlign="center">
                  {key === "Selector" ? 
                    <Checkbox colorScheme='green'/> 
                    : item[key]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};


