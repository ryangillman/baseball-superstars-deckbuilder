import React from 'react';
import Skill from '../Skill';
import allSkills from '../../assets/skills.json';

const rarityIndex = ['UR', 'SSR', 'SR', 'R', 'N'];

const SkillsDisplay = ({
  skills,
  skillDiff,
  skillFilter,
  updateFilter,
  withFilter,
}) => {
  if (!Object.keys(skills).length) return null;
  return (
    skills &&
    Object.entries(skills)
      .sort((a, b) => {
        const indexA = rarityIndex.indexOf(allSkills[a[0]]?.skillGrade);
        const indexB = rarityIndex.indexOf(allSkills[b[0]]?.skillGrade);
        if (indexA === indexB) {
          return a[1] > b[1] ? -1 : 1;
        }
        return indexA < indexB ? -1 : 1;
      })

      .map(([skillId, skillLevel]) => (
        <Skill
          {...{
            withFilter,
            skillDiff: skillDiff?.[skillId]?.value,
            key: skillId,
            skillId,
            skillLevel,
            isActive: skillFilter?.includes(skillId),
            updateFilter,
          }}
        />
      ))
  );
};

export default SkillsDisplay;
