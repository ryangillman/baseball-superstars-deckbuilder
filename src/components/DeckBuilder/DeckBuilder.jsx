import React, { useState, useEffect, useCallback } from 'react';
import { forceCheck } from 'react-lazyload';
import Deck from '../Deck';
import Trainerlist from '../Trainerlist';
import allTrainersData from '../../allTrainers';
import { replaceFirstNullWithValue } from '../../util';
import useFilter from '../../hooks/useFilter';

const DeckBuilder = () => {
  const [allTrainers, setAllTrainers] = useState(allTrainersData);
  const [selectedTrainers, setSelectedTrainers] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const { items, filters, setFilters } = useFilter(allTrainers);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const trainers = params.get('trainers');
    if (trainers) {
      const trainerArray = trainers.split(',').map((row) => row.split('_'));

      const trainerStars = trainerArray.reduce(
        (acc, [name, stars]) => ({ ...acc, [name]: parseInt(stars, 10) }),
        {}
      );

      setSelectedTrainers(
        trainerArray.map(
          ([name]) => allTrainers.find((row) => row.name === name) || null
        )
      );

      setAllTrainers((prev) => {
        const newTrainers = prev.map((row) => {
          if (trainerStars[row.name]) {
            return { ...row, stars: trainerStars[row.name] };
          }
          return row;
        });
        return newTrainers;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    forceCheck();
  }, [items]);

  useEffect(() => {
    setSelectedTrainers((prev) =>
      prev.map(
        (trainer) =>
          allTrainers.find((row) => row.name === trainer?.name) || null
      )
    );
  }, [allTrainers]);

  const updateTrainerStars = useCallback((name, stars) => {
    setAllTrainers((prev) =>
      prev.map((row) => {
        if (row.name === name) return { ...row, stars };
        return row;
      })
    );
  }, []);

  const updateSelectedTrainers = useCallback((trainer) => {
    setSelectedTrainers((prev) => {
      if (prev.some((row) => row?.name === trainer?.name)) {
        return prev.map((row) => (row?.name === trainer?.name ? null : row));
      }
      const newArray = replaceFirstNullWithValue(prev, trainer);
      return newArray;
    });
  }, []);

  const updateFilters = useCallback(
    (filterType, filterValue) => {
      setFilters((prev) => ({ ...prev, [filterType]: filterValue }));
    },
    [setFilters]
  );

  return (
    <>
      <Deck
        selectedTrainers={selectedTrainers}
        updateTrainerStars={updateTrainerStars}
        updateSelectedTrainers={updateSelectedTrainers}
        filters={filters}
        setFilters={setFilters}
        shouldHighlightNeededUpgrades={!filters?.skillSearchOnlyCurrentUpgrade}
      />
      <Trainerlist
        selectedTrainers={selectedTrainers}
        updateSelectedTrainers={updateSelectedTrainers}
        allTrainers={items}
        updateTrainerStars={updateTrainerStars}
        updateFilters={updateFilters}
        skillFilter={filters?.skills}
        shouldHighlightNeededUpgrades={!filters?.skillSearchOnlyCurrentUpgrade}
      />
    </>
  );
};

export default DeckBuilder;
