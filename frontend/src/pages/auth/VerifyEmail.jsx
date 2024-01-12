import { Center, Heading, Toast, useToast } from '@chakra-ui/react';
import {
  Button,
  FormControl,
  Flex,
  Stack,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { PinInput, PinInputField } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useResendEmailVerificationTokenMutation,
  useVerifyEmailMutation,
} from '../../slices/usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { setEmailVerify } from '../../slices/authSlice';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [verifyEmailApiCall, { isLoading }] = useVerifyEmailMutation();
  const [resendEmailVerificationTokenApiCall] =
    useResendEmailVerificationTokenMutation();

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/auth/login');
    }
  }, [userInfo]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      return toast({
        title: 'Please enter 4 digit code!',
        status: 'error',
      });
    }
    try {
      const res = await verifyEmailApiCall({
        userId: userInfo._id,
        otp,
      }).unwrap();

      dispatch(setEmailVerify());
      toast({ title: res.message, status: 'success' });
      navigate('/');
    } catch (err) {
      toast({
        title: err.data.message,
        status: 'error',
      });
    }
  };
  let loadingForResend = false;
  const handleRequestNewToken = async (e) => {
    e.preventDefault();
    try {
      loadingForResend = true;
      const res = await resendEmailVerificationTokenApiCall({
        userId: userInfo._id,
      });

      if (res.error) {
        toast({
          title: res.error?.data?.message,
          status: 'error',
        });
      }
      if (res.data?.message) {
        toast({
          title: res.data?.message,
          status: 'success',
        });
      }
      loadingForResend = false;
    } catch (err) {
      toast({
        title: err,
        status: 'error',
      });
      loadingForResend = false;
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
        mx={'auto'}
        width={{ base: 'lg', md: 'xl' }}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={10}
      >
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Verify your Email
          </Heading>
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          We have sent code to your email
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          fontWeight='bold'
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          {userInfo?.email}
        </Center>
        <FormControl>
          <Center>
            <HStack>
              <PinInput size={'lg'} onChange={(e) => setOtp(e)}>
                <PinInputField
                  borderColor='teal.400'
                  focusBorderColor='teal.400'
                />
                <PinInputField
                  borderColor='teal.400'
                  focusBorderColor='teal.400'
                />
                <PinInputField
                  borderColor='teal.400'
                  focusBorderColor='teal.400'
                />
                <PinInputField
                  borderColor='teal.400'
                  focusBorderColor='teal.400'
                />
              </PinInput>
            </HStack>
          </Center>
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={'teal.500'}
            color={'white'}
            _hover={{
              bg: 'teal.400',
            }}
            type='submit'
            isLoading={isLoading}
            onClick={handleVerifyEmail}
          >
            Verify
          </Button>
          <Button
            bg={'red.500'}
            color={'white'}
            _hover={{
              bg: 'red.400',
            }}
            type='submit'
            isLoading={loadingForResend}
            onClick={handleRequestNewToken}
          >
            Request New Code!
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
