import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@chakra-ui/core';
import useRoster from '../../hooks/useRoster';
import Trainerlist from '../Trainerlist';
import { createRosterObject } from '../../util';
import useTrainers from '../../hooks/useTrainers';
import useSaveRoster from '../../hooks/useSaveRoster';
import useFilter from '../../hooks/useFilter';

const RosterManager = (props) => {
  const [roster, setRoster] = useState(null);
  const { data, isSuccess: isSuccessRoster } = useRoster();
  const { data: allTrainers, isSuccess: isSuccessTrainers } = useTrainers();

  const saveRosterPersistent = useSaveRoster();

  const { items, filters, setFilters } = useFilter(roster);

  useEffect(() => {
    if ((isSuccessRoster, isSuccessTrainers)) {
      setRoster(() => {
        if (!data?.trainers)
          return allTrainers.map((row) => ({ ...row, stars: 1 }));

        return allTrainers?.map((row) => {
          if (data?.trainers?.[row.name]) {
            return { ...row, stars: data?.trainers?.[row.name] };
          }
          return { ...row, stars: 0 };
        });
      });
    }
  }, [data, allTrainers, isSuccessRoster, isSuccessTrainers]);

  const saveRoster = () => {
    saveRosterPersistent(roster.reduce(createRosterObject, {}));
  };

  const updateRoster = useCallback((trainername, stars) => {
    setRoster((prev) =>
      prev.map((row) => {
        if (row.name === trainername) return { ...row, stars };
        return row;
      })
    );
  }, []);

  return (
    <>
      <Button onClick={saveRoster}>Test</Button>
      {roster && (
        <Trainerlist
          allTrainers={items}
          updateTrainerStars={updateRoster}
          setFilters={setFilters}
          skillFilter={filters?.skillFilter}
          withRemove
        />
      )}
    </>
  );
};

export default RosterManager;
