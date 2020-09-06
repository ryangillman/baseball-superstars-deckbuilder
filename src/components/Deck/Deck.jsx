import React, { useCallback, useMemo } from 'react';
import { Grid, Button, Heading, Flex, useToast } from '@chakra-ui/core';
import Trainer from '../Trainer';
import TrainerSlot from '../TrainerSlot';
import SkillsDisplay from '../SkillsDisplay';

const Deck = ({
  selectedTrainers,
  allTrainers,
  updateSelectedTrainers,
  updateTrainerStars,
}) => {
  const toast = useToast();

  const trainersToUrl = useCallback(
    (trainers) =>
      trainers.reduce((acc, name, i, arr) => {
        const needsComma = i < arr.length - 1;

        if (allTrainers[name])
          return `${acc}${name}_${allTrainers[name].stars}${
            needsComma ? ',' : ''
          }`;
        return `${acc}null${needsComma ? ',' : ''}`;
      }, ''),
    [allTrainers]
  );

  const skills = useMemo(
    () =>
      selectedTrainers.reduce((acc, trainer) => {
        const curTrainerSkills =
          allTrainers?.[trainer]?.skills?.[allTrainers?.[trainer]?.stars];

        if (!curTrainerSkills) return acc;
        const newSkillLevels = Object.entries(curTrainerSkills).reduce(
          (skillsAcc, [skillName, skillLevel]) => {
            let currLevel = skillLevel;
            if (acc[skillName]) currLevel = acc[skillName] + skillLevel;
            return {
              ...skillsAcc,
              [skillName]: Math.min(parseInt(currLevel, 10), 5),
            };
          },
          {}
        );

        return { ...acc, ...newSkillLevels };
      }, {}),
    [selectedTrainers, allTrainers]
  );

  const createShareLink = () => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/deck`;

    navigator.clipboard.writeText(
      `${baseUrl}?trainers=${trainersToUrl(selectedTrainers)}`
    );

    toast({
      title: 'Success.',
      description: 'Deck URL was copied to your clipboard.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };
  return (
    <>
      {selectedTrainers.filter((row) => row !== null).length ? (
        <Flex justifyContent='flex-end'>
          <Button colorScheme='teal' onClick={createShareLink}>
            Share Deck
          </Button>
        </Flex>
      ) : null}
      <Heading color='gray.300'> Your Deck</Heading>
      <Grid
        gridTemplateColumns='repeat(5, 1fr)'
        gridColumnGap={3}
        gridRowGap={3}
        gridAutoRows='40px'
        mt={2}
      >
        <SkillsDisplay skills={skills} />
      </Grid>
      <Grid
        gridColumnGap={1}
        gridTemplateColumns='repeat(6, clamp(30px, 10vw, 120px))'
        justifyContent='space-between'
        position='sticky'
        mb={5}
        zIndex={1000}
        top={0}
        py={6}
        bg='gray.700'
      >
        {[0, 1, 2, 3, 4, 5].map((row, i) => {
          const trainer = allTrainers[selectedTrainers[i]];
          if (trainer) {
            return (
              <Trainer
                trainer={trainer}
                key={trainer.name}
                updateSelectedTrainers={() =>
                  updateSelectedTrainers(trainer.name)
                }
                updateTrainerStars={updateTrainerStars}
              />
            );
          }
          return <TrainerSlot key={row} slotNumber={row + 1} />;
        })}
      </Grid>
    </>
  );
};

export default Deck;
