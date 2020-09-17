import React, { useMemo, useCallback } from 'react';
import { Flex, Button, Text, Box, useDisclosure } from '@chakra-ui/core';
import { ViewIcon, CloseIcon } from '@chakra-ui/icons';
import trainerImages from '../../assets/trainerImages';
import SelectedTrainerOverlay from '../SelectedTrainerOverlay';
import TypeIcon from '../TypeIcon';
import TrainerDetailsModal from '../TrainerDetailsModal';
import UpgradeSelector from '../UpgradeSelector';
import TrainerAvatar from '../TrainerAvatar';
import { getSkillColor } from '../../util';

import TeamIcon from '../TeamIcon';
import useTrainerDisplaySettings, {
  getSearchSkillOnlyInActiveUpgrade,
} from '../../hooks/useTrainerDisplaySettings';

const Trainer = ({
  trainer,
  updateSelectedTrainers,
  updateTrainerStars,
  showOverlay,
  overlayText,
  trainerIndex,
  skillFilter,
  onUpgradeMouseEnter,
  onUpgradeMouseLeave,
  trainerValue,
  withRemove,
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
          onClick={() =>
            updateSelectedTrainers && updateSelectedTrainers(trainer)
          }
        >
          <Box position='relative'>
            {withRemove && (
              <Button
                onClick={() => updateTrainerStars(trainer.name, 0)}
                position='absolute'
                top='5px'
                right='5px'
                bg='red.300'
                _hover={{
                  bg: 'red.400',
                }}
                borderRadius='8px'
                title='Remove Trainer from Roster'
                w='30px'
                h='30px'
              >
                <CloseIcon />
              </Button>
            )}
            <TrainerAvatar
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
            show={(showOverlay && trainerIndex !== -1) || trainer.stars === 0}
            text={overlayText || ''}
          />
          {(trainerValue && (
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
          )) ||
            null}
          <Flex
            position='absolute'
            right={0}
            left={0}
            top={0}
            transform='translateY(-50%)'
            mx='auto'
            width='100%'
            height='40px'
            pointerEvents='none'
            justifyContent='center'
          >
            {trainer?.bonusTeam?.map((team) => (
              <TeamIcon team={team} key={team} />
            ))}
          </Flex>
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
      {isOpen && <TrainerDetailsModal {...{ isOpen, onClose, trainer }} />}
    </>
  );
};

export default React.memo(Trainer);
