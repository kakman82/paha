import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import FormCategory from './category/FormCategory';
import FormPaymentMethod from './paymentMethod/FormPaymentMethod';
import EditCategory from './category/EditCategory';
import EditPaymentMethod from './paymentMethod/EditPaymentMethod';

const ModalView = ({ isOpen, onClose, tab, type, itemToUpdate }) => {
  const modalBodyContent = () => {
    // tab === 0 category, tab === 1 payment Method
    if ((tab === 0) & (type === 'add')) {
      return <FormCategory onClose={onClose} />;
    }
    if ((tab === 0) & (type === 'edit')) {
      return (
        <EditCategory
          isOpen={isOpen}
          onClose={onClose}
          category={itemToUpdate}
        />
      );
    }
    if ((tab === 1) & (type === 'add')) {
      return <FormPaymentMethod onClose={onClose} />;
    }
    if ((tab === 1) & (type === 'edit')) {
      return (
        <EditPaymentMethod
          isOpen={isOpen}
          onClose={onClose}
          paymentMethod={itemToUpdate}
        />
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
      motionPreset='slideInBottom'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          textColor={'teal.400'}
          textAlign={'center'}
          fontWeight={'bold'}
          fontSize={'2xl'}
        >
          Create New!
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* Content Here*/}
          {modalBodyContent()}
        </ModalBody>

        <ModalFooter>
          <Button width={'full'} colorScheme='red' onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalView;
