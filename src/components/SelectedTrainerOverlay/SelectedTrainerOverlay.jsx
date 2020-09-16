import React from 'react';
import { Box, Text } from '@chakra-ui/core';

const SelectedTrainerOverlay = ({ text, show }) => {
  if (!show) return null;
  return (
    <>
      <Box
        pointerEvents='none'
        bg='gray.800'
        opacity={0.7}
        position='absolute'
        top={0}
        bottom={0}
        left={0}
        right={0}
      />
      {text && (
        <Box
          borderRadius='50%'
          position='absolute'
          top={0}
          bottom={0}
          left={0}
          right={0}
          height='40px'
          width='40px'
          bg='yellow.300'
          margin='auto'
        >
          <Text
            position='absolute'
            top={0}
            bottom={0}
            left={0}
            right={0}
            height='50%'
            width='50%'
            color='gray.700'
            margin='auto'
            zIndex='20'
            display='flex'
            justifyContent='center'
            alignItems='center'
          >
            {text}
          </Text>
        </Box>
      )}
    </>
  );
};

export default SelectedTrainerOverlay;
