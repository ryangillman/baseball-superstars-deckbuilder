import randomColor from 'randomcolor';
import { getSkills } from './api/skillQueries';

let allSkills;
const skillGrades = ['N', 'R', 'SR', 'SSR', 'UR'];

const replaceFirstNullWithValue = (arr, value) => {
  const firstIndexOfNull = arr.indexOf(null);
  return arr.map((row, i) => (i === firstIndexOfNull ? value : row));
};

const getSkillColor = (skillId) =>
  randomColor({ luminosity: 'light', seed: skillId });

const getSkillLevelsSum = (trainers) =>
  trainers.reduce((acc, trainer) => {
    const curTrainerSkills = trainer?.skills[trainer?.stars];

    if (!curTrainerSkills) return acc;
    const newSkillLevels = Object.entries(curTrainerSkills).reduce(
      (skillsAcc, [skillName, skillLevel]) => {
        let currLevel = skillLevel;
        if (acc[skillName]) currLevel = acc[skillName] + skillLevel;
        return {
          ...skillsAcc,
          [skillName]: Math.min(parseInt(currLevel, 10), 5),
        };
      },
      {}
    );

    return { ...acc, ...newSkillLevels };
  }, {});

const getSkillLevelDiff = (newSkills, oldSkills) => {
  const changedSkills = Object.keys(newSkills)
    .filter((row) => newSkills[row] !== oldSkills[row])
    .reduce((acc, key) => {
      if (!oldSkills[key]) {
        return { ...acc, [key]: { value: newSkills[key], from: 0 } };
      }
      return {
        ...acc,
        [key]: { value: newSkills[key] - oldSkills[key], from: oldSkills[key] },
      };
    }, {});

  const missingSkills = Object.keys(oldSkills)
    .filter((row) => newSkills?.[row] === undefined)
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: { value: -oldSkills[key], from: oldSkills[key] },
      }),
      {}
    );

  return { ...changedSkills, ...missingSkills };
};

const getValue = (num, from, skillValueFactor = 1) => {
  let val = 0;
  for (let i = from + 1; i <= num; i += 1) {
    switch (num) {
      case 5:
        val += 8 * skillValueFactor;
        break;
      case 4:
        val += 5 * skillValueFactor;
        break;
      default:
        val += num * skillValueFactor;
        break;
    }
  }
  return val;
};

const getSkillValuesOfTrainer = (skillsInDeck, trainerSkills) =>
  Object.keys(trainerSkills).map((row) => {
    const skillValueFactor =
      (skillGrades?.indexOf(allSkills[row].skillGrade) || 0) + 1;
    const deckSkillLevel = parseInt(skillsInDeck[row], 10) || 0;
    const trainerSkillLevel = parseInt(trainerSkills[row], 10);
    return getValue(
      Math.min(trainerSkillLevel + deckSkillLevel, 5),
      deckSkillLevel,
      skillValueFactor
    );
  });

const getTrainerValueForDeck = (skillsInDeck, trainerSkills) => {
  if (!allSkills) allSkills = getSkills();
  const skillValues = getSkillValuesOfTrainer(skillsInDeck, trainerSkills);
  return skillValues.reduce((acc, row) => acc + row);
};

const trainersToUrl = (trainers) =>
  trainers.some((row) => row !== null)
    ? trainers.reduce((acc, trainer, i, arr) => {
        const needsComma = i < arr.length - 1;
        if (trainer !== null)
          return `${acc}${trainer.name}_${trainer.stars}${
            needsComma ? ',' : ''
          }`;
        return `${acc}null${needsComma ? ',' : ''}`;
      }, 'trainers=')
    : '';

const createDeckUrl = (trainers, withBaseUrl = false, rId, withRoster) => {
  const params = new URLSearchParams(window.location.search);
  if (withRoster === false) params.delete('rosterid');
  if (rId) params.set('rosterid', rId);

  const { trainers: trainerParam, ...restParams } =
    Object.fromEntries(params.entries()) || {};

  const paramsString = Object.entries(restParams || {})
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  const baseUrl = withBaseUrl
    ? `${window.location.protocol}//${window.location.hostname}${
        window.location.port ? `:${window.location.port}` : ''
      }/?${paramsString ? `${paramsString}&` : ''}`
    : `/?${paramsString ? `${paramsString}&` : ''}`;

  const completeUrl = `${baseUrl}${trainersToUrl(trainers)}`;
  return encodeURI(completeUrl);
};

const createRosterObject = (acc, row) => ({ ...acc, [row.name]: row.stars });

export {
  createDeckUrl,
  trainersToUrl,
  replaceFirstNullWithValue,
  getSkillColor,
  getSkillLevelsSum,
  getSkillLevelDiff,
  getTrainerValueForDeck,
  createRosterObject,
};
