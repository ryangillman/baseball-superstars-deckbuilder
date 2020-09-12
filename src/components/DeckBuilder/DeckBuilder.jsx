import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Deck from '../Deck';
import Trainerlist from '../Trainerlist';
import allTrainersData from '../../allTrainers';
import { replaceFirstNullWithValue } from '../../util';
import useFilter from '../../hooks/useFilter';

const getTrainersFromParams = () => {
  const params = new URLSearchParams(window.location.search);

  const trainers = params.get('trainers');
  if (trainers) {
    const trainerArray = trainers.split(',').map((row) => row.split('_'));
    return trainerArray;
    // [["trainerName", "upgradeLevel"]]
  }
  return null;
};

const DeckBuilder = () => {
  const [allTrainers, setAllTrainers] = useState(allTrainersData);
  const [selectedTrainerIds, setSelectedTrainerIds] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const { items, filters, setFilters } = useFilter(allTrainers);

  useEffect(() => {
    const trainerData = getTrainersFromParams();
    if (trainerData) {
      setAllTrainers((prev) => {
        const newTrainers = prev.map((row) => {
          const paramTrainer = trainerData.find((val) => val[0] === row.name);
          if (paramTrainer) {
            return { ...row, stars: parseInt(paramTrainer[1], 10) };
          }
          return row;
        });
        return newTrainers;
      });
      setSelectedTrainerIds(() =>
        trainerData.map(([name]) => (name === 'null' ? null : name))
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Trainerlist
        selectedTrainers={selectedTrainers}
        updateSelectedTrainers={updateSelectedTrainers}
        allTrainers={items}
        updateTrainerStars={updateTrainerStars}
        setFilters={setFilters}
        skillFilter={filters?.skills}
        updateAllTrainerStars={updateAllTrainerStars}
      />
    </>
  );
};

export default DeckBuilder;
