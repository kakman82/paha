import {
  Alert,
  AlertIcon,
  Button,
  Container,
  Flex,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import Graph from '../components/graph/Graph';
import { useGetLatestExpensesQuery } from '../slices/expenseApiSlice';
import Expense from '../components/expense/Expense';

const Dashboard = () => {
  const { data: latest, isFetching } = useGetLatestExpensesQuery();

  return (
    <>
      <Container maxW={{ base: 'full', md: '6xl' }} p={{ base: 3, md: 10 }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* 1.part chart */}
          {(latest !== undefined || latest?.latest.length > 0) && (
            <Stack spacing={4}>
              <Graph />
            </Stack>
          )}
          {/* 2.part Latest Transactions */}
          <Flex direction={'column'}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme='teal'
              variant='solid'
              marginBottom={3}
              as={ReachLink}
              to={'/expense/add-transaction'}
            >
              Add New
            </Button>
            <Flex
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              width={'full'}
              marginBottom={'10px'}
            >
              <Text fontSize={'2xl'} fontWeight={'bold'}>
                Latest transactions
              </Text>
              <Link
                fontSize={'xl'}
                as={ReachLink}
                to={'/expenses'}
                fontWeight={'bold'}
                color={'cyan.500'}
              >
                View all...
              </Link>
            </Flex>
            <Stack spacing={3}>
              {isFetching && (
                <Stack align={'center'} mt={6} mb={6}>
                  <Spinner size={'xl'} color='cyan.300' />
                </Stack>
              )}
              {latest?.latest.length === 0 && (
                <Alert status='warning'>
                  <AlertIcon />
                  Seems you do not have any expenses... <br />
                  Please create a new one!
                </Alert>
              )}

              {/* Latest Transaction Comp */}

              {latest?.latest.length > 0 &&
                latest.latest.map((el) => (
                  <Expense key={el._id} expense={el} />
                ))}
            </Stack>
          </Flex>
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Dashboard;
