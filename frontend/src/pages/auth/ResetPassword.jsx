import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useResetPasswordMutation,
  useVerifyResetPasswordTokenMutation,
} from '../../slices/usersApiSlice';

const validatePassword = (pass) => {
  if (!pass.trim())
    return { valid: false, errMsg: 'Please enter your password!' };
  if (pass.length < 6)
    return { valid: false, errMsg: 'Password must be 6 characters long!' };
  return { valid: true };
};

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifying, setIsVerifiying] = useState('');

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const toast = useToast();
  const navigate = useNavigate();

  const [verifyResetPasswordTokenApiCall] =
    useVerifyResetPasswordTokenMutation();

  const [resetPasswordApiCall, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    verifyResetPasswordToken();
  }, []);

  const verifyResetPasswordToken = async () => {
    setIsVerifiying(true);
    try {
      const res = await verifyResetPasswordTokenApiCall({ token, id }).unwrap();

      if (res.verified) {
        setTimeout(() => {
          setIsVerifiying(false);
          toast({ title: 'Token is verified!', status: 'success' });
        }, 2000);
      }
    } catch (err) {
      toast({ title: err.data.message, status: 'error', duration: 10000 });
      setTimeout(() => {
        navigate('/auth/forgot-password', { replace: true });
        setIsVerifiying(false);
      }, 1500);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { valid, errMsg } = validatePassword(password);
    if (password !== confirmPassword)
      return toast({ title: 'Passwords are not match!', status: 'error' });

    if (!valid) return toast({ title: errMsg, status: 'error' });

    try {
      const res = await resetPasswordApiCall({ password, token, id }).unwrap();

      if (res.success) {
        toast({ title: res.message, status: 'success' });
        navigate('/auth/login', { replace: true });
      }
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
    >
      {isVerifying ? (
        <Stack>
          <Text textAlign={'center'} fontSize={'2xl'} color={'teal.500'}>
            We are checking your password reset token...
          </Text>
          <Progress size='lg' isIndeterminate colorScheme='teal' />
        </Stack>
      ) : (
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
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
            Enter new password
          </Heading>
          <FormControl isRequired>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                borderColor='teal.400'
                focusBorderColor='teal.400'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement h={'full'}>
                <Button
                  variant={'ghost'}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Confirm New Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                borderColor='teal.400'
                focusBorderColor='teal.400'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputRightElement h={'full'}>
                <Button
                  variant={'ghost'}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Stack spacing={6}>
            <Button
              bg={'teal.400'}
              color={'white'}
              _hover={{
                bg: 'teal.500',
              }}
              isLoading={isLoading}
              type='submit'
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </Stack>
        </Stack>
      )}
    </Flex>
  );
}
