import React from 'react';
import { Text, Box, Tag, IconButton, Flex } from '@chakra-ui/core';
import { SearchIcon } from '@chakra-ui/icons';
import { getSkillColor } from '../../util';
import allSkills from '../../assets/skills.json';

const Skill = ({
  skillLevel,
  skillId,
  isActive,
  updateFilter,
  withFilter = false,
  shouldHighlightNeededUpgrades,
}) => {
  let borderColor = '';
  if (isActive && shouldHighlightNeededUpgrades) {
    borderColor = getSkillColor(skillId);
  } else if (isActive) {
    borderColor = 'gray.200';
  }

  return (
    <Tag
      p={0}
      key={skillId}
      border={isActive ? '3px solid' : ''}
      borderColor={borderColor}
    >
      <Box
        bg={skillLevel === 5 ? 'gray.200' : 'gray.600'}
        p={2}
        w='40px'
        color={skillLevel === 5 ? 'black' : 'white'}
        d='inline-flex'
        justifyContent='center'
        alignItems='center'
        h='100%'
      >
        {skillLevel}
      </Box>
      <Flex
        p={2}
        pr={0}
        flex={1}
        alignItems='center'
        justifyContent='space-between'
      >
        <Text display='inline-block'>{allSkills[skillId]}</Text>
        {withFilter && (
          <IconButton
            icon={<SearchIcon />}
            colorScheme='ghost'
            color='gray.300'
            onClick={() =>
              isActive
                ? updateFilter(skillId, 'remove')
                : updateFilter(skillId, 'add')
            }
          />
        )}
      </Flex>
    </Tag>
  );
};

export default Skill;
