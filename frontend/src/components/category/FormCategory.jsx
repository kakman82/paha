import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { CirclePicker } from 'react-color';
import { useState } from 'react';
import { useCreateCategoryMutation } from '../../slices/categoryApiSlice';

const FormCategory = ({ onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [color, setColor] = useState('');

  const toast = useToast();

  const [createCategoryApiCall, { isLoading }] = useCreateCategoryMutation();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoryName || !color) {
      return toast({
        title: 'Please provide category name and color!',
        status: 'error',
      });
    }

    try {
      const res = await createCategoryApiCall({
        name: categoryName,
        color: color.background,
      }).unwrap();

      toast({ title: res.message, status: 'success' });
      setCategoryName('');
      setColor('');
      // for closing model after clicking save button
      onClose();
    } catch (err) {
      toast({ title: err.data.message, status: 'error' });
    }
  };

  return (
    <Stack spacing={4}>
      <FormControl isRequired>
        <FormLabel>Category Name</FormLabel>
        <InputGroup>
          <Input
            type='text'
            minLength={2}
            maxLength={20}
            placeholder='Enter category name'
            borderColor='teal.400'
            focusBorderColor='teal.400'
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </InputGroup>
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel>Select Color</FormLabel>
        <CirclePicker
          color={color}
          onChangeComplete={(color, event) =>
            setColor({ background: color.hex })
          }
        />
      </FormControl>

      <Divider mt={4} variant={'dashed'} />
      <HStack
        justifyContent={'flex-start'}
        alignItems={'center'}
        spacing={3}
        mt={2}
      >
        <Text alignItems={'center'} fontSize={'md'} fontWeight={'semibold'}>
          Selected Color:
        </Text>
        <Box boxSize={6} rounded={'full'} backgroundColor={color.background} />
      </HStack>
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

export default FormCategory;
