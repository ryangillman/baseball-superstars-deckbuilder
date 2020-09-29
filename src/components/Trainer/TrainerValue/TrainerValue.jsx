import { Flex, Text } from '@chakra-ui/core';
import React from 'react';

const TrainerValue = ({ trainerValue }) => (
  <Flex
    alignItems='center'
    justifyContent='center'
    position='absolute'
    right={0}
    left='5px'
    top='5px'
    width='30px'
    height='30px'
    pointerEvents='none'
    bg='gray.200'
  >
    <Text>{trainerValue}</Text>
  </Flex>
);

export default React.memo(TrainerValue);
