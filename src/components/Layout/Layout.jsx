import React from 'react';
import { Box, useColorMode, Flex } from '@chakra-ui/core';
import Header from '../Header';

const Layout = ({ children }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.200', dark: 'gray.700' };
  const color = { light: 'white', dark: 'gray.800' };

  return (
    <Flex flexDirection='column' minHeight='100vh'>
      <Header />
      <Flex
        flex='1'
        p={[3, 3, 5, 5]}
        mb={4}
        bg={bgColor[colorMode]}
        color={color[colorMode]}
      >
        <Box maxW={['100%', null, null, 1200]} flex='0 0 100%' mx='auto'>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
