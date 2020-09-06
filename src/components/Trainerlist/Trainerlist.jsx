import React from 'react';
import { Grid, Heading } from '@chakra-ui/core';
import Trainer from '../Trainer';

const Trainerlist = ({
  updateSelectedTrainers,
  selectedTrainers,
  allTrainers,
  updateTrainerStars,
}) => (
  <>
    <Heading color='gray.300' mb={3}>
      Trainer List
    </Heading>
    <Grid
      gridTemplateColumns='repeat(9, auto)'
      justifyContent='space-between'
      gridGap={10}
      gridColumnGap={2}
    >
      {allTrainers.map((trainer, i) => (
        <Trainer
          updateSelectedTrainers={() => updateSelectedTrainers(trainer.name)}
          selectedTrainers={selectedTrainers}
          trainer={trainer}
          key={trainer.name}
          updateTrainerStars={updateTrainerStars}
          showOverlay
        />
      ))}
    </Grid>
  </>
);

export default Trainerlist;
