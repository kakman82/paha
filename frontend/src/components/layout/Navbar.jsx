import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { Link as ReachLink, useNavigate } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { clearCredentials } from '../../slices/authSlice';

const navLinks = ['Dashboard', 'Expenses', 'Stats', 'Places', 'Definitions'];

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [logoutApiCall] = useLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await logoutApiCall().unwrap();
      dispatch(clearCredentials());
      toast({ title: res.message, status: 'success' });
      navigate('/auth/login');
    } catch (err) {
      toast({
        title: err?.data?.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            colorScheme='teal'
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box
              textColor={'teal.400'}
              fontWeight={'semibold'}
              fontSize={'3xl'}
              as={ReachLink}
              to={'/'}
              cursor={'pointer'}
            >
              Xpenss.
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {navLinks.map((link) => (
                <ReachLink
                  key={link}
                  to={`/${link.toLowerCase()}`}
                  onClick={onClose}
                >
                  {link}
                </ReachLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Button
              variant={'solid'}
              colorScheme={'teal'}
              minW={0}
              size={'sm'}
              mr={4}
              onClick={toggleColorMode}
            >
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                variant={'solid'}
                minW={0}
                leftIcon={<FaUserCircle />}
                colorScheme='teal'
                size={'sm'}
              >
                {userInfo.firstName}
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <ReachLink to={'/profile'}>Profile</ReachLink>
                </MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem
                  as={'button'}
                  textColor={'red.400'}
                  fontWeight={'bold'}
                  onClick={handleLogout}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {navLinks.map((link) => (
                <ReachLink
                  key={link}
                  to={`/${link.toLowerCase()}`}
                  onClick={onClose}
                >
                  {link}
                </ReachLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Navbar;
