import React, { useCallback, useMemo, useState } from 'react';
import { Grid, Button, Heading, Flex, useToast, Box } from '@chakra-ui/core';
import Trainer from '../Trainer';
import TrainerSlot from '../TrainerSlot';
import SkillsDisplay from '../SkillsDisplay';

const Deck = ({
  selectedTrainers,
  allTrainers,
  updateSelectedTrainers,
  updateTrainerStars,
}) => {
  const [showActiveSkills, setShowActiveSkills] = useState(false);
  const toast = useToast();

  const toggleShowActiveSkills = () => {
    setShowActiveSkills((prev) => !prev);
  };

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

  const skills = useMemo(() => {
    if (!showActiveSkills) return {};
    return selectedTrainers.reduce((acc, trainer) => {
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
    }, {});
  }, [selectedTrainers, allTrainers, showActiveSkills]);

  const createShareLink = () => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ''
    }`;

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
      <Flex justifyContent='space-between' alignItems='center' mb={3}>
        <Heading color='gray.300'> Your Deck</Heading>
        {selectedTrainers.some((row) => row !== null) && (
          <Flex justifyContent='flex-end'>
            <Button colorScheme='blue' onClick={createShareLink}>
              Share Deck
            </Button>
          </Flex>
        )}
      </Flex>

      <Grid
        gridColumnGap='2px'
        gridTemplateColumns='repeat(6, 120px)'
        justifyContent='space-between'
        position='sticky'
        gridGap={5}
        overflowX='auto'
        zIndex={1000}
        top={0}
        pb={6}
        pt={[0, 0, 3]}
        mb={3}
        bg='gray.700'
        mx={[-3, 0]}
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
      <Flex justifyContent='flex-end'>
        {selectedTrainers.some((row) => row !== null) ? (
          <Button
            onClick={toggleShowActiveSkills}
            size='sm'
            colorScheme='blue'
            mb={5}
          >
            {showActiveSkills ? 'Hide Active Skills' : 'Show Active Skills'}
          </Button>
        ) : (
          <Box height='32px' mb={5} />
        )}
      </Flex>
      {Object.keys(skills).length > 0 && showActiveSkills && (
        <Box bg='gray.800' border='2px inset' mt={-3} mb={5} p={2}>
          <Grid
            gridTemplateColumns='repeat(auto-fit, minmax(200px, 1fr))'
            gridColumnGap={3}
            gridRowGap={3}
            gridAutoRows='40px'
          >
            <SkillsDisplay skills={skills} />
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Deck;
