import React from 'react';
import { Grid, Heading, Input, Flex, Box, Checkbox } from '@chakra-ui/core';
import Trainer from '../Trainer';
import TrainerFilter from '../TrainerFilter';

const Trainerlist = ({
  updateSelectedTrainers,
  selectedTrainers,
  allTrainers,
  setFilters,
  updateTrainerStars,
  skillFilter,

  updateAllTrainerStars,
}) => (
  <>
    <Heading color='gray.300' mb={3}>
      Trainer List
    </Heading>
    <TrainerFilter
      {...{
        setFilters,
        updateAllTrainerStars,
        skillFilter,
      }}
    />
    <Grid
      gridTemplateColumns='repeat(auto-fill, 120px)'
      justifyContent='space-between'
      gridGap={10}
      gridColumnGap={2}
    >
      {allTrainers.map((trainer) => (
        <Trainer
          updateSelectedTrainers={updateSelectedTrainers}
          trainer={trainer}
          trainerIndex={selectedTrainers.findIndex(
            (row) => row?.name === trainer?.name
          )}
          key={trainer.name}
          updateTrainerStars={updateTrainerStars}
          showOverlay
          skillFilter={skillFilter}
        />
      ))}
    </Grid>
  </>
);

export default Trainerlist;
