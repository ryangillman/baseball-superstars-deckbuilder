import { theme } from '@chakra-ui/core';

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    rarity: {
      UR: '#FFAB17',
      SSR: '#ff4242',
      SR: '#8222FC',
      R: '#0014FF',
      N: '#65CF24',
    },
  },
};

export default customTheme;
