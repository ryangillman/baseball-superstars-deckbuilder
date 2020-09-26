import React from 'react';
import { Box, useColorMode, Flex, Button } from '@chakra-ui/core';
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
        bg={bgColor[colorMode]}
        color={color[colorMode]}
      >
        <Box maxW={['100%', null, null, 1200]} flex='0 0 100%' mx='auto'>
          {children}
        </Box>
      </Flex>
      <Flex
        as='footer'
        p={3}
        justifyContent='center'
        flex='0 0 auto'
        bg='gray.800'
        color='blue.300'
      >
        <Button
          as='a'
          colorScheme='blue'
          href={`https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${process.env.REACT_APP_PAYPAL_ID}&source=url`}
        >
          Donate
        </Button>
      </Flex>
    </Flex>
  );
};

export default Layout;
