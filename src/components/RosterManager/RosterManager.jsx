import React, { useState, useEffect, useCallback } from 'react';
import { Button, Flex, useToast } from '@chakra-ui/core';
import useRoster from '../../hooks/useRoster';
import Trainerlist from '../Trainerlist';
import { createRosterObject } from '../../util';
import useTrainers from '../../hooks/useTrainers';
import useSaveRoster from '../../hooks/useSaveRoster';
import useFilter from '../../hooks/useFilter';
import useAuth from '../../hooks/useAuth';
import fileDownload from 'js-file-download';

const RosterManager = () => {
  const [roster, setRoster] = useState(null);
  const { data, isSuccess: isSuccessRoster } = useRoster();
  const { data: allTrainers, isSuccess: isSuccessTrainers } = useTrainers();

  const { user } = useAuth();
  const saveRosterPersistent = useSaveRoster();
  const toast = useToast();
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
    // eslint-disable-next-line
  }, [
    data,
    allTrainers,
    isSuccessRoster,
    isSuccessTrainers,
    saveRosterPersistent,
  ]);

  const saveRoster = () => {
    saveRosterPersistent(roster.reduce(createRosterObject, {}));
    toast({
      title: 'Success.',
      description: 'Roster was saved.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  const exportRoster = () => {
    const exportData = roster.reduce((acc, trainer) => {
      if (trainer.stars === 0) return acc;
      return { ...acc, [trainer.name]: trainer.stars };
    }, {});

    fileDownload(JSON.stringify(exportData), 'My Roster.json');
  };

  const updateRoster = useCallback((trainername, stars) => {
    setRoster((prev) =>
      prev.map((row) => {
        if (row.name === trainername) return { ...row, stars };
        return row;
      })
    );
  }, []);

  const shareRoster = () => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ''
    }/?`;

    navigator.clipboard.writeText(`${baseUrl}rosterid=${user.roster}`);
  };

  return roster ? (
    <>
      <Flex justifyContent='center' position='sticky' top={5} zIndex={100}>
        <Button colorScheme='green' onClick={saveRoster}>
          Save Roster
        </Button>
        <Button colorScheme='blue' ml={5} onClick={() => exportRoster()}>
          Export Roster
        </Button>
        {user && (
          <Button colorScheme='blue' ml={5} onClick={shareRoster}>
            Share Roster
          </Button>
        )}
      </Flex>

      <Trainerlist
        allTrainers={items}
        updateTrainerStars={updateRoster}
        setFilters={setFilters}
        skillFilter={filters?.skillFilter}
        withRemove
      />
    </>
  ) : null;
};

export default RosterManager;
