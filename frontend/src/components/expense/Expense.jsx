import { Card, CardBody, Stack, Text } from '@chakra-ui/react';
import niceNumber from '../../utils/numberFormat';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import EditExpense from './EditExpense';
import { useState } from 'react';
import EditTransaction from '../../pages/EditTransaction';

const Expense = ({ expense }) => {
  const navigate = useNavigate();

  const [goToEditPage, sertGoToEditPage] = useState(false);

  const handleClick = () => {
    sertGoToEditPage(true);
    navigate(`/expense/edit-transaction/${expense._id}`);
  };
  return (
    <Card
      variant={'elevated'}
      cursor={'pointer'}
      _hover={{ opacity: 0.5 }}
      onClick={handleClick}
    >
      <CardBody p={2}>
        {goToEditPage && <EditTransaction itemToUpdate={expense} />}
        <Stack
          direction={'row'}
          align={'center'}
          borderLeft={'4px'}
          borderLeftColor={expense?.category?.color}
          justifyContent={'space-between'}
          w={'full'}
          p={0.5}
        >
          <Stack direction={'column'} fontSize={'sm'} marginLeft={1.5}>
            <Text fontWeight={600} fontSize={'lg'}>
              {expense?.category ? expense?.category.name : 'Unknown?'}
            </Text>
            <Text noOfLines={[1]} maxWidth={220} color={'gray.500'}>
              {expense?.title}
            </Text>
          </Stack>
          <Stack direction={'column'} fontSize={'sm'} textAlign={'right'}>
            <Text fontWeight={600} textColor={'red.500'} fontSize={'md'}>
              {niceNumber(expense?.amount)}
            </Text>
            <Text color={'gray.500'}>
              {format(new Date(expense?.date), 'E, dd MMM yyyy ')}
            </Text>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default Expense;
