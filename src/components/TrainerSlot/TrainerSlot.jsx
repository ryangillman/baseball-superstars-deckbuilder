import React from 'react';
import { Flex, useColorMode, Text } from '@chakra-ui/core';

const TrainerSlot = ({ slotNumber }) => {
  const { colorMode } = useColorMode();
  const bgColor = { dark: 'gray.800', light: 'gray.300' };
  const color = { dark: 'gray.400', light: 'gray.700' };

  return (
    <Flex
      as='button'
      bg={bgColor[colorMode]}
      height={225}
      maxW={120}
      color={color[colorMode]}
      align='center'
      justify='center'
    >
      <Text color='gray.500' fontSize={48}>
        {slotNumber}
      </Text>
    </Flex>
  );
};

export default TrainerSlot;
