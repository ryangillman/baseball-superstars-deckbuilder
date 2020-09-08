import React from 'react';
import { useColorMode, Flex, Box, Heading } from '@chakra-ui/core';

const Header = (props) => {
  const { colorMode } = useColorMode();
  const bgColor = {
    header: { light: 'gray.300', dark: 'gray.800' },
    button: { light: 'gray.700', dark: 'gray.200' },
  };
  const color = {
    button: { light: 'gray.300', dark: 'gray.700' },
    header: { light: 'gray.800', dark: 'white' },
  };
  return (
    <Box
      as='header'
      className='App-header'
      bg={bgColor.header[colorMode]}
      px={[3, 3, 5, 5]}
    >
      <Flex mx='auto' align='center' maxW={1200} flex={1}>
        <Flex flexGrow={1} justify='space-between'>
          <Heading color={color.header[colorMode]} size={['md', 'lg']}>
            Baseball Superstars 2020 - Deck Builder
          </Heading>
        </Flex>
      </Flex>
      {/* <IconButton
        position='absolute'
        right={40}
        bg={bgColor.button[colorMode]}
        color={color.button[colorMode]}
        icon={colorMode === 'dark' ? 'sun' : 'moon'}
        alt='Toggle Color Mode'
        onClick={toggleColorMode}
      /> */}
    </Box>
  );
};

export default Header;
