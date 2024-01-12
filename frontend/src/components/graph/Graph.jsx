import { Chart, ArcElement, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Box, Heading, Text } from '@chakra-ui/react';
import Labels from './Labels';

Chart.register(ArcElement, Legend, Tooltip);

const config = {
  data: {
    labels: ['Market', 'Giyim', 'Yemek'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        borderWidth: 1,
        hoverOffset: 1,
        spacing: 10,
      },
    ],
  },
  options: {
    cutout: '75%',
  },
};

const Graph = () => {
  return (
    <Box>
      <Doughnut data={config.data} options={config.options} />
      <Box position={'relative'} textAlign={'center'}>
        <Heading
          position={'absolute'}
          m={'auto'}
          left={50}
          right={10}
          top={{ base: -250, md: -300 }}
        >
          Total
          <Text display={'block'} size='3xl' color='teal'>
            $ 10.000,00
          </Text>
        </Heading>
      </Box>
      <Labels />
    </Box>
  );
};

export default Graph;
