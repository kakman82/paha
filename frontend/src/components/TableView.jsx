import {
  TableContainer,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Box,
} from '@chakra-ui/react';

import MenuView from './MenuView';

const TableView = ({ items, tabIndex }) => {
  return (
    <TableContainer>
      <Table
        size={{ base: 'sm', md: 'full' }}
        variant={'simple'}
        colorScheme='teal'
      >
        <Thead>
          <Tr>
            {tabIndex === 0 && <Th>Color</Th>}
            <Th>Name</Th>
            <Th textAlign={'right'}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items?.map((item) => (
            <Tr key={item._id}>
              {tabIndex === 0 && (
                <Td>
                  <Box
                    backgroundColor={item.color ? item.color : 'Undefined'}
                    rounded={'full'}
                    boxSize={'6'}
                  />
                </Td>
              )}
              <Td>{item.name ? item.name : 'Undefined'}</Td>
              <Td textAlign={'right'}>
                <MenuView tabIndex={tabIndex} item={item} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
export default TableView;
