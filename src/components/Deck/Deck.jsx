import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  Grid,
  Button,
  Heading,
  Flex,
  useToast,
  Box,
  IconButton,
  Text,
} from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon, StarIcon } from '@chakra-ui/icons';
import Trainer from '../Trainer';
import TrainerSlot from '../TrainerSlot';
import SkillsDisplayWithCategories from '../SkillDisplayWithCategories';
import {
  getSkillLevelsSum,
  getSkillLevelDiff,
  createDeckUrl,
} from '../../util';
import useSkillState from '../../hooks/useSkillState';
import useAuth from '../../hooks/useAuth';
import SkillsDisplay from '../SkillsDisplay';

const Deck = ({
  selectedTrainers,
  updateSelectedTrainers,
  updateTrainerStars,
  filters,
  setFilters,
  rosterId,
}) => {
  const history = useHistory();
  const [showActiveSkills, setShowActiveSkills] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [hideDeck, setHideDeck] = useState(false);
  const [tempSkills, setTempSkills] = useState(false);
  const [withCategories, setWithCategories] = useState(true);

  const { skills, setState: setSkillState } = useSkillState();
  const toast = useToast();
  const stickyRef = useRef();

  const { user } = useAuth();

  const toggleShowActiveSkills = () => {
    setShowActiveSkills((prev) => !prev);
  };

  const toggleHideDeck = () => {
    setHideDeck((prev) => !prev);
  };

  const skillDiff = tempSkills ? getSkillLevelDiff(tempSkills, skills) : null;

  const getTempSkills = useCallback(
    (trainer) => (stars) => {
      if (showActiveSkills) {
        const trainers = selectedTrainers.map((row) =>
          row?.name === trainer?.name ? { ...trainer, stars } : row
        );
        return getSkillLevelsSum(trainers);
      }
      return null;
    },
    [selectedTrainers, showActiveSkills]
  );

  useEffect(() => {
    if (selectedTrainers !== null) {
      setSkillState({ skills: getSkillLevelsSum(selectedTrainers) });
      history.push(
        createDeckUrl(selectedTrainers, false, rosterId || user?.roster)
      );
    }
    // setSkillState is stable
    // eslint-disable-next-line
  }, [selectedTrainers]);

  useEffect(() => {
    // Inform component of being sticky or not since there is no real event handler for this
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
        skills:
          action === 'remove'
            ? prev.skills.filter((row) => row !== skill)
            : [...(prev?.skills || []), skill],
      }));
    },
    [setFilters]
  );

  const copyDeckUrlToClipboard = useCallback(
    (withRoster) => {
      navigator.clipboard.writeText(
        createDeckUrl(
          selectedTrainers,
          true,
          withRoster ? rosterId || user.roster : undefined,
          withRoster
        )
      );

      toast({
        title: 'Success.',
        description: 'Deck URL was copied to your clipboard.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    },
    // eslint-disable-next-line
    [selectedTrainers, toast, rosterId, user]
  );

  return (
    <>
      <Flex justifyContent='space-between' alignItems='center' mb={3}>
        <Heading color='gray.300' ref={stickyRef}>
          {' '}
          Your Deck
        </Heading>
        {selectedTrainers?.some((row) => row !== null) && (
          <Flex justifyContent='flex-end'>
            {(rosterId || user?.roster) && (
              <Button
                colorScheme='blue'
                onClick={() => copyDeckUrlToClipboard(true)}
                mr={5}
              >
                Share Deck & Roster
              </Button>
            )}
            <Button
              colorScheme='blue'
              onClick={() => copyDeckUrlToClipboard(false)}
            >
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
          {selectedTrainers?.map((trainer, i) => {
            if (trainer !== null) {
              return (
                <Trainer
                  trainer={trainer}
                  key={trainer.name}
                  updateSelectedTrainers={updateSelectedTrainers}
                  updateTrainerStars={updateTrainerStars}
                  onUpgradeMouseEnter={(stars) =>
                    setTempSkills(getTempSkills(trainer)(stars))
                  }
                  onUpgradeMouseLeave={() => setTempSkills(null)}
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
        {selectedTrainers?.some((row) => row !== null) ? (
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
        <Box
          bg='gray.800'
          border='2px inset'
          mt={-3}
          mb={5}
          p={2}
          position='relative'
        >
          <Flex
            alignItems='center'
            flexWrap='nowrap'
            position='absolute'
            right='10px'
            top='10px'
          >
            <StarIcon mr={3} ml='auto' color='yellow.400' />
            <Text color='gray.300'>Skills with highest value in this deck</Text>
          </Flex>
          <Flex justifyContent='center'>
            <Button
              colorScheme='blue'
              onClick={() => setWithCategories((prev) => !prev)}
              mb={5}
              size='sm'
            >
              {withCategories
                ? 'Hide Skill categories'
                : 'Show Skill categories'}
            </Button>
          </Flex>
          {withCategories && (
            <SkillsDisplayWithCategories
              skills={tempSkills || skills}
              skillDiff={skillDiff}
              updateFilter={updateSkillFilter}
              skillFilter={filters.skills}
              withFilter
              highlightBest
            />
          )}
          {!withCategories && (
            <SkillsDisplay
              skills={tempSkills || skills}
              skillDiff={skillDiff}
              updateFilter={updateSkillFilter}
              skillFilter={filters.skills}
              withFilter
              highlightBest
            />
          )}
        </Box>
      )}
    </>
  );
};

export default Deck;
