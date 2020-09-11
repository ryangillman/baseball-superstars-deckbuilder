import React, { useMemo } from 'react';
import { Grid, Heading, Flex, Text } from '@chakra-ui/core';
import Trainer from '../Trainer';
import TrainerFilter from '../TrainerFilter';
import useSkills from '../../hooks/useSkills';
import { getSkillValuesForDeck } from '../../util';
import useTrainerDisplaySettings from '../../hooks/useTrainerDisplaySettings';

const getSkills = (state) => state.skills;
const getSortBy = (state) => state.sortBy;

const Trainerlist = ({
  updateSelectedTrainers,
  selectedTrainers,
  allTrainers,
  setFilters,
  updateTrainerStars,
  skillFilter,
  updateAllTrainerStars,
}) => {
  const skills = useSkills(getSkills);
  const sortBy = useTrainerDisplaySettings(getSortBy);

  const allTrainerValues = useMemo(() => {
    if (!selectedTrainers.every((row) => row !== null)) {
      return allTrainers.reduce(
        (acc, trainer) => ({
          ...acc,
          [trainer.name]: getSkillValuesForDeck(
            skills,
            trainer.skills[trainer.stars]
          ),
        }),
        {}
      );
    }
    return null;
  }, [skills, allTrainers]);

  return (
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
      <Flex alignItems='flex-start' mb={8}>
        <Flex
          alignItems='center'
          justifyContent='center'
          right={0}
          flex='30px'
          height='30px'
          pointerEvents='none'
          bg='gray.200'
          fontWeight='semiBold'
          p={3}
        >
          <Text>XX</Text>
        </Flex>
        <Text color='gray.300' fontWeight='semiBold' ml={3} mt='-.5rem'>
          The value in this box is supposed to show how viable this trainer is
          in terms of Skill compatibility for your current deck. The higher the
          value the better, there is no max value for this at the moment. This
          is highly ALPHA and untested status so please take with a grain of
          salt. (It does NOT take skill rarity into account yet). It does
          however give higher value to this trainer for getting skills to level
          4/5 in your deck.
        </Text>
      </Flex>
      <Grid
        gridTemplateColumns='repeat(auto-fill, 120px)'
        justifyContent='space-between'
        gridGap={10}
        gridColumnGap={2}
      >
        {(sortBy.type === 'skillvalue'
          ? allTrainers.sort((a, b) => {
              if (sortBy.type === 'skillvalue') {
                return allTrainerValues?.[a.name] > allTrainerValues?.[b.name]
                  ? -1
                  : 1;
              }
              return 0;
            })
          : allTrainers
        ).map((trainer) => (
          <Trainer
            updateSelectedTrainers={updateSelectedTrainers}
            trainer={trainer}
            trainerIndex={selectedTrainers.findIndex(
              (row) => row?.name === trainer?.name
            )}
            trainerValue={allTrainerValues?.[trainer.name]}
            key={trainer.name}
            updateTrainerStars={updateTrainerStars}
            showOverlay
            skillFilter={skillFilter}
          />
        ))}
      </Grid>
    </>
  );
};

export default Trainerlist;
