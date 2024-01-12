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
import { useUpdatePaymentMethodMutation } from '../../slices/paymentMethodApiSlice';

const EditPaymentMethod = ({ onClose, paymentMethod }) => {
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod.name
  );

  const toast = useToast();

  const [updatePaymentMethodApiCall, { isLoading }] =
    useUpdatePaymentMethodMutation();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!paymentMethodName) {
      return toast({
        title: 'Please provide a payment method!',
        status: 'error',
      });
    }
    try {
      const res = await updatePaymentMethodApiCall({
        id: paymentMethod._id,
        methodName: paymentMethodName,
      }).unwrap();

      toast({ title: res.message, status: 'success' });

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
        onClick={handleUpdate}
        type='submit'
      >
        Update
      </Button>
    </Stack>
  );
};

export default EditPaymentMethod;
