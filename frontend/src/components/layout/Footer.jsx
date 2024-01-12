import {
  Box,
  Center,
  Container,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      marginTop={'auto'}
      // position={"fixed"}
      left={0}
      bottom={0}
      width={'full'}
      textAlign={'center'}
    >
      <Container py={4}>
        <Center>
          <Text>© 2023 Xpenss. All rights reserved</Text>
        </Center>
      </Container>
    </Box>
  );
}
