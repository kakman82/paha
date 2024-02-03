import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  useToast,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useUpdateUserProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

// Form field validate function;
const validateUserData = ({ firstName, lastName, email }) => {
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

  return { valid: true };
};

export default function Profile() {
  const { userInfo } = useSelector((state) => state.auth);

  const [userToUpdate, setUserToUpdate] = useState({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
  });

  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const [updateProfileApiCall, { isLoading, isError }] =
    useUpdateUserProfileMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserToUpdate({ ...userToUpdate, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { valid, errMsg } = validateUserData(userToUpdate);

    if (!valid) {
      return toast({
        title: errMsg,
        status: 'error',
        isClosable: true,
      });
    }
    const apiData = {
      id: userInfo._id,
      firstName: userToUpdate.firstName,
      lastName: userToUpdate.lastName,
      email: userToUpdate.email,
    };

    try {
      const res = await updateProfileApiCall(apiData).unwrap();

      console.log(res);

      dispatch(setCredentials(res.updatedProfile));

      toast({ title: res.message, status: 'success' });
    } catch (err) {
      console.log(err);
      toast({ title: err.data.message || err, status: 'error' });
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
          lineHeight={1.1}
          fontSize={{ base: '2xl', sm: '3xl' }}
          textAlign={'center'}
        >
          User Profile Edit
        </Heading>
        <FormControl id='userName'>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size='xl' bg='teal.500' />
            </Center>
          </Stack>
        </FormControl>
        <FormControl id='firstName' isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            borderColor='teal.400'
            focusBorderColor='teal.400'
            type='text'
            name='firstName'
            value={userToUpdate.firstName}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id='lastName' isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            borderColor='teal.400'
            focusBorderColor='teal.400'
            type='text'
            name='lastName'
            value={userToUpdate.lastName}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id='email' isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            borderColor='teal.400'
            focusBorderColor='teal.400'
            type='email'
            name='email'
            value={userToUpdate.email}
            onChange={handleChange}
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w='full'
            _hover={{
              bg: 'red.500',
            }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            w='full'
            bg={'teal.400'}
            color={'white'}
            _hover={{
              bg: 'teal.500',
            }}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
