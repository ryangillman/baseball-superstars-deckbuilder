import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Flex, Text, Switch } from '@chakra-ui/core';
import Deck from '../Deck';
import Trainerlist from '../Trainerlist';

import { replaceFirstNullWithValue } from '../../util';
import useFilter from '../../hooks/useFilter';
import useTrainers from '../../hooks/useTrainers';
import useRoster from '../../hooks/useRoster';

const getTrainersFromParams = () => {
  const params = new URLSearchParams(window.location.search);

  const trainers = params.get('trainers');
  if (trainers) {
    return trainers.split(',').map((row) => row.split('_'));
    // [["trainerName", "upgradeLevel"]]
  }
  return null;
};

const getRosterIdFromParams = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('rosterid') || null;
};

const setTrainersToParamValues = (trainerParams, onlyRoster, roster) => (
  row
) => {
  const paramTrainer = trainerParams.find((val) => val[0] === row.name);
  if (paramTrainer) {
    return { ...row, stars: parseInt(paramTrainer[1], 10) };
  }
  if (onlyRoster) {
    return { ...row, stars: roster?.[row.name] };
  }
  return { ...row, stars: 1 };
};

const DeckBuilder = () => {
  const [allTrainers, setAllTrainers] = useState([]);
  const [useRosterTrainers, setUseRosterTrainers] = useState(true);
  const [selectedTrainerIds, setSelectedTrainerIds] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const { data: trainers, isSuccess: isSuccessTrainers } = useTrainers();

  const rosterId = getRosterIdFromParams();

  const { data: roster, isSuccess: isSuccessRoster } = useRoster(rosterId);

  const { items, filters, setFilters } = useFilter(allTrainers);

  useEffect(() => {
    if (!isSuccessRoster || !isSuccessTrainers) return;
    setAllTrainers(() => {
      if (useRosterTrainers) {
        return (
          trainers
            ?.map((row) => ({ ...row, stars: roster?.trainers?.[row.name] }))
            .filter((row) => row.stars !== 0) || []
        );
      }
      return trainers?.map((row) => ({ ...row, stars: 1 })) || [];
    });
    // roster and trainers are stable values, don't need to be in dependency array
    // eslint-disable-next-line
  }, [useRosterTrainers]);

  useEffect(() => {
    if (!isSuccessTrainers || !isSuccessRoster) return;

    const trainerParams = getTrainersFromParams();

    if (trainerParams) {
      setAllTrainers(() => {
        const trainerArray = trainers.map(
          setTrainersToParamValues(trainerParams, !!rosterId, roster?.trainers)
        );
        if (rosterId) {
          return trainerArray.filter((row) => row.stars !== 0);
        }
        return trainerArray;
      });
      setSelectedTrainerIds(() =>
        trainerParams.map(([name]) => (name === 'null' ? null : name))
      );
      // setUseRosterTrainers(!!rosterId);
    } else if (rosterId || useRosterTrainers) {
      setAllTrainers(() =>
        trainers
          ?.map((row) => ({
            ...row,
            stars: roster?.trainers?.[row.name],
          }))
          .filter((row) => row.stars !== 0)
      );
    } else {
      setAllTrainers(trainers.map((row) => ({ ...row, stars: 1 })));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainers, roster, isSuccessRoster, isSuccessTrainers]);

  const selectedTrainers = useMemo(
    () =>
      selectedTrainerIds.map(
        (id) => allTrainers.find((trainer) => trainer.name === id) || null
      ),
    [allTrainers, selectedTrainerIds]
  );

  const updateTrainerStars = useCallback((name, stars) => {
    setAllTrainers((prev) =>
      prev.map((row) => {
        if (row.name === name) return { ...row, stars };
        return row;
      })
    );
  }, []);

  const updateAllTrainerStars = useCallback((stars) => {
    setAllTrainers((prev) => prev.map((row) => ({ ...row, stars })));
  }, []);

  const updateSelectedTrainers = useCallback((trainer) => {
    setSelectedTrainerIds((prev) => {
      if (prev.includes(trainer?.name)) {
        return prev.map((row) => (row === trainer?.name ? null : row));
      }
      return replaceFirstNullWithValue(prev, trainer?.name);
    });
  }, []);

  return (
    <>
      <Deck
        selectedTrainers={selectedTrainers}
        updateTrainerStars={updateTrainerStars}
        updateSelectedTrainers={updateSelectedTrainers}
        filters={filters}
        setFilters={setFilters}
      />
      <Flex justifyContent='center' alignItems='center'>
        <Text color='gray.300' fontWeight='700' fontSize='20px'>
          Show all trainers
        </Text>
        <Switch
          size='lg'
          isChecked={useRosterTrainers}
          mx={3}
          onChange={(e) => setUseRosterTrainers(e.target.checked)}
        />
        <Text color='gray.300' fontWeight='700' fontSize='20px'>
          Show only {rosterId ? `${roster?.owner || ''}s ` : 'my'} Roster
        </Text>
      </Flex>
      <Trainerlist
        selectedTrainers={selectedTrainers}
        updateSelectedTrainers={updateSelectedTrainers}
        allTrainers={items}
        updateTrainerStars={updateTrainerStars}
        setFilters={setFilters}
        skillFilter={filters?.skills}
        updateAllTrainerStars={updateAllTrainerStars}
        showOverlay
      />
    </>
  );
};

export default DeckBuilder;
