import React, { useCallback, useMemo } from 'react';
import { Flex, Grid, Heading, Text } from '@chakra-ui/core';
import Skill from '../Skill';
import useSkills from '../../hooks/useSkills';
import { getBestSkillsInDeck, getSkillCost } from '../../util';

const rarityIndex = ['UR', 'SSR', 'SR', 'R', 'N'];

const typeOrder = [
  'Resolve',
  'Hand',
  'Pitching Style',
  'Pitch Type I',
  'Pitch Type II',
  'Pitch Type III',
  'Pitch Type IV',
  'Pitch Type V',
  'Pitch Type VI',
  'Batter Skills',
  'Batting Style',
  'Common',
];

const SkillsDisplay = ({
  skills,
  skillDiff,
  skillFilter,
  updateFilter,
  withFilter,
  highlightBest,
}) => {
  const { data: allSkills } = useSkills();

  const sortBySkillType = useCallback(
    (a, b) => (typeOrder.indexOf(a[0]) > typeOrder.indexOf(b[0]) ? 1 : -1),
    []
  );

  const bestSkills = useMemo(() => getBestSkillsInDeck(skills), [skills]);
  const bestSkillMaxLevel = Object.keys(bestSkills)?.reduce(
    (acc, row) => acc + bestSkills[row].skillLevel,
    0
  );
  const bestSkillsMaxCost = Object.keys(bestSkills).reduce(
    (acc, row) => acc + getSkillCost(row, bestSkills[row].skillLevel),
    0
  );

  const sortByGradeAndLevel = useCallback(
    (a, b) => {
      const indexA = rarityIndex.indexOf(allSkills[a[0]]?.skillGrade);
      const indexB = rarityIndex.indexOf(allSkills[b[0]]?.skillGrade);
      if (indexA === indexB) {
        return a[1] > b[1] ? -1 : 1;
      }
      return indexA < indexB ? -1 : 1;
    },
    [allSkills]
  );

  if (!Object.keys(skills).length) return null;

  // To show which skills disappeared due to possible downgrade of hero
  const removedSkills = Object.keys(skillDiff || {})
    .filter((key) => skills[key] === undefined)
    ?.map((key) => [key, 0]);
  const allVisibleSkills = [...Object.entries(skills), ...removedSkills];

  const groupedSkills = allVisibleSkills.reduce((acc, row) => {
    const skillType = allSkills[row[0]].type;
    if (acc[skillType]) {
      return {
        ...acc,
        [skillType]: [...acc[skillType], row],
      };
    }
    return { ...acc, [skillType]: [row] };
  }, {});

  return (
    <>
      {skills &&
        Object.entries(groupedSkills)
          .sort(sortBySkillType)
          .map(([key, value], i) => (
            <React.Fragment key={key}>
              <Heading size='sm' color='gray.400' mb={3} mt={i === 0 ? 0 : 5}>
                {key}
              </Heading>
              <Grid
                gridTemplateColumns='repeat(auto-fit, minmax(200px, 1fr))'
                gridColumnGap={3}
                gridRowGap={3}
                gridAutoRows='40px'
              >
                {value
                  .sort(sortByGradeAndLevel)
                  .map(([skillId, skillLevel]) => (
                    <Skill
                      {...{
                        isBest:
                          highlightBest && bestSkills?.[skillId] !== undefined,
                        skillName: allSkills?.[skillId]?.name,
                        skillGrade: allSkills?.[skillId]?.skillGrade,
                        withFilter,
                        skillDiff: skillDiff?.[skillId]?.value,
                        key: skillId,
                        skillId,
                        skillLevel,
                        isActive: skillFilter?.includes(skillId),
                        updateFilter,
                      }}
                    />
                  ))}
              </Grid>
            </React.Fragment>
          ))}
      {highlightBest && (
        <Flex my={4} mt={10} justifyContent='space-around'>
          <Text color='gray.300' fontSize={18}>
            Highest value skills - Max Overall Skill Level:{' '}
            <Text as='span' fontWeight='700'>
              {bestSkillMaxLevel}
            </Text>
          </Text>
          <Text color='gray.300' fontSize={18}>
            Highest value skills - Max SP Cost (no Discounts):{' '}
            <Text as='span' fontWeight='700'>
              {bestSkillsMaxCost}
            </Text>
          </Text>
        </Flex>
      )}{' '}
    </>
  );
};

export default SkillsDisplay;
