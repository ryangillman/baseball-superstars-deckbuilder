import randomColor from 'randomcolor';

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

const getValue = (num, from) => {
  let val = 0;
  for (let i = from + 1; i <= num; i += 1) {
    switch (num) {
      case 5:
        val += 15;
        break;
      case 4:
        val += 8;
        break;
      default:
        val += num;
        break;
    }
  }
  return val;
};

const getSkillValuesForDeck = (oldSkills, addedSkills) =>
  Object.keys(addedSkills).reduce((acc, row) => {
    if (!oldSkills[row]) {
      return acc + getValue(Math.min(parseInt(addedSkills[row], 10), 5), 0);
    }
    return (
      acc +
      getValue(
        Math.min(
          parseInt(addedSkills[row], 10) + parseInt(oldSkills[row], 10),
          5
        ),
        parseInt(oldSkills[row], 10)
      )
    );
  }, 0);

const trainersToUrl = (trainers) =>
  trainers.reduce((acc, trainer, i, arr) => {
    const needsComma = i < arr.length - 1;
    if (trainer !== null)
      return `${acc}${trainer.name}_${trainer.stars}${needsComma ? ',' : ''}`;
    return `${acc}null${needsComma ? ',' : ''}`;
  }, '');

export {
  trainersToUrl,
  replaceFirstNullWithValue,
  getSkillColor,
  getSkillLevelsSum,
  getSkillLevelDiff,
  getSkillValuesForDeck,
};
