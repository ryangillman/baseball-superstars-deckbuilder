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
        p={5}
        mb={4}
        bg={bgColor[colorMode]}
        color={color[colorMode]}
      >
        <Box maxW={1200} mx='auto' flex={1}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
