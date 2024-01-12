import {
  Flex,
  Box,
  Stack,
  Heading,
  useColorModeValue,
  Spinner,
  IconButton,
} from '@chakra-ui/react';

import { useGetAllCategoriesQuery } from '../slices/categoryApiSlice';
import { useGetAllPaymentMethodsQuery } from '../slices/paymentMethodApiSlice';
import EditExpense from '../components/expense/EditExpense';
import { useParams } from 'react-router-dom';
import { useGetOneExpenseQuery } from '../slices/expenseApiSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query';

const EditTransaction = () => {
  const { id } = useParams();

  const {
    data: itemToUpdate,
    isFetching: isItemFetching,
    isSuccess: isItemSuccess,
  } = useGetOneExpenseQuery(id ? id : skipToken);

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
      minH={'90vh'}
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
            Edit Transaction
          </Heading>
        </Stack>

        {(isItemFetching ||
          isCategoriesFetching ||
          isPaymentMethodsFetching) && (
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
          {/* Edit Expense Form */}
          {isItemSuccess && isCategoriesSuccess && isPaymentMethodsSuccess && (
            <EditExpense
              categories={categories.categories}
              paymentMethods={paymentMethods.paymentMethods}
              itemToUpdate={itemToUpdate.expense[0]}
            />
          )}
        </Box>
      </Stack>
    </Flex>
  );
};

export default EditTransaction;
