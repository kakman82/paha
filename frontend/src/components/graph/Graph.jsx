import { Chart, ArcElement, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Center,
  Heading,
  Select,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import Labels from './Labels';
import {
  useGetAllExpensesQuery,
  useGetExpensesByYearQuery,
} from '../../slices/expenseApiSlice';
import _ from 'lodash';
import niceNumber from '../../utils/numberFormat';
import {
  getChartData,
  getTotalByCategories,
} from '../../utils/graphDataHelper';
import { useState } from 'react';

Chart.register(ArcElement, Legend, Tooltip);

const Graph = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data, isFetching, isSuccess } = useGetAllExpensesQuery();

  const { data: expensesByYear, isSuccess: isYearlySuccess } =
    useGetExpensesByYearQuery(selectedYear);

  let chartData;
  let totalByCategories;

  if (isYearlySuccess) {
    chartData = getChartData(expensesByYear.expensesByGivenYear);
    totalByCategories = getTotalByCategories(
      expensesByYear.expensesByGivenYear
    );
  }

  return (
    <Box>
      {isFetching && (
        <Stack align={'center'} mt={6} mb={6}>
          <Spinner size={'xl'} color='cyan.300' />
        </Stack>
      )}
      {isSuccess && isYearlySuccess && (
        <>
          <Center h={'75px'} w={'100%'} justifyContent={'center'}>
            <Select
              width={'25%'}
              textAlign={'center'}
              borderColor='teal.400'
              focusBorderColor='teal.400'
              size={'sm'}
              name='selectedYear'
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {data.years.map((el, i) => (
                <option key={i} value={el}>
                  {el}
                </option>
              ))}
            </Select>
          </Center>
          <Doughnut data={chartData.data} options={chartData.options} />
          <Box position={'relative'} textAlign={'center'}>
            <Heading
              position={'absolute'}
              m={'auto'}
              left={50}
              right={50}
              top={{ base: -190, md: -300 }}
            >
              Total
              <Text
                display={'block'}
                size='3xl'
                color='teal'
                fontWeight={'extrabold'}
              >
                {niceNumber(chartData.data.total)}
              </Text>
            </Heading>
          </Box>
          <Labels labelData={totalByCategories} />
        </>
      )}
    </Box>
  );
};

export default Graph;
