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

const getSkillLevelDiff = (newSkills, oldSkills) =>
  Object.keys(newSkills)
    .filter((row) => newSkills[row] !== oldSkills[row])
    .reduce((acc, key) => {
      if (!oldSkills[key]) {
        return { ...acc, [key]: newSkills[key] };
      }
      return { ...acc, [key]: newSkills[key] - oldSkills[key] };
    }, {});

export {
  replaceFirstNullWithValue,
  getSkillColor,
  getSkillLevelsSum,
  getSkillLevelDiff,
};
