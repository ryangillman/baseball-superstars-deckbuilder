import React from 'react';
import { Box, Flex, Input, Checkbox, IconButton, Text } from '@chakra-ui/core';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import useSkills from '../../hooks/useSkills';
import MultiSelect from '../MultiSelect/MultiSelect';
import rarities from '../../assets/rarities';
import positions from '../../assets/positions';
import types from '../../assets/types';
import bonusteams from '../../assets/bonusteams';
import useTrainerDisplaySettings from '../../hooks/useTrainerDisplaySettings';
import Select from '../Select';

const MultiValueLabel = ({
  data,
  selectProps: {
    selectProps: { setFilters },
  },
}) => (
  <>
    <Text
      color='gray.300'
      textOverflow='ellipsis'
      minW={0}
      whiteSpace='nowrap'
      p='3px'
      fontSize='85%'
      as='span'
    >
      {data?.label}
    </Text>

    <IconButton
      variant='ghost'
      size='xs'
      ml={2}
      icon={<AddIcon />}
      disabled={data?.level === 5}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setFilters((prev) => ({
          skills: {
            ...prev.skills,
            skillLevels: {
              ...prev.skills.skillLevels,
              [data.value]: prev.skills.skillLevels[data.value] + 1,
            },
          },
        }));
      }}
    />

    <IconButton
      variant='ghost'
      size='xs'
      icon={<MinusIcon />}
      disabled={data?.level === 1}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setFilters((prev) => ({
          skills: {
            ...prev.skills,
            skillLevels: {
              ...prev.skills.skillLevels,
              [data.value]: prev.skills.skillLevels[data.value] - 1,
            },
          },
        }));
      }}
    />
  </>
);

const TrainerFilter = ({ setFilters, skillFilter }) => {
  const {
    setState: trainerDisplaySettingsSetState,
    searchSkillOnlyInActiveUpgrade: dontHighlightNeededUpgrades,
  } = useTrainerDisplaySettings();
  const { data: allSkills } = useSkills();

  return (
    <>
      <Flex justifyContent='spaceBetween' flexWrap='wrap' mx={-1} mb={10}>
        <Box flex='0 0 100%' maxW='calc(100% - .5rem)' mx={1} my={3}>
          <Input
            onChange={(e) => setFilters({ name: e.target.value })}
            placeholder='Search by Name'
            color='gray.300'
          />
        </Box>
        <Box flex={['1 1 40%', null, '1 1 20%']} mx={1} my={3}>
          <MultiSelect
            placeholder='Filter by Position'
            items={positions}
            onChange={(values) =>
              setFilters({ position: values?.map((row) => row.value) || [] })
            }
          />
        </Box>
        <Box flex={['1 1 40%', null, '1 1 20%']} mx={1} my={3}>
          <MultiSelect
            placeholder='Filter by Rarity'
            items={rarities}
            onChange={(values) =>
              setFilters({ rarity: values?.map((row) => row.value) || [] })
            }
          />
        </Box>
        <Box flex={['1 1 40%', null, '1 1 20%']} mx={1} my={3}>
          <MultiSelect
            placeholder='Filter by Type'
            items={types}
            onChange={(values) =>
              setFilters({ type: values?.map((row) => row.value) || [] })
            }
          />
        </Box>
        <Box flex={['1 1 40%', null, '1 1 20%']} mx={1} my={3}>
          <MultiSelect
            placeholder='Filter by Team Bonus'
            items={bonusteams}
            onChange={(values) =>
              setFilters({ bonusteams: values?.map((row) => row.value) || [] })
            }
          />
        </Box>
        <Box flex='0 0 100%' maxW='calc(100% - .5rem)' mx={1} my={3}>
          <MultiSelect
            placeholder='Filter by Skill'
            selectProps={{ setFilters }}
            components={{ MultiValueLabel }}
            items={Object.entries(allSkills || {})
              .sort((a, b) => (a[0] > b[0] ? 1 : -1))
              .map(([key, value]) => ({
                value: key,
                label: value.name,
              }))}
            value={
              skillFilter?.skillNames?.map((row) => ({
                value: row,
                level: skillFilter?.skillLevels?.[row] || 1,
                label: `${allSkills?.[row]?.name} Lv.${
                  skillFilter?.skillLevels?.[row] || 1
                }+`,
                withColor: !dontHighlightNeededUpgrades,
              })) || []
            }
            onChange={(values) =>
              setFilters((prev) => {
                if (!values) return { skills: {} };
                const skillLevels = values.reduce(
                  (acc, { value: skillName }) => ({
                    [skillName]: prev?.skills?.skillLevels?.[skillName] || 1,
                  }),
                  {}
                );
                return {
                  skills: {
                    skillNames: values.map((value) => value.value),
                    skillLevels: {
                      ...prev?.skills?.skillLevels,
                      ...skillLevels,
                    },
                  },
                };
              })
            }
          />
        </Box>
        <Box flex='0 0 100%' maxW='calc(100% - .5rem)' mx={1} my={3}>
          <Select
            placeholder='Sort By'
            items={[
              { value: 'rarity', label: 'Rarity' },
              {
                value: 'skillvalue',
                label: 'Trainervalue by Skill compatibility',
              },
            ]}
            onChange={(value) =>
              trainerDisplaySettingsSetState('sortBy', {
                type: value.value,
                order: 'desc',
              })
            }
          />
        </Box>
        {skillFilter?.skillNames?.length > 0 && (
          <>
            <Box flex='0 0 100%' mx={1} my={3}>
              <Checkbox
                color='gray.300'
                onChange={(e) =>
                  trainerDisplaySettingsSetState(
                    'skillSearchTypeAnd',
                    e.target.checked
                  )
                }
              >
                Only show trainers if they have ALL selected skills
              </Checkbox>
            </Box>
            <Box flex='0 0 100%' mx={1} my={3}>
              <Checkbox
                color='gray.300'
                onChange={(e) =>
                  trainerDisplaySettingsSetState(
                    'searchSkillOnlyInActiveUpgrade',
                    e.target.checked
                  )
                }
              >
                Only show trainers if they have the selected Skill on their
                current upgrade level
              </Checkbox>
            </Box>
          </>
        )}
      </Flex>
    </>
  );
};

export default React.memo(TrainerFilter);
