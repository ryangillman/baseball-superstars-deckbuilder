import React from 'react';
import { Grid, Box, Flex } from '@chakra-ui/core';

const TrainerStatsTable = ({ stats }) => (
  <Grid
    gridTemplateColumns='repeat(6, 1fr)'
    gridTemplateRows='repeat(5, 30px)'
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
      {Object.keys(stats['1']).map((key, i) => (
        <Flex
          key={key}
          gridRow={i + 2}
          justifyContent='center'
          justifySelf='stretch'
          bg='gray.800'
        >
          {key.toUpperCase()}
        </Flex>
      ))}
      {Object.entries(stats).map(([key, value]) => (
        <React.Fragment key={key}>
          {Object.entries(value).map(([statKey, stat], i) => (
            <Flex
              key={`${statKey}`}
              gridRow={i + 2}
              justifyContent='center'
              justifySelf='stretch'
            >
              {stat}
            </Flex>
          ))}
        </React.Fragment>
      ))}
    </>
  </Grid>
);

export default TrainerStatsTable;
