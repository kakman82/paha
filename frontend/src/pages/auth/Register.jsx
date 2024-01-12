import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react';
import { Link as ReachLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRegisterMutation } from '../../slices/usersApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../slices/authSlice';

// Form field validate function;
const validateUserData = ({ firstName, lastName, email, password }) => {
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // for english letters;
  // const isValidName = /^[a-z A-Z]+$/;
  // for turkish letters included
  const isValidName = /^[a-z A-Z ğüşöçıİIĞÜŞÖÇ]+$/;

  if (!firstName.trim())
    return { valid: false, errMsg: 'Please enter your first name!' };
  if (!isValidName.test(firstName))
    return { valid: false, errMsg: 'Please enter a valid first name!' };

  if (!lastName.trim())
    return { valid: false, errMsg: 'Please enter your last name!' };
  if (!isValidName.test(lastName))
    return { valid: false, errMsg: 'Please enter a valid last name!' };

  if (!email.trim())
    return { valid: false, errMsg: 'Please enter your email!' };
  if (!isValidEmail.test(email))
    return { valid: false, errMsg: 'Please enter a valid email!' };

  if (!password.trim())
    return { valid: false, errMsg: 'Please enter your password!' };
  if (password.length < 6)
    return { valid: false, errMsg: 'Password must be 6 characters long!' };

  return { valid: true };
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.isVerified) {
      navigate('/');
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { valid, errMsg } = validateUserData(userData);

    if (!valid) {
      return toast({
        title: errMsg,
        status: 'error',
        isClosable: true,
      });
    }

    try {
      const res = await register(userData).unwrap();

      dispatch(setCredentials(res.user));

      toast({ title: res.msg, status: 'success' });
      navigate('/auth/verify-email');
    } catch (err) {
      toast({
        title: err?.data?.message || err.error,
        status: 'error',
        isClosable: true,
      });
    }
  };

  const { firstName, lastName, email, password } = userData;

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
          <Text
            align={'center'}
            fontSize={'lg'}
            color={'gray.600'}
            fontWeight={'semibold'}
          >
            Sign up and enjoy ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <FormControl id='firstName' isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  type='text'
                  borderColor='teal.400'
                  focusBorderColor='teal.400'
                  name='firstName'
                  value={firstName}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl id='lastName' isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type='text'
                  borderColor='teal.400'
                  focusBorderColor='teal.400'
                  name='lastName'
                  value={lastName}
                  onChange={handleChange}
                />
              </FormControl>
            </HStack>
            <FormControl id='email' isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type='email'
                borderColor='teal.400'
                focusBorderColor='teal.400'
                name='email'
                value={email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  borderColor='teal.400'
                  focusBorderColor='teal.400'
                  name='password'
                  value={password}
                  onChange={handleChange}
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

            <Stack spacing={10} pt={2}>
              <Button
                size='lg'
                bg={'teal.400'}
                color={'white'}
                _hover={{
                  bg: 'teal.500',
                }}
                isLoading={isLoading}
                onClick={handleRegister}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text
                align={'center'}
                fontSize={'md'}
                color={'black.700'}
                fontWeight={'semibold'}
              >
                Already a user?{' '}
                <Link
                  as={ReachLink}
                  to={'/auth/login'}
                  color={'teal.400'}
                  fontWeight={'semibold'}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
