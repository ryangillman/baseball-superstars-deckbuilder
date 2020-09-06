import React from 'react';
import { Text, Box, Tag } from '@chakra-ui/core';
import allSkills from '../../assets/skills.json';

const SkillsDisplay = ({ skills }) => {
  if (!skills) return null;
  return (
    skills &&
    Object.entries(skills)
      .sort((a, b) => (a[1] > b[1] ? -1 : 1))
      .map(([skillId, skillLevel]) => (
        <Tag p={0} key={skillId}>
          <Box
            bg='gray.800'
            p={2}
            w='40px'
            color='white'
            d='inline-flex'
            justifyContent='center'
            alignItems='center'
            h='100%'
          >
            {skillLevel}
          </Box>
          <Text p={2} display='inline-block'>
            {allSkills[skillId]}
          </Text>
        </Tag>
      ))
  );
};

export default SkillsDisplay;
