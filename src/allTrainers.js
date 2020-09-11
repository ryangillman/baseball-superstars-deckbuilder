import trainers from './assets/trainers.json';

const riverCityNames = [
  'Nina',
  'Flamesh',
  'Medica',
  'Kryzer',
  'Tauric',
  'Kyoko',
  'Marvel',
  'Genie',
  'Arco',
  'Kate',
  'Riki',
  'Pskyer',
  'Kunio',
  'Yomi',
  'Zhizi',
  'Psyche',
  'Misaka',
  'Amir',
  'Dice',
  'Drake',
  'Stinger',
  'Shuri',
];

const cookie = false;
const allTrainers = !cookie
  ? trainers.map((row) => ({
      ...row,
      stars: 1,
      bonusTeam: riverCityNames.includes(row.name)
        ? 'River City'
        : row.bonusTeam,
    }))
  : null;

export default allTrainers;
