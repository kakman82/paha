import {
  Card,
  CardBody,
  Center,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const PaginationView = ({
  totalItems,
  itemsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  // ceil -> round it to upper integer
  const totalPage = Math.ceil(totalItems / itemsPerPage);

  return (
    <Center>
      <Card
        px={2}
        py={1}
        size={'xs'}
        direction={'row'}
        align={'center'}
        variant={'elevated'}
      >
        <CardBody>
          <HStack
            mx={2}
            alignItems={'center'}
            justifyContent={'center'}
            spacing={6}
          >
            <Text fontWeight={'bold'} fontSize={'sm'} textColor={'gray.500'}>
              1
            </Text>

            <IconButton
              size={'xs'}
              colorScheme='teal'
              icon={<ChevronLeftIcon />}
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            <Text textColor={'teal.200'} fontWeight={'bold'} fontSize={'md'}>
              {currentPage}
            </Text>
            <IconButton
              size={'xs'}
              colorScheme='teal'
              icon={<ChevronRightIcon />}
              isDisabled={currentPage === totalPage}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
            <Text fontWeight={'bold'} fontSize={'sm'} textColor={'gray.500'}>
              {totalPage}
            </Text>
          </HStack>
        </CardBody>
      </Card>
    </Center>
  );
};

export default PaginationView;
