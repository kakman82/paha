import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteCategoryMutation } from '../slices/categoryApiSlice';
import { useDeletePaymentMethodMutation } from '../slices/paymentMethodApiSlice';
import { useDeleteExpenseMutation } from '../slices/expenseApiSlice';

const DeleteAlert = ({ isOpen, onClose, tabIndex, itemId }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const navigate = useNavigate();

  let itemType = '';
  if (tabIndex === 0) {
    itemType = 'Category';
  } else if (tabIndex === 1) {
    itemType = 'Payment Method';
  } else if (tabIndex === 2) {
    itemType = 'Expense';
  }

  const [deleteCategoryApiCall, { isLoading: isLoadinCat }] =
    useDeleteCategoryMutation();
  const [deletePaymentMethodApiCall, { isLoading: isLoadingPay }] =
    useDeletePaymentMethodMutation();

  const [deleteExpenseApiCall, { isLoading: isLoadingExpense }] =
    useDeleteExpenseMutation();

  const handleDelete = async () => {
    if (tabIndex === 0) {
      try {
        const res = await deleteCategoryApiCall(itemId).unwrap();
        onClose();
        toast({ title: res.message, status: 'success' });
      } catch (err) {
        toast({ title: err.data.message, status: 'error' });
      }
    }
    if (tabIndex === 1) {
      try {
        const res = await deletePaymentMethodApiCall(itemId).unwrap();
        onClose();
        toast({ title: res.message, status: 'success' });
      } catch (err) {
        toast({ title: err.data.message, status: 'error' });
      }
    }
    if (tabIndex === 2) {
      try {
        const res = await deleteExpenseApiCall(itemId).unwrap();
        onClose();
        toast({ title: 'Expense has been deleted!', status: 'success' });
        navigate(-1);
      } catch (err) {
        toast({ title: err.data.message, status: 'error' });
      }
    }
  };

  return (
    <>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader textColor={'red.500'}>
            Delete {itemType}?
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Alert
              status='error'
              variant='subtle'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              height='250px'
            >
              <AlertIcon boxSize='40px' mr={0} />
              <AlertTitle mt={4} mb={1} fontSize='lg'>
                Are you sure you want to permanently remove this item?
              </AlertTitle>
              <AlertDescription maxWidth='sm'>
                You cannot undo this action!
                <br />
                Or you can give a try to edit...
              </AlertDescription>
            </Alert>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme='red'
              ml={3}
              isLoading={
                tabIndex === 0
                  ? isLoadinCat
                  : tabIndex === 1
                  ? isLoadingPay
                  : isLoadingExpense
              }
              onClick={handleDelete}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteAlert;
