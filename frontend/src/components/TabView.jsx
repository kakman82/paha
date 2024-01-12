import {
  Button,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import TableView from './TableView';
import ModalView from './ModalView';
import { AddIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import PaginationView from './PaginationView';

const TabView = ({
  categoriesData,
  paymentMethodsData,
  setCategoryPage,
  setPaymentMethodPage,
  limitCategory,
  limitPaymentMethod,
  categoryPage,
  paymentMethodPage,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [openModel, setOpenModal] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
  };
  return (
    <Tabs
      isFitted
      variant='enclosed'
      colorScheme='teal'
      onChange={(index) => setTabIndex(index)}
    >
      <TabList mb={1}>
        <Tab fontSize={'2xl'} fontWeight={'semibold'}>
          Categories
        </Tab>
        <Tab fontSize={'2xl'} fontWeight={'semibold'}>
          Payment Methods
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {/* Categories Tab */}
          <HStack justify={'flex-start'}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme='teal'
              size={'sm'}
              w={'full'}
              mb={4}
              onClick={() => setOpenModal(true)}
            >
              Add New
            </Button>
            <ModalView
              isOpen={openModel}
              onClose={closeModal}
              tab={tabIndex}
              type={'add'}
            />
          </HStack>
          <TableView items={categoriesData?.categories} tabIndex={0} />
          {categoriesData?.totalLength > limitCategory && (
            <Stack mt={4}>
              <PaginationView
                totalItems={categoriesData.totalLength}
                itemsPerPage={limitCategory}
                setCurrentPage={setCategoryPage}
                currentPage={categoryPage}
              />
            </Stack>
          )}
        </TabPanel>
        <TabPanel>
          {/* Payment Methods Tab */}
          <HStack justify={'flex-end'}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme='teal'
              size={'sm'}
              w={'full'}
              mb={4}
              onClick={() => setOpenModal(true)}
            >
              Add New
            </Button>
            <ModalView
              isOpen={openModel}
              onClose={closeModal}
              tab={tabIndex}
              type={'add'}
            />
          </HStack>
          <TableView items={paymentMethodsData?.paymentMethods} tabIndex={1} />
          {paymentMethodsData?.totalLength > limitPaymentMethod && (
            <Stack mt={4}>
              <PaginationView
                totalItems={paymentMethodsData?.totalLength}
                itemsPerPage={limitPaymentMethod}
                setCurrentPage={setPaymentMethodPage}
                currentPage={paymentMethodPage}
              />
            </Stack>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TabView;
