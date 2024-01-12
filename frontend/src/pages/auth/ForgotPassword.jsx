import {
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import validateEmail from '../../utils/validateEmail';
import { useForgotPasswordMutation } from '../../slices/usersApiSlice';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const toast = useToast();

  const [forgotPasswordApiCall, { isLoading }] = useForgotPasswordMutation();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const { valid, errMsg } = validateEmail(email);

    if (!valid) return toast({ title: errMsg, status: 'error' });

    try {
      const res = await forgotPasswordApiCall({ email }).unwrap();
      toast({ title: res.message, status: 'success', duration: 10000 });
    } catch (err) {
      toast({ title: err.data.message, status: 'error' });
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
      p={2}
    >
      <Stack
        spacing={4}
        w={'full'}
        width={{ base: 'lg', md: 'xl' }}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading
          textAlign={'center'}
          lineHeight={1.1}
          fontSize={{ base: '2xl', md: '3xl' }}
        >
          Forgot your password?
        </Heading>
        <Text
          textAlign={'center'}
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          You&apos;ll get an email with a reset link
        </Text>
        <FormControl id='email'>
          <Input
            placeholder='your-email@example.com'
            _placeholder={{ color: 'gray.500' }}
            borderColor='teal.400'
            focusBorderColor='teal.400'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'teal'}
            color={'white'}
            _hover={{
              bg: 'teal.500',
            }}
            isLoading={isLoading}
            onClick={handleForgotPassword}
          >
            Request Reset Link
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
