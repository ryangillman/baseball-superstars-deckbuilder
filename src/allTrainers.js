import trainers from './assets/trainers.json';

const cookie = false;
let allTrainers = {};
if (!cookie) {
  allTrainers = trainers.reduce(
    (acc, row) => ({
      ...acc,
      [row.name]: { ...row, stars: 1 },
    }),
    {}
  );
}

export default allTrainers;
