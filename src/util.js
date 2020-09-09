import randomColor from 'randomcolor';

const replaceFirstNullWithValue = (arr, value) => {
  const firstIndexOfNull = arr.indexOf(null);
  return arr.map((row, i) => (i === firstIndexOfNull ? value : row));
};

const getSkillColor = (skillId) =>
  randomColor({ luminosity: 'light', seed: skillId });

export { replaceFirstNullWithValue, getSkillColor };
