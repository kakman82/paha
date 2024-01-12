import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FiEdit, FiDelete, FiPlusSquare } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useState } from 'react';
import ModalView from './ModalView';
import DeleteAlert from './DeleteAlert';

const MenuView = ({ tabIndex, item }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteAlertModal, setOpenDeleteAlertModal] = useState(false);

  const closeEditModal = () => {
    setOpenEditModal(false);
  };

  const closeDeleteAlertModal = () => {
    setOpenDeleteAlertModal(false);
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        display={'inline-grid'}
        icon={<BsThreeDotsVertical color='teal' size={25} />}
        variant='unstyled'
      />
      <MenuList fontSize={'md'}>
        {/* Edit Section */}
        <MenuItem
          color={'cyan.500'}
          icon={<FiEdit size={16} />}
          onClick={() => setOpenEditModal(true)}
        >
          Edit
        </MenuItem>
        <ModalView
          isOpen={openEditModal}
          onClose={closeEditModal}
          tab={tabIndex}
          type={'edit'}
          itemToUpdate={item}
        />
        {/* Delete Section */}
        <MenuItem
          color={'red.500'}
          icon={<FiDelete size={16} />}
          onClick={() => setOpenDeleteAlertModal(true)}
        >
          Delete
        </MenuItem>
        <DeleteAlert
          isOpen={openDeleteAlertModal}
          onClose={closeDeleteAlertModal}
          itemId={item._id}
          tabIndex={tabIndex}
        />
      </MenuList>
    </Menu>
  );
};

export default MenuView;
