import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import ModalView from '../ModalView';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateExpenseMutation } from '../../slices/expenseApiSlice';

import { NumericFormat } from 'react-number-format';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsCalendar2Day } from 'react-icons/bs';
import CalendarContainer from '../CalendarContainer';

const FormExpense = ({ categories, paymentMethods }) => {
  const [transaction, setTransaction] = useState({
    category: '',
    title: '',
    amount: null,
    method: '',
    desc: '',
  });
  const [date, setDate] = useState(new Date());

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const [createExpenseApiCall, { isLoading }] = useCreateExpenseMutation();

  // to get browser locale :https://bobbyhadz.com/blog/javascript-get-user-locale#:~:text=To%20get%20the%20user%27s%20locale,languages%5B0%5D%20.
  const userLocale = navigator.language;

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiData = {
        categoryId: transaction.category,
        paymentMethodId: transaction.method,
        title: transaction.title,
        // convert amount to TR format and a number by * 1
        amount: transaction.amount.replace('.', '').replace(',', '.') * 1,
        date: date,
        desc: transaction.desc,
      };

      const res = await createExpenseApiCall(apiData).unwrap();
      toast({ title: res.message, status: 'success' });
      navigate('/');
    } catch (err) {
      toast({ title: err.data.message, status: 'error' });
    }
  };

  return (
    <Stack spacing={4}>
      <FormControl isRequired={true}>
        <HStack justifyContent={'space-between'} align={'center'}>
          <FormLabel>Category</FormLabel>
          <Button
            size='xs'
            colorScheme='teal'
            variant={'solid'}
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Add New!
          </Button>
          <ModalView
            isOpen={isCategoryModalOpen}
            onClose={closeCategoryModal}
            tab={0}
            type={'add'}
          />
        </HStack>

        <Select
          placeholder='Select a category...'
          borderColor='teal.400'
          focusBorderColor='teal.400'
          name='category'
          value={transaction.category}
          onChange={handleChange}
        >
          {categories?.length > 0 &&
            categories.map((el) => (
              <option key={el._id} value={el._id}>
                {el.name}
              </option>
            ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Date</FormLabel>
        <div
          style={{
            width: '100%',
            display: 'inline-grid',
          }}
        >
          <InputGroup>
            <InputLeftElement pointerEvents='none' color={'teal.400'}>
              <BsCalendar2Day />
            </InputLeftElement>
            <Input
              as={DatePicker}
              popperContainer={CalendarContainer}
              placeholderText='Select date'
              required
              borderColor='teal.400'
              focusBorderColor='teal.400'
              dateFormat='dd/MM/yyyy'
              showMonthDropdown
              showYearDropdown
              selected={date}
              // locale={tr}
              calendarStartDay={1}
              value={date}
              onChange={(e) => setDate(e)}
            />
          </InputGroup>
        </div>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
        <InputGroup>
          <Input
            type='text'
            placeholder='A short title of expense'
            minLength={2}
            maxLength={100}
            borderColor='teal.400'
            focusBorderColor='teal.400'
            name='title'
            value={transaction.title}
            onChange={handleChange}
          />
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Amount</FormLabel>

        <Input
          as={NumericFormat}
          placeholder='Enter the amount'
          borderColor='teal.400'
          focusBorderColor='teal.400'
          allowNegative={false}
          decimalSeparator={','}
          thousandSeparator={'.'}
          decimalScale={2}
          fixedDecimalScale={true}
          name='amount'
          value={transaction.amount}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl isRequired={true}>
        <HStack justifyContent={'space-between'} align={'center'}>
          <FormLabel>Payment Method</FormLabel>
          <Button
            size='xs'
            colorScheme='teal'
            variant={'solid'}
            onClick={() => setIsPaymentModalOpen(true)}
          >
            Add New!
          </Button>
          <ModalView
            isOpen={isPaymentModalOpen}
            onClose={closePaymentModal}
            tab={1}
            type={'add'}
          />
        </HStack>
        <Select
          placeholder={'Select a payment method...'}
          borderColor='teal.400'
          focusBorderColor='teal.400'
          name='method'
          value={transaction.method}
          onChange={handleChange}
        >
          {paymentMethods?.map((el) => (
            <option key={el._id} value={el._id}>
              {el.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          borderColor='teal.400'
          focusBorderColor='teal.400'
          placeholder='Enter some details of this expense'
          minLength={3}
          maxLength={200}
          name='desc'
          value={transaction.desc}
          onChange={handleChange}
        />
      </FormControl>
      <Stack spacing={10}>
        <Button
          bg={'teal.400'}
          color={'white'}
          _hover={{
            bg: 'teal.500',
          }}
          type='submit'
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};

export default FormExpense;
