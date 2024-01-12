import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import Expense from '../components/expense/Expense';
import { AddIcon, SearchIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { BsCalendar2Day } from 'react-icons/bs';
import { useGetExpensesQuery } from '../slices/expenseApiSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarContainer from '../components/CalendarContainer';
import PaginationView from '../components/PaginationView';
import { useState } from 'react';

const Expenses = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date());

  const q = {
    searchKeyword,
    page,
    startDate: startDate === null ? '' : startDate,
    endDate: endDate === null ? '' : endDate,
    // for mobile max 4 items, for the rest of screens is max 8
    limit: window.innerWidth < 500 ? 4 : 8,
  };

  const { data, isFetching, isSuccess } = useGetExpensesQuery(q, {
    skip: !q,
  });

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  return (
    <Container maxW={{ base: 'full', md: 'xl' }} p={{ base: 4, md: 10 }}>
      <Stack mb={4} spacing={2}>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <SearchIcon color='teal.400' />
          </InputLeftElement>
          <InputRightElement cursor={'pointer'}>
            <SmallCloseIcon
              w={8}
              h={8}
              color='blue.600'
              _hover={{ color: 'blue.200' }}
              onClick={() => setSearchKeyword('')}
            />
          </InputRightElement>
          <Input
            mb={4}
            borderColor='teal.400'
            focusBorderColor='teal.400'
            type='text'
            placeholder='Type something more than 3 characters...'
            value={searchKeyword}
            onChange={handleSearch}
          />
        </InputGroup>
        <HStack spacing={2} justifyContent={'space-between'}>
          <Box w={'full'}>
            <InputGroup>
              <InputLeftElement pointerEvents='none' color={'teal.400'}>
                <BsCalendar2Day />
              </InputLeftElement>
              <Input
                as={DatePicker}
                popperContainer={CalendarContainer}
                placeholderText='Start date'
                borderColor='teal.400'
                focusBorderColor='teal.400'
                dateFormat='dd/MM/yyyy'
                showMonthDropdown
                showYearDropdown
                calendarStartDay={1}
                isClearable={true}
                value={startDate}
                selected={startDate}
                onChange={(e) => {
                  setStartDate(e);
                  setPage(1);
                }}
              />
            </InputGroup>
          </Box>

          <Box w={'full'}>
            <InputGroup w={'100%'}>
              <InputLeftElement pointerEvents='none' color={'teal.400'}>
                <BsCalendar2Day />
              </InputLeftElement>
              <Input
                as={DatePicker}
                popperContainer={CalendarContainer}
                placeholderText='End date'
                borderColor='teal.400'
                focusBorderColor='teal.400'
                dateFormat='dd/MM/yyyy'
                showMonthDropdown
                showYearDropdown
                calendarStartDay={1}
                isClearable={true}
                value={endDate}
                selected={endDate}
                onChange={(e) => {
                  setEndDate(e), setPage(1);
                }}
              />
            </InputGroup>
          </Box>
        </HStack>
      </Stack>

      {isFetching && (
        <Stack align={'center'} mt={6} mb={6}>
          <Spinner size={'xl'} color='cyan.300' />
        </Stack>
      )}
      {/* If not any created expenses shows add button */}
      {data?.result === 0 && (
        <Stack align={'center'} mt={4} spacing={4}>
          <Alert status='warning' flexDirection={'column'}>
            <AlertIcon />

            <AlertTitle textAlign={'center'}>
              Seems no expenses that you are searching for...
            </AlertTitle>
            <AlertDescription>You can add a new one!</AlertDescription>
          </Alert>
          <Button
            leftIcon={<AddIcon />}
            colorScheme='teal'
            variant='solid'
            marginBottom={3}
            w={'full'}
            as={ReachLink}
            to={'/expense/add-transaction'}
          >
            Add New!
          </Button>
        </Stack>
      )}
      {/* Listing Expenses card section */}
      <Stack spacing={4}>
        {isSuccess &&
          data.result > 0 &&
          data.expenses.map((exp) => <Expense key={exp._id} expense={exp} />)}
      </Stack>
      {/* Pagination Section */}
      {data?.totalLength > q.limit && (
        <Stack mt={4}>
          <PaginationView
            totalItems={data.totalLength}
            itemsPerPage={q.limit}
            currentPage={page}
            setCurrentPage={setPage}
          />
        </Stack>
      )}
    </Container>
  );
};

export default Expenses;
