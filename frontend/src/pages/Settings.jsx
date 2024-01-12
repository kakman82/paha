import {
  Flex,
  Box,
  Stack,
  useColorModeValue,
  Spinner,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
} from '@chakra-ui/react';
import SettingsTable from '../components/SettingsTable';
import { useGetCategoriesQuery } from '../slices/categoryApiSlice';
import { useGetPaymentMethodsQuery } from '../slices/paymentMethodApiSlice';

const Settings = () => {
  const {
    data: categories,
    isFetching,
    isSuccess,
    isError,
  } = useGetCategoriesQuery();

  const { data: methods } = useGetPaymentMethodsQuery();

  const toast = useToast();
  if (isError)
    return toast({ title: 'Error on fetching categories', status: 'error' });

  return (
    <Flex
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={8}
        mx={'auto'}
        width={{ base: 'lg', md: 'xl' }}
        py={12}
        px={6}
      >
        {isFetching && (
          <Stack align={'center'}>
            <Spinner size={'lg'} color='cyan.300' />
          </Stack>
        )}
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box
                  as='span'
                  flex='1'
                  fontSize={'3xl'}
                  textAlign={'center'}
                  color={'teal.400'}
                >
                  Categories
                </Box>
                <AccordionIcon color={'teal.400'} />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {isSuccess && (
                <SettingsTable props={categories} type={'category'} />
              )}
            </AccordionPanel>
          </AccordionItem>
          <Divider />
          <AccordionItem mt={20}>
            <h2>
              <AccordionButton>
                <Box
                  as='span'
                  flex='1'
                  fontSize={'3xl'}
                  textAlign={'center'}
                  color={'teal.400'}
                >
                  Payment Methods
                </Box>
                <AccordionIcon color={'teal.400'} />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {isSuccess && (
                <SettingsTable props={methods} type={'paymentMethod'} />
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </Flex>
  );
};

export default Settings;
