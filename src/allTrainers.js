import trainers from './assets/trainers.json';

const cookie = false;
const allTrainers = !cookie
  ? trainers.map((row) => ({ ...row, stars: 1 }))
  : null;

export default allTrainers;
