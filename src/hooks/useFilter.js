import { useMemo, useState, useCallback } from 'react';

import useTrainerDisplaySettings from './useTrainerDisplaySettings';

const trainerHasSkills = (trainer, searchValues, searchTypeAnd = false) =>
  Object.entries(trainer.skills).some(([, skills]) =>
    searchTypeAnd
      ? searchValues.every((row) => Object.keys(skills).includes(row))
      : searchValues.some((row) => Object.keys(skills).includes(row))
  );

const trainerHasSkillsOnCurrentUpgrade = (
  trainer,
  searchValues,
  searchTypeAnd = false
) =>
  searchTypeAnd
    ? searchValues.every((row) =>
        Object.keys(trainer.skills[trainer.stars]).includes(row)
      )
    : searchValues.some((row) =>
        Object.keys(trainer.skills[trainer.stars]).includes(row)
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
            case 'position':
              if (value.length && !value.includes(row.position)) return false;
              break;
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
                value.length &&
                !searchSkillOnlyInActiveUpgrade &&
                !trainerHasSkills(row, value, skillSearchTypeAnd)
              ) {
                return false;
              }
              if (
                value.length &&
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
