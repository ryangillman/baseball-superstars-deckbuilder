import React from 'react';
import Skill from '../Skill';

const SkillsDisplay = ({
  skills,
  skillFilter,
  updateFilter,
  withFilter,
  shouldHighlightNeededUpgrades,
}) => {
  if (!Object.keys(skills).length) return null;
  return (
    skills &&
    Object.entries(skills)
      .sort((a, b) => (a[1] > b[1] ? -1 : 1))
      .map(([skillId, skillLevel]) => (
        <Skill
          {...{
            withFilter,
            key: skillId,
            skillId,
            skillLevel,
            isActive: skillFilter?.includes(skillId),
            shouldHighlightNeededUpgrades,
            updateFilter,
          }}
        />
      ))
  );
};

export default SkillsDisplay;
