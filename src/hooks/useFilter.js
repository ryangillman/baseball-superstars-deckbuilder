import { useMemo, useState, useCallback } from 'react';
import { battingPositions, pitchingPositions } from '../assets/positions';

import useTrainerDisplaySettings from './useTrainerDisplaySettings';

const trainerHasSkills = (
  trainer,
  { skillNames, skillLevels },
  searchTypeAnd = false
) =>
  Object.entries(trainer.skills).some(([, skills]) =>
    searchTypeAnd
      ? skillNames.every(
          (row) =>
            Object.keys(skills).includes(row) && skills[row] >= skillLevels[row]
        )
      : skillNames.some(
          (row) =>
            Object.keys(skills).includes(row) && skills[row] >= skillLevels[row]
        )
  );

const trainerHasSkillsOnCurrentUpgrade = (
  trainer,
  { skillNames, skillLevels } = {},
  searchTypeAnd = false
) =>
  searchTypeAnd
    ? skillNames.every(
        (row) =>
          Object.keys(trainer.skills[trainer.stars]).includes(row) &&
          trainer.skills[trainer.stars][row] >= skillLevels[row]
      )
    : skillNames.some(
        (row) =>
          Object.keys(trainer.skills[trainer.stars]).includes(row) &&
          trainer.skills[trainer.stars][row] >= skillLevels[row]
      );

const getTrainerDisplaySettings = (state) => [
  state.skillSearchTypeAnd,
  state.searchSkillOnlyInActiveUpgrade,
];

const useFilter = (allTrainers) => {
  const [
    skillSearchTypeAnd,
    searchSkillOnlyInActiveUpgrade,
  ] = useTrainerDisplaySettings(getTrainerDisplaySettings);
  const [filters, setFilters] = useState({});

  const updateFilters = useCallback((object, replaceAll = false) => {
    setFilters((prev) => {
      if (typeof object === 'function') {
        return replaceAll ? object(prev) : { ...prev, ...object(prev) };
      }
      return replaceAll ? object : { ...prev, ...object };
    });
  }, []);

  const items = useMemo(
    () =>
      allTrainers?.filter((row) =>
        Object.entries(filters).every(([key, value]) => {
          switch (key) {
            case 'name':
              if (!row.name.toLowerCase().includes(value.toLowerCase()))
                return false;
              break;
            case 'position': {
              if (
                value.length &&
                !value.includes(row.position) &&
                !(
                  value.includes('pitching') &&
                  pitchingPositions.includes(row.position)
                ) &&
                !(
                  value.includes('batting') &&
                  battingPositions.includes(row.position)
                )
              )
                return false;
              break;
            }
            case 'rarity':
              if (value.length && !value.includes(row.rarity)) return false;
              break;
            case 'type':
              if (value.length && !value.includes(row.type)) return false;
              break;
            case 'bonusteams':
              if (
                value.length &&
                !row?.bonusTeam?.some((team) => value.includes(team))
              )
                return false;
              break;
            case 'skills':
              if (
                value?.skillNames?.length &&
                !searchSkillOnlyInActiveUpgrade &&
                !trainerHasSkills(row, value, skillSearchTypeAnd)
              ) {
                return false;
              }
              if (
                value?.skillNames?.length &&
                searchSkillOnlyInActiveUpgrade &&
                !trainerHasSkillsOnCurrentUpgrade(
                  row,
                  value,
                  skillSearchTypeAnd
                )
              ) {
                return false;
              }
              break;
            default:
              return true;
          }
          return true;
        })
      ) || [],
    [allTrainers, filters, searchSkillOnlyInActiveUpgrade, skillSearchTypeAnd]
  );
  return { items, filters, setFilters: updateFilters };
};

export default useFilter;
