import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Link as ReachLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('test.user@test.com');
  const [password, setPassword] = useState('123456');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [loginApiCall, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo !== null && userInfo.isVerified) {
      navigate('/');
    }
  }, [userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast({
        title: 'Please enter your email and password!',
        status: 'error',
        isClosable: true,
      });
    }
    try {
      const res = await loginApiCall({ email, password }).unwrap();

      const payload = {
        user: res.user,
        token: res.token,
      };

      dispatch(setCredentials(payload));

      if (res.user.isVerified) {
        navigate('/');
        toast({ title: res.message, status: 'success' });
      } else {
        navigate('/auth/verify-email', { replace: true });
        toast({
          title: 'Your email is not verified yet. Please check your email!',
          status: 'warning',
          duration: 10000,
        });
      }
    } catch (err) {
      toast({
        title: err?.data?.message || err.error,
        status: 'error',
      });
    }
  };

  return (
    <Flex
      minH={'100vh'}
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
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'} color={'teal.400'}>
            Xpenss.
          </Heading>
          <Text fontSize={'xl'} color={'gray.600'} fontWeight={'semibold'}>
            Sign in to your account ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl isRequired={true}>
              <FormLabel>Email address</FormLabel>
              <Input
                borderColor='teal.400'
                focusBorderColor='teal.400'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  borderColor='teal.400'
                  focusBorderColor='teal.400'
                  type={showPassword ? 'text' : 'password'}
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
            <Stack spacing={10}>
              <Stack
                direction={'row'}
                align={'start'}
                justify={'space-between'}
              >
                <Link as={ReachLink} to={'/forgot-password'} color={'teal.400'}>
                  Forgot password?
                </Link>
              </Stack>
              <Button
                bg={'teal.400'}
                color={'white'}
                _hover={{
                  bg: 'teal.500',
                }}
                isLoading={isLoading}
                onClick={handleLogin}
                type='submit'
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text
                align={'center'}
                fontSize={'md'}
                color={'black.700'}
                fontWeight={'semibold'}
              >
                Don&apos;t you have an accout? <br />
                Please{' '}
                <Link
                  as={ReachLink}
                  to={'/auth/register'}
                  color={'teal'}
                  fontWeight={'semibold'}
                >
                  Sign up!
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
