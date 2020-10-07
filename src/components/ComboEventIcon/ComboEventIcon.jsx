import { Text, Flex } from '@chakra-ui/core';
import { LinkIcon } from '@chakra-ui/icons';
import React from 'react';

const ComboEventIcon = ({ children, blinking }) => (
  <Flex
    alignItems='center'
    justifyContent='center'
    position='absolute'
    right={0}
    top={0}
    transform='translate(30%, -30%)'
    width='30px'
    height='30px'
    pointerEvents='none'
    bg='yellow.200'
    animation={blinking ? 'blinking 1s ease-in-out infinite alternate' : ''}
  >
    <LinkIcon color='gray.800' />
    <Text as='span' color='gray.800'>
      {children}
    </Text>
  </Flex>
);

export default ComboEventIcon;
