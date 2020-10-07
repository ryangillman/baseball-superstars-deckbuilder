import React, { useMemo } from 'react';
import { Grid, Heading, Flex, Text } from '@chakra-ui/core';
import Trainer from '../Trainer';
import TrainerFilter from '../TrainerFilter';
import useSkillState from '../../hooks/useSkillState';
import { getSkillLevelsSum, getTrainerValueForDeck } from '../../util';
import useTrainerDisplaySettings from '../../hooks/useTrainerDisplaySettings';
import UpgradeSelector from '../UpgradeSelector';
import TrainerValue from '../Trainer/TrainerValue/TrainerValue';
import ComboEventIcon from '../ComboEventIcon/ComboEventIcon';
import useComboEvents from '../../hooks/useComboEvents';

const getSkills = (state) => state.skills;
const getSortBy = (state) => state.sortBy;

const Trainerlist = ({
  updateSelectedTrainers,
  selectedTrainers = [],
  allTrainers = [],
  setFilters,
  updateTrainerStars,
  skillFilter,
  updateAllTrainerStars,
  withRemove,
  showOverlay,
  showInfo = false,
}) => {
  const skills = useSkillState(getSkills);
  const { data: comboEvents } = useComboEvents();
  const sortBy = useTrainerDisplaySettings(getSortBy);

  const allTrainerValues = useMemo(() => {
    if (!allTrainers || !allTrainers?.length) return null;
    if (selectedTrainers?.some((row) => row !== null)) {
      return allTrainers?.reduce((acc, trainer) => {
        if (!selectedTrainers.find((sel) => sel?.name === trainer?.name)) {
          return {
            ...acc,
            [trainer?.name]: getTrainerValueForDeck(
              skills,
              trainer?.skills[trainer?.stars] || {}
            ),
          };
        }
        const selectedTrainersWithoutCurrent = selectedTrainers.map((row) =>
          row?.name === trainer?.name ? null : row
        );
        return {
          ...acc,
          [trainer?.name]: getTrainerValueForDeck(
            getSkillLevelsSum(selectedTrainersWithoutCurrent),
            trainer?.skills[trainer?.stars] || {}
          ),
        };
      }, {});
    }
    return null;
    // doesn't need selectedTrainers dep since skills is already a dependency of selectedTrainers
    // eslint-disable-next-line
  }, [skills, allTrainers]);

  if (!comboEvents) return null;
  return (
    <>
      <Heading color='gray.300' mb={3}>
        Trainer List
      </Heading>
      {updateAllTrainerStars && (
        <Flex color='gray.300'>
          Set all Trainers to:
          <UpgradeSelector
            ml={3}
            flex={1}
            onChange={updateAllTrainerStars}
            activeStars={5}
            gridTemplateColumns='repeat(auto-fill, 25px)'
          />
        </Flex>
      )}
      <TrainerFilter
        {...{
          setFilters,
          skillFilter,
        }}
      />

      {showInfo && (
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
            in terms of Skill compatibility for your current deck. The higher
            the value the better, there is no max value for this at the moment.
            This is highly ALPHA and untested status so please take with a grain
            of salt. THIS WILL NOT CREATE THE PERFECT DECK FOR YOU.
          </Text>
        </Flex>
      )}
      <Grid
        gridTemplateColumns='repeat(auto-fill, 120px)'
        justifyContent='space-between'
        gridGap={10}
        gridColumnGap={2}
      >
        {(sortBy.type === 'skillvalue'
          ? allTrainers?.sort((a, b) =>
              allTrainerValues?.[a.name] > allTrainerValues?.[b.name] ? -1 : 1
            )
          : allTrainers?.sort((a, b) => (a.order < b.order ? -1 : 1))
        ).map((trainer) => {
          const trainerIndex = selectedTrainers?.findIndex(
            (row) => row?.name === trainer?.name
          );
          const trainerComboEvents =
            trainer?.comboEvents?.filter((row) =>
              comboEvents[row].requiredTrainers.every((trainerName) =>
                [...selectedTrainers.filter(Boolean), trainer]
                  .map((selTrainer) => selTrainer.name)
                  .includes(trainerName)
              )
            ) || [];

          return (
            <Flex maxW={120} key={trainer.name} position='relative'>
              <Trainer
                withRemove={withRemove}
                updateSelectedTrainers={updateSelectedTrainers}
                trainer={trainer}
                trainerIndex={trainerIndex}
                updateTrainerStars={updateTrainerStars}
                showOverlay={showOverlay}
                overlayText={trainerIndex + 1}
                skillFilter={skillFilter}
              />
              {allTrainerValues?.[trainer.name] && (
                <TrainerValue trainerValue={allTrainerValues?.[trainer.name]} />
              )}
              {trainerComboEvents.length > 0 ? (
                <ComboEventIcon blinking={trainerIndex === -1} />
              ) : null}
            </Flex>
          );
        })}
      </Grid>
    </>
  );
};

export default Trainerlist;
