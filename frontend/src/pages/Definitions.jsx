import {
  Flex,
  Spinner,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useGetCategoriesQuery } from '../slices/categoryApiSlice';
import { useGetPaymentMethodsQuery } from '../slices/paymentMethodApiSlice';
import TabView from '../components/TabView';
import { useState } from 'react';

const Definitions = () => {
  const [categoryPage, setCategoryPage] = useState(1);
  const [paymentMethodPage, setPaymentMethodPage] = useState(1);

  const qCategory = {
    page: categoryPage,
    limit: window.innerWidth < 500 ? 4 : 8,
  };

  const qPaymentMethod = {
    page: paymentMethodPage,
    limit: window.innerWidth < 500 ? 4 : 8,
  };

  const {
    data: categoriesData,
    isFetching: isFetchingCat,
    isError: isErrorCat,
    isSuccess: isSuccessCat,
  } = useGetCategoriesQuery(qCategory, { skip: !qCategory });

  const {
    data: paymentMethodsData,
    isFetching: isFetchingPay,
    isError: isErrorPay,
    isSuccess: isSuccessPay,
  } = useGetPaymentMethodsQuery(qPaymentMethod, { skip: !qPaymentMethod });

  const toast = useToast();

  if (isErrorCat || isErrorPay)
    return toast({ title: 'Error on fetching items...', status: 'error' });

  return (
    <Flex
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={8}
        mx={'auto'}
        width={{ base: 'lg', md: '3xl' }}
        py={12}
        px={6}
      >
        {(isFetchingCat || isFetchingPay) && (
          <Stack align={'center'}>
            <Spinner size={'lg'} color='cyan.300' />
          </Stack>
        )}
        {/* Tab View Section Both Categories and Payment Methods */}
        <TabView
          categoriesData={isSuccessCat && categoriesData}
          paymentMethodsData={isSuccessPay && paymentMethodsData}
          setCategoryPage={setCategoryPage}
          setPaymentMethodPage={setPaymentMethodPage}
          limitCategory={qCategory.limit}
          limitPaymentMethod={qPaymentMethod.limit}
          categoryPage={categoryPage}
          paymentMethodPage={paymentMethodPage}
        />
      </Stack>
    </Flex>
  );
};

export default Definitions;
