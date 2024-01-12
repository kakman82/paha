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
import {
  useDeleteExpenseMutation,
  useUpdateExpenseMutation,
} from '../../slices/expenseApiSlice';
import DeleteAlert from '../DeleteAlert';

import { NumericFormat } from 'react-number-format';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsCalendar2Day } from 'react-icons/bs';
import CalendarContainer from '../CalendarContainer';

const EditExpense = ({ categories, paymentMethods, itemToUpdate }) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [openDeleteAlertModal, setOpenDeleteAlertModal] = useState(false);

  const [date, setDate] = useState(new Date(itemToUpdate.date));

  const [transaction, setTransaction] = useState({
    expense: itemToUpdate._id,
    category: itemToUpdate.category._id,
    title: itemToUpdate.title,
    amount: itemToUpdate.amount,
    method: itemToUpdate.paymentMethod._id,
    desc: itemToUpdate.desc,
  });

  const toast = useToast();
  const navigate = useNavigate();

  const [updateExpenseApiCall, { isLoading: updateLoading }] =
    useUpdateExpenseMutation();

  const [deleteExpenseApiCall, { isLoading: deleteLoading }] =
    useDeleteExpenseMutation();

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const apiData = {
        expenseId: transaction.expense,
        categoryId: transaction.category,
        paymentMethodId: transaction.method,
        title: transaction.title,
        // convert amount to TR format and a number by * 1
        amount:
          typeof transaction.amount === 'number'
            ? transaction.amount
            : transaction.amount.replace('.', '').replace(',', '.') * 1,

        date: date,
        desc: transaction.desc,
      };

      const res = await updateExpenseApiCall(apiData).unwrap();
      toast({ title: res.message, status: 'success' });
      navigate('/');
    } catch (err) {
      console.log(err);
      toast({ title: err.data.message || err, status: 'error' });
    }
  };

  const closeDeleteAlertModal = () => {
    setOpenDeleteAlertModal(false);
  };

  // const handleDelete = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await deleteExpenseApiCall(itemToUpdate._id).unwrap();
  //     navigate(-1);
  //     toast({ title: 'Expense has been deleted!', status: 'success' });
  //   } catch (err) {
  //     toast({ title: err.data.message, status: 'error' });
  //   }
  // };

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
          borderColor='teal.400'
          focusBorderColor='teal.400'
          name='category'
          placeholder={itemToUpdate.category.name}
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
              required
              borderColor='teal.400'
              focusBorderColor='teal.400'
              dateFormat='dd/MM/yyyy'
              showMonthDropdown
              showYearDropdown
              calendarStartDay={1}
              selected={new Date(date)}
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
          borderColor='teal.400'
          focusBorderColor='teal.400'
          name='method'
          placeholder={itemToUpdate.paymentMethod.name}
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
      <Stack spacing={5}>
        <Button
          bg={'teal.400'}
          color={'white'}
          _hover={{
            bg: 'teal.500',
          }}
          type='submit'
          isLoading={updateLoading}
          onClick={handleUpdate}
        >
          Update
        </Button>
        <Button
          bg={'red.400'}
          color={'white'}
          _hover={{
            bg: 'red.500',
          }}
          type='submit'
          isLoading={deleteLoading}
          onClick={() => setOpenDeleteAlertModal(true)}
        >
          Delete
        </Button>
        <Button
          bg={'blue.400'}
          color={'white'}
          _hover={{
            bg: 'blue.500',
          }}
          type='submit'
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </Stack>
      {/* TODO: token hatası veriyor!!! */}
      <DeleteAlert
        isOpen={openDeleteAlertModal}
        onClose={closeDeleteAlertModal}
        itemId={itemToUpdate._id}
        tabIndex={2}
      />
    </Stack>
  );
};

export default EditExpense;
