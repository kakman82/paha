import { Card, CardBody, CardHeader, Divider, Heading } from '@chakra-ui/react';
import Expense from './Expense';

const LatestTransaction = () => {
  return (
    <Card border={'1px'} borderColor={'teal.400'} p={0} marginBottom={3}>
      <CardHeader
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Heading size={'md'} color={'teal.400'}>
          June 12, 2023
        </Heading>
        <Heading size={'md'} color={'teal.400'}>
          $ -1380
        </Heading>
      </CardHeader>
      <Divider />
      <CardBody>
        {/* Latest Expenses Go Here */}
        {/* <Expense /> */}
      </CardBody>
    </Card>
  );
};

export default LatestTransaction;
