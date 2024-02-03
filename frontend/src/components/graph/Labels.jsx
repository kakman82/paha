import { Text } from '@chakra-ui/react';

export default function Labels({ labelData }) {
  const sortedByAmount = labelData.sort((a, b) => b.total - a.total);

  return (
    <>
      {sortedByAmount.map((el, i) => (
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
            <Text fontSize={'smaller'} fontWeight={'large'}>
              {el.catName}
            </Text>
          </div>
          <Text fontSize={'smaller'} fontWeight={'large'}>
            % {el.percentage.toFixed(2) ?? 0}
          </Text>
        </div>
      ))}
    </>
  );
}
