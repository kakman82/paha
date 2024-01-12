import { Text } from '@chakra-ui/react';

const obj = [
  { color: 'rgb(255, 99, 132)', type: 'Market', percentage: 60 },
  { color: 'rgb(54, 162, 235)', type: 'Giyim', percentage: 10 },
  { color: 'rgb(255, 205, 86)', type: 'Yemek', percentage: 30 },
];

export default function Labels() {
  return (
    <>
      {obj.map((el, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: 2 }}>
            <div
              style={{
                width: '5px',
                height: '20px',

                backgroundColor: el.color ?? 'white',
                padding: '3px',
                marginRight: '8px',
              }}
            ></div>
            <Text size='sm' weight='bold'>
              {el.type ?? ' '}
            </Text>
          </div>
          <Text size='sm' weight='bolder'>
            % {el.percentage ?? 0}
          </Text>
        </div>
      ))}
    </>
  );
}
