import React from 'react';
import { Grid, Box } from '@chakra-ui/core';

const UpgradeSelector = ({
  activeStars,
  onChange,
  skillGrades,
  onUpgradeMouseEnter,
  onUpgradeMouseLeave,
  ...props
}) => (
  <Grid py={1} {...props}>
    {[1, 2, 3, 4, 5].map((stars) => (
      <button
        key={stars}
        className={`upgrade-icon ${
          activeStars >= stars ? 'active-upgrade' : 'inactive-upgrade'
        }`}
        onClick={() => onChange(stars)}
        title={`Active ${stars}-star upgrade`}
        onMouseEnter={() =>
          activeStars !== stars &&
          onUpgradeMouseEnter &&
          onUpgradeMouseEnter(stars)
        }
        onMouseLeave={() =>
          activeStars !== stars &&
          onUpgradeMouseLeave &&
          onUpgradeMouseLeave(stars)
        }
      >
        {`Activate ${stars}-star upgrade`}
        {(activeStars < stars &&
          skillGrades?.[stars]?.map((row, i, arr) => (
            <Box
              {...{
                border: '4px solid',
                borderRadius: '30px',
                height: '20px',
                width: '20px',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                margin: 'auto',
                opacity: 0,
                zIndex: 5,
              }}
              animation={`pulsate${arr.length} ${
                arr.length * 0.5
              }s ease-in-out infinite ${i * 0.5}s`}
              borderColor={row.color}
            />
          ))) ||
          null}
      </button>
    ))}
  </Grid>
);

export default UpgradeSelector;
