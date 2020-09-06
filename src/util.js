const replaceFirstNullWithValue = (arr, value) => {
  const firstIndexOfNull = arr.indexOf(null);
  return arr.map((row, i) => (i === firstIndexOfNull ? value : row));
};

export { replaceFirstNullWithValue };
