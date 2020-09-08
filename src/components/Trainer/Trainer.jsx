import React, { useState } from 'react';
import {
  Flex,
  Button,
  Text,
  Box,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Heading,
} from '@chakra-ui/core';
import { ViewIcon } from '@chakra-ui/icons';
import Lazyload from 'react-lazyload';
import trainerImages from '../../assets/trainerImages';
import SelectedTrainerOverlay from '../SelectedTrainerOverlay';
import TypeIcon from '../TypeIcon';
import TrainerStatsTable from '../TrainerStatsTable';
import SkillsDisplay from '../SkillsDisplay';
import UpgradeSelector from '../UpgradeSelector';
import TeamIcon from '../TeamIcon';

const Trainer = React.memo(
  ({
    trainer,
    updateSelectedTrainers,
    updateTrainerStars,
    showOverlay,
    trainerIndex,
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalStars, setModalStars] = useState(1);
    const rarityColor = `rarity.${trainer.rarity}`;

    return (
      <>
        <Flex
          maxW={120}
          flexDirection='column'
          bg='gray.800'
          border='2px solid'
          borderColor={rarityColor}
          position='relative'
        >
          <Button
            height='auto'
            width='100%'
            p='0'
            display='flex'
            flexDirection='column'
            onClick={() => updateSelectedTrainers(trainer)}
          >
            <Box position='relative'>
              <Lazyload offset={200} once>
                <img
                  width='100%'
                  src={trainerImages[trainer.name]}
                  alt={trainer.name}
                />
              </Lazyload>

              <Flex
                position='absolute'
                right='5px'
                bottom='5px'
                bg='gray.300'
                borderRadius='8px'
                p={1}
              >
                <Text textAlign='center' color='gray.600'>
                  {trainer.position}
                </Text>
              </Flex>
            </Box>
            <SelectedTrainerOverlay
              show={showOverlay && trainerIndex !== -1}
              text={trainerIndex + 1}
            />
            <Box
              position='absolute'
              right={0}
              left={0}
              top={0}
              transform='translateY(-50%)'
              mx='auto'
              width='40px'
              height='40px'
              pointerEvents='none'
            >
              <TeamIcon team={trainer.bonusTeam} />
            </Box>
            <Flex
              w='100%'
              bg='gray.300'
              px={2}
              py={1}
              justifyContent='space-between'
              alignItems='center'
            >
              <Text
                color='gray.600'
                textAlign='left'
                overflow='hidden'
                textOverflow='ellipsis'
              >
                {trainer.name}
              </Text>
              <Box
                display='inline-block'
                position='relative'
                right='-6px'
                top='2px'
                w='25px'
                h='25px'
                flex='0 0 25px'
              >
                <TypeIcon type={trainer.type} />
              </Box>
            </Flex>
          </Button>
          <UpgradeSelector
            onChange={(stars) => updateTrainerStars(trainer.name, stars)}
            activeStars={trainer.stars}
            gridTemplateColumns='repeat(5, 1fr)'
          />
          <Button
            leftIcon={<ViewIcon />}
            w='100%'
            colorScheme='blue'
            borderRadius={0}
            onClick={() => onOpen()}
          >
            Details
          </Button>
        </Flex>
        {isOpen && (
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
                      onChange={setModalStars}
                      activeStars={modalStars}
                      gridTemplateColumns='repeat(5, 30px)'
                      justifyContent='center'
                    />
                    <Grid
                      gridTemplateColumns='repeat(2, 1fr)'
                      gridColumnGap={3}
                      gridRowGap={3}
                      gridAutoRows='40px'
                      mt={2}
                    >
                      <SkillsDisplay skills={trainer.skills[modalStars]} />
                    </Grid>
                  </Box>
                </ModalBody>
              </ModalContent>
            </ModalOverlay>
          </Modal>
        )}
      </>
    );
  }
);

export default Trainer;
