import React from 'react';
import { Grid, Heading, Input, Flex, Box, Checkbox } from '@chakra-ui/core';
import Trainer from '../Trainer';
import allSkills from '../../assets/skills.json';
import MultiSelect from '../MultiSelect/MultiSelect';
import UpgradeSelector from '../UpgradeSelector';

const types = [
  {
    value: 'STR',
    label: 'STR',
  },
  {
    value: 'INT',
    label: 'INT',
  },
  {
    value: 'DEX',
    label: 'DEX',
  },
  {
    value: 'MNT',
    label: 'MNT',
  },
  {
    value: 'GP',
    label: 'G-Points',
  },
  {
    value: 'SP',
    label: 'Skill Points',
  },
];
const rarities = [
  {
    value: 'UR',
    label: 'UR',
  },
  {
    value: 'SSR',
    label: 'SSR',
  },
  {
    value: 'SR',
    label: 'SR',
  },
  {
    value: 'R',
    label: 'R',
  },
  {
    value: 'N',
    label: 'N',
  },
];
const positions = [
  {
    value: '1B',
    label: '1B',
  },
  {
    value: '2B',
    label: '2B',
  },
  {
    value: '3B',
    label: '3B',
  },
  {
    value: 'C',
    label: 'C',
  },
  {
    value: 'CF',
    label: 'CF',
  },
  {
    value: 'LF',
    label: 'LF',
  },
  {
    value: 'RF',
    label: 'RF',
  },
  {
    value: 'SS',
    label: 'SS',
  },
  {
    value: 'SP',
    label: 'SP',
  },
  {
    value: 'RP',
    label: 'RP',
  },
  {
    value: 'CP',
    label: 'CP',
  },
];

const Trainerlist = ({
  updateSelectedTrainers,
  selectedTrainers,
  allTrainers,
  updateFilters,
  updateTrainerStars,
  skillFilter,
  shouldHighlightNeededUpgrades,
  updateAllTrainerStars,
}) => (
  <>
    <Heading color='gray.300' mb={3}>
      Trainer List
    </Heading>
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
    <Flex justifyContent='spaceBetween' flexWrap='wrap' mx={-1} mb={10}>
      <Box flex='0 0 100%' maxW='calc(100% - .5rem)' mx={1} my={3}>
        <Input
          onChange={(e) => updateFilters('name', e.target.value)}
          placeholder='Search by Name'
          color='gray.300'
        />
      </Box>
      <Box flex={['1 1 40%', null, '1 1 30%']} mx={1} my={3}>
        <MultiSelect
          placeholder='Filter by Position'
          items={positions}
          onChange={(values) =>
            updateFilters('position', values?.map((row) => row.value) || [])
          }
        />
      </Box>
      <Box flex={['1 1 40%', null, '1 1 30%']} mx={1} my={3}>
        <MultiSelect
          placeholder='Filter by Rarity'
          items={rarities}
          onChange={(values) =>
            updateFilters('rarity', values?.map((row) => row.value) || [])
          }
        />
      </Box>
      <Box flex={['1 1 40%', null, '1 1 30%']} mx={1} my={3}>
        <MultiSelect
          placeholder='Filter by Type'
          items={types}
          onChange={(values) =>
            updateFilters('type', values?.map((row) => row.value) || [])
          }
        />
      </Box>
      <Box flex='0 0 100%' maxW='calc(100% - .5rem)' mx={1} my={3}>
        <MultiSelect
          placeholder='Filter by Skill'
          items={Object.entries(allSkills).map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          value={
            skillFilter?.map((row) => ({
              value: row,
              label: allSkills[row],
              withColor: shouldHighlightNeededUpgrades,
            })) || []
          }
          onChange={(values) =>
            updateFilters('skills', values?.map((row) => row.value) || [])
          }
        />
      </Box>
      {skillFilter?.length > 0 && (
        <>
          <Box flex='0 0 100%' mx={1} my={3}>
            <Checkbox
              color='gray.300'
              onChange={(e) =>
                updateFilters('skillSearchTypeAnd', e.target.checked)
              }
            >
              Only show trainers if they have ALL selected skills
            </Checkbox>
          </Box>
          <Box flex='0 0 100%' mx={1} my={3}>
            <Checkbox
              color='gray.300'
              onChange={(e) =>
                updateFilters('skillSearchOnlyCurrentUpgrade', e.target.checked)
              }
            >
              Only show trainers if they have the selected Skill on their
              current upgrade level
            </Checkbox>
          </Box>
        </>
      )}
    </Flex>
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
          shouldHighlightNeededUpgrades={shouldHighlightNeededUpgrades}
        />
      ))}
    </Grid>
  </>
);

export default Trainerlist;
