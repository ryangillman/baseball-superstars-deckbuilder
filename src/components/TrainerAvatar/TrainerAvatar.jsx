import React from 'react';

const Placeholder = require('../../assets/trainerImages/placeholder.png');

const TrainerAvatar = ({ src, alt }) => {
  if (!src) return <img width='100%' src={Placeholder} alt={alt} />;
  return <img width='100%' src={src} alt={alt} />;
};

export default React.memo(TrainerAvatar);
