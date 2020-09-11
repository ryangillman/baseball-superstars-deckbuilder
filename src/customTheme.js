import { theme } from '@chakra-ui/core';

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    rarity: {
      UR: '#FFAB17',
      SSR: '#ff4242',
      SR: '#4B1C86',
      R: '#1927D0',
      N: '#65CF24',
    },
  },
};

export default customTheme;
