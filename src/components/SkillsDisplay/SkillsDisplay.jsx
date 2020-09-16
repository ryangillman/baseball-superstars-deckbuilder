import React, { useCallback } from 'react';
import Skill from '../Skill';
import useSkills from '../../hooks/useSkills';

const rarityIndex = ['UR', 'SSR', 'SR', 'R', 'N'];

const SkillsDisplay = ({
  skills,
  skillDiff,
  skillFilter,
  updateFilter,
  withFilter,
}) => {
  const { data: allSkills } = useSkills();

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

  return (
    <>
      {skills &&
        allVisibleSkills
          .sort(sortByGradeAndLevel)
          .map(([skillId, skillLevel]) => (
            <Skill
              {...{
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
      {}
    </>
  );
};

export default SkillsDisplay;
