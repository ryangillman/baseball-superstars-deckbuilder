import React from 'react';
import { Grid } from '@chakra-ui/core';

const UpgradeSelector = ({ activeStars, onChange, ...props }) => (
  <Grid py={1} {...props}>
    {[1, 2, 3, 4, 5].map((stars) => (
      <button
        key={stars}
        className={`upgrade-icon ${
          activeStars >= stars ? 'active-upgrade' : 'inactive-upgrade'
        }`}
        onClick={() => onChange(stars)}
        title='Active {stars}-star upgrade'
      >
        Active {stars}-star upgrade
      </button>
    ))}
  </Grid>
);

export default UpgradeSelector;
