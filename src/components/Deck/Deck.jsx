import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  Grid,
  Button,
  Heading,
  Flex,
  useToast,
  Box,
  IconButton,
} from '@chakra-ui/core';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import Trainer from '../Trainer';
import TrainerSlot from '../TrainerSlot';
import SkillsDisplay from '../SkillsDisplay';

const Deck = ({
  selectedTrainers,
  updateSelectedTrainers,
  updateTrainerStars,
  filters,
  setFilters,
  shouldHighlightNeededUpgrades,
}) => {
  const [showActiveSkills, setShowActiveSkills] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const toast = useToast();
  const stickyRef = useRef();
  const [hideDeck, setHideDeck] = useState(false);

  const toggleShowActiveSkills = () => {
    setShowActiveSkills((prev) => !prev);
  };

  const toggleHideDeck = () => {
    setHideDeck((prev) => !prev);
  };

  useEffect(() => {
    const cachedRef = stickyRef.current;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(e.intersectionRatio < 0.05),
      { threshold: [0.05] }
    );

    observer.observe(cachedRef);

    // unmount
    return function () {
      observer.unobserve(cachedRef);
    };
  }, []);

  const updateSkillFilter = useCallback(
    (skill, action) => {
      setFilters((prev) => ({
        ...prev,
        skills:
          action === 'remove'
            ? prev.skills.filter((row) => row !== skill)
            : [...(prev?.skills || []), skill],
      }));
    },
    [setFilters]
  );

  const trainersToUrl = useCallback(
    (trainers) =>
      trainers.reduce((acc, trainer, i, arr) => {
        const needsComma = i < arr.length - 1;
        if (trainer !== null)
          return `${acc}${trainer.name}_${trainer.stars}${
            needsComma ? ',' : ''
          }`;
        return `${acc}null${needsComma ? ',' : ''}`;
      }, ''),
    []
  );

  const skills = useMemo(() => {
    if (!showActiveSkills) return {};
    return selectedTrainers.reduce((acc, trainer) => {
      const curTrainerSkills = trainer?.skills[trainer?.stars];

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
  }, [selectedTrainers, showActiveSkills]);

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
        <Heading color='gray.300' ref={stickyRef}>
          {' '}
          Your Deck
        </Heading>
        {selectedTrainers.some((row) => row !== null) && (
          <Flex justifyContent='flex-end'>
            <Button colorScheme='blue' onClick={createShareLink}>
              Share Deck
            </Button>
          </Flex>
        )}
      </Flex>
      <Box
        position='sticky'
        overflowY='visible'
        top={-1}
        transform={isSticky && hideDeck ? 'translateY(-100%)' : 'translateY(0)'}
        transition='transform 0.3s ease-in-out'
        opacity='1'
        zIndex='100'
      >
        <Grid
          gridColumnGap='2px'
          gridTemplateColumns='repeat(6, 120px)'
          justifyContent='space-between'
          gridGap={5}
          overflowX='auto'
          zIndex={1000}
          pb={6}
          pt={[0, 0, 6]}
          mb={3}
          bg='gray.700'
          mx={[-3, 0]}
        >
          {selectedTrainers.map((trainer, i) => {
            if (trainer !== null) {
              return (
                <Trainer
                  trainer={trainer}
                  key={trainer.name}
                  updateSelectedTrainers={updateSelectedTrainers}
                  updateTrainerStars={updateTrainerStars}
                />
              );
            }
            // can disable because array always has 6 items and the index is stable

            // eslint-disable-next-line react/no-array-index-key
            return <TrainerSlot key={i} slotNumber={i + 1} />;
          })}
        </Grid>
        {isSticky && (
          <IconButton
            onClick={() => toggleHideDeck()}
            position='absolute'
            right='0'
            left='0'
            bottom='0'
            transform='translateY(75%)'
            borderRadius='100%'
            margin='auto'
            bg='gray.800'
            color='gray.300'
            _hover={{ bg: 'gray.700', color: 'gray.200' }}
            icon={hideDeck ? <ChevronDownIcon /> : <ChevronUpIcon />}
          />
        )}
      </Box>
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
            <SkillsDisplay
              skills={skills}
              updateFilter={updateSkillFilter}
              skillFilter={filters.skills}
              withFilter
              shouldHighlightNeededUpgrades={shouldHighlightNeededUpgrades}
            />
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Deck;
