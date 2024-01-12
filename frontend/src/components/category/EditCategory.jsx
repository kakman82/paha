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
import { useUpdateCategoryMutation } from '../../slices/categoryApiSlice';

const EditCategory = ({ onClose, category }) => {
  const [updatedCategory, setUpdatedCategory] = useState(category.name);
  const [color, setColor] = useState(category.color);

  const toast = useToast();

  const [updateCategoryApiCall, { isLoading }] = useUpdateCategoryMutation();

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await updateCategoryApiCall({
        categoryName: updatedCategory,
        categoryColor: color.background,
        id: category._id,
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
        <FormLabel>Edit Name</FormLabel>
        <InputGroup>
          <Input
            type='text'
            minLength={2}
            maxLength={20}
            borderColor='teal.400'
            focusBorderColor='teal.400'
            value={updatedCategory}
            onChange={(e) => setUpdatedCategory(e.target.value)}
          />
        </InputGroup>
      </FormControl>

      <FormControl mt={4} isRequired>
        <FormLabel>Select New Color</FormLabel>
        <CirclePicker
          color={color}
          onChangeComplete={(color, event) =>
            setColor({ background: color.hex })
          }
        />
      </FormControl>
      <Divider mt={4} />
      <HStack
        justifyContent={'flex-start'}
        alignItems={'center'}
        spacing={3}
        mt={4}
      >
        <Text alignItems={'center'} fontSize={'sm'} fontWeight={'semibold'}>
          Previous Selected Color:
        </Text>
        <Box boxSize={6} rounded={'full'} backgroundColor={category.color} />
      </HStack>
      <Button colorScheme='teal' isLoading={isLoading} onClick={handleUpdate}>
        Update
      </Button>
    </Stack>
  );
};

export default EditCategory;
