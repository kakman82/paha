import {
  Flex,
  Box,
  Stack,
  Heading,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';

import {
  useGetAllCategoriesQuery,
  useGetCategoriesQuery,
} from '../slices/categoryApiSlice';
import { useGetAllPaymentMethodsQuery } from '../slices/paymentMethodApiSlice';
import FormExpense from '../components/expense/FormExpense';

const AddTransaction = () => {
  const {
    data: categories,
    isFetching: isCategoriesFetching,
    isSuccess: isCategoriesSuccess,
  } = useGetAllCategoriesQuery();

  const {
    data: paymentMethods,
    isFetching: isPaymentMethodsFetching,
    isSuccess: isPaymentMethodsSuccess,
  } = useGetAllPaymentMethodsQuery();

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={8}
        mx={'auto'}
        width={{ base: 'lg', md: 'xl' }}
        py={6}
        px={2}
      >
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'} color={'teal.400'}>
            Add New Transaction
          </Heading>
        </Stack>
        {(isCategoriesFetching || isPaymentMethodsFetching) && (
          <Stack align={'center'} mt={6} mb={6}>
            <Spinner size={'xl'} color='cyan.300' />
          </Stack>
        )}
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={4}
        >
          {/* Add Expense Form */}
          {isCategoriesSuccess && isPaymentMethodsSuccess && (
            <FormExpense
              categories={categories.categories}
              paymentMethods={paymentMethods.paymentMethods}
            />
          )}
        </Box>
      </Stack>
    </Flex>
  );
};

export default AddTransaction;
