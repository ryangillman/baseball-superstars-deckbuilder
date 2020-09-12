import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  Flex,
  Heading,
  Text,
  Box,
  Image,
  Grid,
} from '@chakra-ui/core';
import SkillsDisplay from '../SkillsDisplay';
import trainerImages from '../../assets/trainerImages';
import TypeIcon from '../TypeIcon';
import TeamIcon from '../TeamIcon';
import TrainerStatsTable from '../TrainerStatsTable';
import UpgradeSelector from '../UpgradeSelector';
import { getSkillLevelDiff } from '../../util';

const TrainerDetailsModal = ({ isOpen, onClose, trainer }) => {
  const [stars, setStars] = useState(1);
  const [tempSkills, setTempSkills] = useState(null);

  const skillDiff = tempSkills
    ? getSkillLevelDiff(tempSkills, trainer.skills[stars])
    : null;

  const rarityColor = `rarity.${trainer.rarity}`;
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay zIndex={9999}>
        <ModalContent zIndex={10000} w='480px'>
          <ModalCloseButton color='gray.300' />
          <ModalBody color='gray.300'>
            <Flex justifyContent='center' flexWrap='wrap' mt={10}>
              <Image
                src={trainerImages[trainer.name]}
                width='120px'
                flex='0 0 120px'
              />
              <Heading flex='0 0 100%' textAlign='center'>
                {trainer.name}
              </Heading>
            </Flex>
            <Flex justifyContent='space-around' mb={6}>
              <Flex flexDirection='column' alignItems='center' flex={1}>
                <Text textAlign='center'>Type</Text>
                <Box width='45px' height='45px' ml='10px'>
                  <TypeIcon type={trainer.type} />
                </Box>
              </Flex>
              <Box textAlign='center' flex={1}>
                <Text>Rarity</Text>
                <Text color={rarityColor} fontSize={24}>
                  {trainer.rarity}
                </Text>
              </Box>
              <Box textAlign='center' flex={1}>
                <Text>Position</Text>
                <Text fontSize={24}>{trainer.position}</Text>
              </Box>
              {trainer.bonusTeam && (
                <Flex alignItems='center' flex={1} flexDirection='column'>
                  <Text>Bonus Team</Text>
                  <Box w='50px' h='50px'>
                    <TeamIcon team={trainer.bonusTeam} />
                  </Box>
                </Flex>
              )}
            </Flex>
            <Heading size='lg' textAlign='center' mb={3}>
              Stats
            </Heading>
            <TrainerStatsTable stats={trainer.stats} />
            <Box mt={10}>
              <Heading size='lg' textAlign='center'>
                Skills
              </Heading>
              <UpgradeSelector
                onChange={setStars}
                activeStars={stars}
                gridTemplateColumns='repeat(5, 30px)'
                justifyContent='center'
                onUpgradeMouseEnter={(star) =>
                  setTempSkills(trainer.skills[star])
                }
                onUpgradeMouseLeave={() => setTempSkills(null)}
              />
              <Grid
                gridTemplateColumns='repeat(2, 1fr)'
                gridColumnGap={3}
                gridRowGap={3}
                gridAutoRows='40px'
                mt={2}
              >
                <SkillsDisplay
                  skills={tempSkills || trainer.skills[stars]}
                  skillDiff={skillDiff}
                />
              </Grid>
            </Box>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default TrainerDetailsModal;
