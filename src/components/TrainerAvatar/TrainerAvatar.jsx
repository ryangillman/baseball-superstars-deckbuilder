import React from 'react';

const TrainerAvatar = ({ src, alt }) => (
  <img width='100%' src={src} alt={alt} />
);

export default React.memo(TrainerAvatar);
