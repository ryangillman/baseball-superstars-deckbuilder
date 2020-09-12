import React, { useMemo, useCallback } from 'react';
import { Flex, Button, Text, Box, useDisclosure } from '@chakra-ui/core';
import { ViewIcon } from '@chakra-ui/icons';
import trainerImages from '../../assets/trainerImages';
import SelectedTrainerOverlay from '../SelectedTrainerOverlay';
import TypeIcon from '../TypeIcon';
import TrainerDetailsModal from '../TrainerDetailsModal';
import UpgradeSelector from '../UpgradeSelector';
import { getSkillColor } from '../../util';

import TeamIcon from '../TeamIcon';
import useTrainerDisplaySettings, {
  getSearchSkillOnlyInActiveUpgrade,
} from '../../hooks/useTrainerDisplaySettings';

const Trainer = React.memo(
  ({
    trainer,
    updateSelectedTrainers,
    updateTrainerStars,
    showOverlay = false,
    trainerIndex,
    skillFilter,
    onUpgradeMouseEnter,
    onUpgradeMouseLeave,
    trainerValue,
  }) => {
    const dontHighlightNeededUpgrades = useTrainerDisplaySettings(
      getSearchSkillOnlyInActiveUpgrade
    );

    const onUpgradeSelectorChange = useCallback(
      (stars) => updateTrainerStars(trainer.name, stars),
      [trainer.name, updateTrainerStars]
    );

    const { isOpen, onOpen, onClose } = useDisclosure();
    const rarityColor = `rarity.${trainer.rarity}`;

    const skillGrades = useMemo(() => {
      if (dontHighlightNeededUpgrades || !skillFilter) return {};
      return skillFilter.reduce((acc, row) => {
        const color = getSkillColor(row);

        const starsCount = Object.keys(trainer.skills)
          .filter((key) => Object.keys(trainer.skills[key]).includes(row))
          .map((key) => ({ key, level: trainer.skills[key][row] }))
          .filter((star, i, arr) => {
            const otherKeys = arr
              .filter(
                (innerRow) =>
                  innerRow.level === star.level && innerRow.key !== star.key
              )
              .map((innerRow) => parseInt(innerRow.key, 10));
            if (!otherKeys.length) return true;
            return (
              parseInt(star.key, 10) ===
              Math.min(...[...otherKeys, parseInt(star.key, 10)])
            );
          });
        const newValues = starsCount.reduce(
          (innerAcc, stars) => ({
            ...innerAcc,
            [stars?.key]: [
              ...(acc?.[stars?.key] || []),
              {
                skillId: row,
                color,
                level: stars.level,
              },
            ],
          }),
          {}
        );
        return {
          ...acc,
          ...newValues,
        };
      }, {});
    }, [skillFilter, dontHighlightNeededUpgrades, trainer]);

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
              <img
                width='100%'
                src={trainerImages[trainer.name]}
                alt={trainer.name}
              />

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
            {trainerValue && trainerIndex === -1 && (
              <Flex
                alignItems='center'
                justifyContent='center'
                position='absolute'
                right={0}
                left='5px'
                top='5px'
                width='30px'
                height='30px'
                pointerEvents='none'
                bg='gray.200'
              >
                <Text>{trainerValue}</Text>
              </Flex>
            )}
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
            onChange={onUpgradeSelectorChange}
            activeStars={trainer.stars}
            gridTemplateColumns='repeat(5, 1fr)'
            skillGrades={skillGrades}
            onUpgradeMouseEnter={onUpgradeMouseEnter}
            onUpgradeMouseLeave={onUpgradeMouseLeave}
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
        <TrainerDetailsModal {...{ isOpen, onClose, trainer }} />
      </>
    );
  }
);

export default Trainer;
