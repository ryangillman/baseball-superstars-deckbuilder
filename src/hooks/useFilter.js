import { useMemo, useState } from 'react';

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

const useFilter = (allTrainers) => {
  const [filters, setFilters] = useState({});

  const items = useMemo(
    () =>
      allTrainers.filter((row) =>
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
            case 'skills':
              if (
                value.length &&
                !filters.skillSearchOnlyCurrentUpgrade &&
                !trainerHasSkills(row, value, filters.skillSearchTypeAnd)
              ) {
                return false;
              }
              if (
                value.length &&
                filters.skillSearchOnlyCurrentUpgrade &&
                !trainerHasSkillsOnCurrentUpgrade(
                  row,
                  value,
                  filters.skillSearchTypeAnd
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
      ),
    [allTrainers, filters]
  );
  return { items, filters, setFilters };
};

export default useFilter;
