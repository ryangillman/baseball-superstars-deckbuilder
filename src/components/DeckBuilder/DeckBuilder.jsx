import React, { useState, useEffect } from 'react';
import Deck from '../Deck';
import Trainerlist from '../Trainerlist';
import allTrainersData from '../../allTrainers';
import { replaceFirstNullWithValue } from '../../util';

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const trainers = params.get('trainers');
    if (trainers) {
      const trainerArray = trainers.split(',').map((row) => row.split('_'));
      setSelectedTrainers(
        trainerArray.map(([name]) => (name === 'null' ? null : name))
      );

      const trainerStars = trainerArray.reduce(
        (acc, [name, stars]) => ({ ...acc, [name]: parseInt(stars, 10) }),
        {}
      );

      setAllTrainers((prev) => {
        const newTrainers = Object.entries(trainerStars).reduce(
          (acc, [key, value]) => {
            if (value) return { ...acc, [key]: { ...prev[key], stars: value } };
            return acc;
          },
          {}
        );

        return { ...prev, ...newTrainers };
      });
    }
  }, []);

  const updateTrainerStars = (name, stars) => {
    setAllTrainers((prev) => ({ ...prev, [name]: { ...prev[name], stars } }));
  };

  const updateSelectedTrainers = (trainerName) => {
    setSelectedTrainers((prev) => {
      if (prev.includes(trainerName)) {
        return prev.map((row) => (row === trainerName ? null : row));
      }
      const newArray = replaceFirstNullWithValue(prev, trainerName);
      return newArray;
    });
  };

  return (
    <>
      <Deck
        selectedTrainers={selectedTrainers}
        setSelectedTrainers={setSelectedTrainers}
        allTrainers={allTrainers}
        updateTrainerStars={updateTrainerStars}
        updateSelectedTrainers={updateSelectedTrainers}
      />
      <Trainerlist
        selectedTrainers={selectedTrainers}
        updateSelectedTrainers={updateSelectedTrainers}
        allTrainers={Object.values(allTrainers)}
        updateTrainerStars={updateTrainerStars}
      />
    </>
  );
};

export default DeckBuilder;
