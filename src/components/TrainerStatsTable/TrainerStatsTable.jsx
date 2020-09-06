import React from 'react';
import { Grid, Box, Flex } from '@chakra-ui/core';

const TrainerStatsTable = ({ stats }) => (
  <Grid
    gridTemplateColumns='repeat(6, 1fr)'
    gridTemplateRows='repeat(4, 30px)'
    gridGap={1}
    rowGap={1}
    alignItems='center'
    justifyItems='center'
  >
    <Box />
    <>
      {Object.keys(stats).map((row) => (
        <Flex
          key={row}
          alignItems='center'
          justifySelf='stretch'
          bg='gray.800'
          justifyContent='center'
        >
          {row}*
        </Flex>
      ))}
    </>
    <>
      <Flex justifyContent='center' justifySelf='stretch' bg='gray.800'>
        STR
      </Flex>
      {Object.values(stats).map((row) => (
        <Flex
          key={row.STR}
          justifyContent='center'
          justifySelf='stretch'
          aligntItems='center'
        >
          {row.STR}
        </Flex>
      ))}
      <Flex
        justifyContent='center'
        justifySelf='stretch'
        aligntItems='center'
        bg='gray.800'
      >
        INT
      </Flex>
      {Object.values(stats).map((row) => (
        <Flex justifyContent='center' aligntItems='center' key={row.INT}>
          {row.INT}
        </Flex>
      ))}
      <Flex
        justifyContent='center'
        aligntItems='center'
        bg='gray.800'
        justifySelf='stretch'
      >
        DEX
      </Flex>
      {Object.values(stats).map((row) => (
        <Flex justifyContent='center' key={row.DEX} aligntItems='center'>
          {row.DEX}
        </Flex>
      ))}
      <Flex
        justifyContent='center'
        aligntItems='center'
        bg='gray.800'
        justifySelf='stretch'
      >
        MNT
      </Flex>
      {Object.values(stats).map((row) => (
        <Flex justifyContent='center' key={row.MNT} aligntItems='center'>
          {row.MNT}
        </Flex>
      ))}
    </>
  </Grid>
);

export default TrainerStatsTable;
