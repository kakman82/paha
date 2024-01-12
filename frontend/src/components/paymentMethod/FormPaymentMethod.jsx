import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Stack,
  useToast,
} from '@chakra-ui/react';

import { useState } from 'react';
import { useAddPaymentMethodMutation } from '../../slices/paymentMethodApiSlice';

const FormPaymentMethod = ({ onClose }) => {
  const [paymentMethodName, setPaymentMethodName] = useState('');

  const toast = useToast();

  const [addPaymentMethodApiCall, { isLoading }] =
    useAddPaymentMethodMutation();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!paymentMethodName) {
      return toast({
        title: 'Please provide a payment method!',
        status: 'error',
      });
    }
    try {
      const res = await addPaymentMethodApiCall({
        name: paymentMethodName,
      }).unwrap();

      toast({ title: res.message, status: 'success' });
      setPaymentMethodName('');

      // for closing model after clicking save button
      onClose();
    } catch (err) {
      toast({ title: err.data.message, status: 'error' });
    }
  };

  return (
    <Stack spacing={4}>
      <FormControl isRequired>
        <FormLabel>Payment Method Name</FormLabel>
        <InputGroup>
          <Input
            type='text'
            minLength={2}
            maxLength={30}
            placeholder='Enter category name'
            borderColor='teal.400'
            focusBorderColor='teal.400'
            value={paymentMethodName}
            onChange={(e) => setPaymentMethodName(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <Button
        bg={'teal.400'}
        color={'white'}
        _hover={{
          bg: 'teal.500',
        }}
        isLoading={isLoading}
        onClick={handleSave}
        type='submit'
      >
        Save
      </Button>
    </Stack>
  );
};

export default FormPaymentMethod;
